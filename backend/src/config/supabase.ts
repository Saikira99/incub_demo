import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Primary client for general operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for restricted operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to create an authenticated client using the user's token
export const createAuthClient = (token: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};
