# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 19 tutorial application demonstrating modern component architecture, Bootstrap integration, and enterprise-level UI patterns. The application features address management, approval workflows, and real-time data visualization with comprehensive test coverage.

## Development Commands

### Core Development
- `npm start` or `ng serve` - Start development server at http://localhost:4200
- `npm run build` or `ng build` - Build for production
- `npm run watch` or `ng build --watch --configuration development` - Build in watch mode

### Testing
- `npm test` or `ng test` - Run all tests in watch mode (73 tests total)
- `npm test -- --watch=false --browsers=ChromeHeadless` - Run tests once (CI mode)
- `npm test -- --code-coverage --watch=false --browsers=ChromeHeadless` - Run with coverage
- `npm test -- --include="**/address*.spec.ts" --watch=false --browsers=ChromeHeadless` - Run specific component tests
- `npm test -- --include="**/approval*.spec.ts" --watch=false --browsers=ChromeHeadless` - Run approval tests

### Build Configurations
- `ng build --configuration production` - Production build with optimizations
- `ng build --configuration development` - Development build with source maps

### Deployment
- `ng deploy` - Deploy to GitHub Pages using angular-cli-ghpages

## Architecture

### Project Structure
```
src/app/
├── core/                    # Core business logic and reusable components
│   ├── components/          # Reusable business components
│   │   ├── address/         # AddressManagerComponent - CRUD operations
│   │   └── workflow/        # ApprovalWorkflowComponent - Workflow management
│   └── services/            # Business services (AddressService, ApprovalService)
├── pages/                   # Feature pages/routes
│   ├── home/               # Landing page with quick links
│   ├── address/            # Address management page with real-time JSON display
│   ├── approval/           # Approval workflow page with real-time JSON display
│   ├── about/              # Static about page
│   ├── contact/            # Static contact page
│   ├── profile/            # User profile page
│   └── settings/           # Application settings
├── shared/                  # Shared utilities and components
│   ├── components/          # UI components (header, footer)
│   ├── models/             # TypeScript interfaces (Address, Approval)
│   ├── utils/              # Utility functions (date, validation, object utils)
│   └── constants/          # Application constants
└── environments/           # Environment-specific configurations
```

### Key Architectural Patterns

#### Standalone Components
All components use Angular's standalone component pattern with explicit imports:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './example.component.html'
})
```

#### Component Communication
- **Parent-Child with @ViewChild**: Pages access core components directly
- **Real-time Data Polling**: Automatic refresh every 2-3 seconds
- **Event-Driven Updates**: @Input/@Output for component communication

#### Route-based Lazy Loading
All pages use lazy loading with `loadComponent()` for better performance.

## Key Components

### AddressManagerComponent (`src/app/core/components/address/`)
- Complete CRUD operations for addresses
- Form validation with reactive forms
- Modal-based editing interface  
- Default address management
- Public methods for parent component access:
  - `getAddresses(): Address[]`
  - `setAddresses(addresses: Address[])`
  - `addAddress(address: Omit<Address, 'id'>): void`
  - `updateAddress(id: string, updates: Partial<Address>): boolean`
  - `removeAddress(id: string): boolean`

### ApprovalWorkflowComponent (`src/app/core/components/workflow/approval-workflow/`)
- Multi-step approval processes
- Role-based approval management
- Dynamic supervisor selection
- Complex workflow state management
- Event-driven architecture with status calculations

### Real-time Data Display Pattern
Both Address and Approval pages implement consistent real-time JSON visualization:
- Automatic data refresh with setInterval()
- @ViewChild pattern for accessing child component data
- Professional dark-theme JSON display with custom scrollbars
- Manual refresh buttons and dynamic status indicators

## Technology Stack

### Core Framework
- **Angular 19** with standalone components
- **TypeScript** with strict mode enabled
- **RxJS** for reactive programming

### UI Framework
- **Bootstrap 5.3.3** for styling and layout
- **ng-bootstrap 18.0.0** for Angular-specific Bootstrap components
- **Bootstrap Icons 1.13.1** for iconography
- **@ng-select/ng-select 14.9.0** for enhanced select dropdowns

### Build & Testing
- **Angular CLI 19** for development tooling
- **Jasmine 5.6.0** and **Karma 6.4.0** for testing
- **ChromeHeadless** for CI/CD testing
- **angular-cli-ghpages** for deployment

## Development Guidelines

### Code Style
- Use Angular's standalone component pattern
- Follow TypeScript strict mode conventions
- Implement proper error handling and form validation
- Use reactive forms over template-driven forms
- Follow consistent naming conventions (kebab-case for files, PascalCase for classes)

### Component Development
- Always include corresponding `.spec.ts` test files
- Use @ViewChild for parent-child communication when appropriate
- Implement proper lifecycle hooks (OnInit, AfterViewInit, OnDestroy)
- Use proper TypeScript interfaces for type safety
- Export public methods for component communication

### Testing Requirements
- Maintain 100% test pass rate (currently 73 tests)
- Include unit tests for all new components
- Test @Input/@Output communication patterns  
- Mock external dependencies (NgbModal, Router, etc.)
- Test form validation and CRUD operations
- Use descriptive test names following BDD patterns

### Performance Considerations
- Lazy load all page components
- Use OnPush change detection where appropriate
- Implement proper unsubscription patterns
- Optimize bundle sizes (current budgets: 500kB warning, 1MB error)

## Environment Configuration

### Development
- Source maps enabled
- No optimization
- Hot module replacement

### Production  
- Output hashing enabled
- Bundle optimization
- Tree shaking
- AOT compilation

### Testing
- ChromeHeadless for CI/CD
- Code coverage reporting
- Karma configuration with Jasmine framework

## Common Development Patterns

### Real-time Data Synchronization
```typescript
@ViewChild(ComponentName) componentRef!: ComponentName;

ngAfterViewInit() {
  this.refreshData();
  setInterval(() => this.refreshData(), 2000);
}

refreshData() {
  if (this.componentRef) {
    this.data = this.componentRef.getData();
  }
}
```

### Form Validation Pattern
```typescript
ngOnInit() {
  this.form = this.fb.group({
    field: ['', [Validators.required, Validators.minLength(2)]]
  });
}

isFormValid(): boolean {
  return this.form.valid;
}
```

### Modal Integration Pattern
```typescript
openModal(content: any) {
  this.modalService.open(content, {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  });
}
```

## Troubleshooting

### Common Issues
- If tests fail, ensure all dependencies are mocked properly
- For routing issues, verify `app.routes.ts` lazy loading syntax
- For Bootstrap styling issues, check `angular.json` styles array includes Bootstrap CSS
- For build errors, verify `tsconfig.json` strict mode compliance

### Test Debugging
- Use `npm test -- --include="**/*.spec.ts"` to run specific test files
- Check `karma.conf.js` for browser configuration
- Ensure TestBed configuration includes all required imports and providers