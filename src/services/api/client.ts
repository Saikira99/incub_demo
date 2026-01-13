// API client for frontend services
// Centralized HTTP client with error handling

import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function callEdgeFunction<T>(
  functionName: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    params?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, params } = options;

  try {
    // Get current session for auth header
    const { data: { session } } = await supabase.auth.getSession();

    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const endpoint = functionName.replace('admin-', 'admin/');

    // Construct URL handling both absolute and relative base URLs
    let url: URL;
    if (baseUrl.startsWith('http')) {
      url = new URL(`${baseUrl}/${endpoint}`);
    } else {
      // For relative paths in production
      const origin = window.location.origin;
      url = new URL(`${origin}${baseUrl}/${endpoint}`);
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error(`Edge function ${functionName} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
