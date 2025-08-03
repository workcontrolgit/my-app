export const environment = {
  production: false,
  development: false,
  apiUrl: 'https://staging-api.myapp.com/v1',
  apiTimeout: 15000,
  enableDebugMode: true,
  enableLogging: true,
  enableMockData: false,
  appName: 'My App - Staging',
  version: '1.0.0-staging',
  features: {
    enableAddressManagement: true,
    enableApprovalWorkflow: true,
    enableUserProfiles: true,
    enableAnalytics: true
  },
  ui: {
    defaultPageSize: 15,
    enableAnimations: true,
    theme: 'light'
  },
  security: {
    tokenExpirationMinutes: 45,
    enableCSRF: true,
    enableHTTPS: true
  }
};