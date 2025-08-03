export const environment = {
  production: false,
  development: false,
  apiUrl: 'http://localhost:3001/api',
  apiTimeout: 5000,
  enableDebugMode: true,
  enableLogging: false,
  enableMockData: true,
  appName: 'My App - Test',
  version: '1.0.0-test',
  features: {
    enableAddressManagement: true,
    enableApprovalWorkflow: true,
    enableUserProfiles: true,
    enableAnalytics: false
  },
  ui: {
    defaultPageSize: 5,
    enableAnimations: false,
    theme: 'light'
  },
  security: {
    tokenExpirationMinutes: 15,
    enableCSRF: false,
    enableHTTPS: false
  }
};