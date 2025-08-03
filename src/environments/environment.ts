export const environment = {
  production: false,
  development: true,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  enableDebugMode: true,
  enableLogging: true,
  enableMockData: true,
  appName: 'My App - Development',
  version: '1.0.0-dev',
  features: {
    enableAddressManagement: true,
    enableApprovalWorkflow: true,
    enableUserProfiles: true,
    enableAnalytics: false
  },
  ui: {
    defaultPageSize: 10,
    enableAnimations: true,
    theme: 'light'
  },
  security: {
    tokenExpirationMinutes: 60,
    enableCSRF: false,
    enableHTTPS: false
  }
};