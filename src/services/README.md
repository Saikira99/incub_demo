# Frontend Services

This folder contains frontend API services that communicate with the backend.

## Structure

```
services/
├── api/              # API client and utilities
├── auth.ts           # Authentication service
├── products.ts       # Product-related API calls
├── orders.ts         # Order management
├── cart.ts           # Cart operations
└── notifications.ts  # Notification handling
```

## Usage

Import services in components:

```typescript
import { productsService } from '@/services/products';
import { authService } from '@/services/auth';
```

## Guidelines

- All API calls should go through services, not directly in components
- Use React Query for data fetching and caching
- Handle errors consistently with toast notifications
