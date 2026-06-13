// YAMSI API Configuration
export const YAMSI_CONFIG = {
  API_URL: import.meta.env.VITE_YAMSI_API_URL || 'https://yamsi-server.onrender.com',
  API_KEY: import.meta.env.VITE_YAMSI_API_KEY || 'R6nPy5vP9qMnT5wZjC9rZ4fHfA6dCgZuZ2iNbNrXBwYwavj2',
  TENANT_ID: import.meta.env.VITE_YAMSI_TENANT_ID || '00000000-0000-0000-0000-000000000001',
  USER_ID: import.meta.env.VITE_YAMSI_USER_ID || 'victor',
};

export interface YAMSIContext {
  tenant_id: string;
  user_id: string;
  business_id?: string;
  branch_id?: string;
  business_type?: string;
}

export type RequestHeaders = Record<string, string>;

export function buildHeaders(context: YAMSIContext): RequestHeaders {
  const headers: any = {
    'x-yamsi-key': YAMSI_CONFIG.API_KEY,
    'x-yamsi-user': context.user_id,
    'x-yamsi-tenant': context.tenant_id,
    'Content-Type': 'application/json',
  };

  if (context.business_id) {
    headers['x-yamsi-business'] = context.business_id;
  }
  if (context.branch_id) {
    headers['x-yamsi-branch'] = context.branch_id;
  }
  if (context.business_type) {
    headers['x-yamsi-business-type'] = context.business_type;
  }

  return headers;
}
