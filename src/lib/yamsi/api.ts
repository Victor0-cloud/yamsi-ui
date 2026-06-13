import { YAMSI_CONFIG, YAMSIContext, buildHeaders } from './config';

export class YAMSIApi {
  private context: YAMSIContext;

  constructor(context: YAMSIContext) {
    this.context = context;
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = `${YAMSI_CONFIG.API_URL}${endpoint}`;
    const headers = buildHeaders(this.context);

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`YAMSI API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health & Status
  async getHealth() {
    return this.request('GET', '/health');
  }

  // Context Management
  async getContext() {
    return this.request('POST', '/context/get');
  }

  async setContext(data: Partial<YAMSIContext>) {
    return this.request('POST', '/context/set', data);
  }

  async listContexts() {
    return this.request('GET', '/context/list');
  }

  // Business Management
  async getBusinessType() {
    return this.request('POST', '/business/type');
  }

  async classifyRoute() {
    return this.request('POST', '/classify/route');
  }

  async createBusiness(data: { name: string; type: string }) {
    return this.request('POST', '/business/create', data);
  }

  async listBusinesses() {
    return this.request('GET', '/business/list');
  }

  // Branch Management
  async createBranch(data: { name: string; business_id: string }) {
    return this.request('POST', '/branch/create', data);
  }

  async listBranches() {
    return this.request('GET', '/branch/list');
  }

  // Tasks
  async listTasks() {
    return this.request('GET', '/tasks/list');
  }

  async createTask(data: {
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
  }) {
    return this.request('POST', '/tasks/create', data);
  }

  async moveTask(taskId: string, status: string) {
    return this.request('POST', '/tasks/move', { task_id: taskId, status });
  }

  async updateTask(taskId: string, data: any) {
    return this.request('POST', '/tasks/update', { task_id: taskId, ...data });
  }

  async deleteTask(taskId: string) {
    return this.request('POST', '/tasks/delete', { task_id: taskId });
  }

  // Memory
  async writeMemory(data: { key: string; value: unknown }) {
    return this.request('POST', '/memory/write', data);
  }

  async searchMemory(query: string) {
    return this.request('POST', '/memory/search', { query });
  }

  async quickReadMemory(key: string) {
    return this.request('POST', '/memory/quick-read', { key });
  }

  // Cost Settings (Water)
  async getCostSettings() {
    return this.request('POST', '/cost-settings/get');
  }

  async upsertCostSettings(data: any) {
    return this.request('POST', '/cost-settings/upsert', data || {});
  }

  async calculateWaterProfit(data?: unknown) {
    return this.request('POST', '/calculate/water-profit-v2', data || {});
  }

  // Poultry Settings
  async getPoultrySettings() {
    return this.request('POST', '/poultry/settings/get');
  }

  async upsertPoultrySettings(data: any) {
    return this.request('POST', '/poultry/settings/upsert', data || {});
  }

  async calculatePoultryProfit(data?: unknown) {
    return this.request('POST', '/calculate/poultry-profit', data || {});
  }
}

// Singleton instance
let apiInstance: YAMSIApi | null = null;

export function initializeAPI(context: YAMSIContext): YAMSIApi {
  apiInstance = new YAMSIApi(context);
  return apiInstance;
}

export function getAPI(): YAMSIApi {
  if (!apiInstance) {
    const context: YAMSIContext = {
      tenant_id: YAMSI_CONFIG.TENANT_ID,
      user_id: YAMSI_CONFIG.USER_ID,
    };
    apiInstance = new YAMSIApi(context);
  }
  return apiInstance;
}
