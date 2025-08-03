export const environment = {
  production: true,
  development: false,
  apiUrl: 'https://api.myapp.com/v1',
  apiTimeout: 10000,
  enableDebugMode: false,
  enableLogging: false,
  enableMockData: false,
  appName: 'My App',
  version: '1.0.0',
  features: {
    enableAddressManagement: true,
    enableApprovalWorkflow: true,
    enableUserProfiles: true,
    enableAnalytics: true
  },
  ui: {
    defaultPageSize: 20,
    enableAnimations: true,
    theme: 'light'
  },
  security: {
    tokenExpirationMinutes: 30,
    enableCSRF: true,
    enableHTTPS: true
  }
};