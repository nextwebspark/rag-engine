# 👨‍💻 Development Rules & Guidelines

These rules apply to **all contributors and PRs** in this project. Follow them strictly to maintain quality and avoid regressions.

---

## ✅ Base Rules for Every PR

1. **Keep the application runnable**
   - After every PR, the backend and frontend must start without errors
   - Run full test suite locally before pushing
   - Ensure all dependencies are properly documented
   - Verify both development and production builds

2. **Include test coverage**
   - Every feature, service, or API must have **unit or integration tests**
   - Minimum 80% code coverage for new features
   - Include edge cases and error scenarios
   - Write tests in the same PR unless explicitly discussed
   - Add performance tests for critical paths

3. **Code Quality Standards**
   - No commented-out code in PRs
   - No debug/console logs in production code
   - Follow SOLID principles
   - Use dependency injection where applicable
   - Keep functions small and focused (max 20-30 lines)
   - Maximum file size of 400 lines (split if larger)

4. **Security Best Practices**
   - No secrets in code or comments
   - Input validation for all user inputs
   - Proper error handling and logging
   - Follow OWASP security guidelines
   - Use parameterized queries for database operations
   - Implement rate limiting for APIs

5. **Documentation Requirements**
   - Update API documentation for endpoint changes
   - Include JSDoc/docstring for public methods
   - Update README if project setup changes
   - Document environment variables
   - Add comments for complex business logic

6. **Performance Considerations**
   - Optimize database queries
   - Use appropriate caching strategies
   - Minimize HTTP requests
   - Optimize bundle sizes
   - Consider pagination for large datasets

7. **Keep commits atomic and meaningful**
   - One logical change per commit
   - Follow Conventional Commits specification
   - Use clear commit messages:
     ```
     feat(auth): implement JWT authentication
     fix(upload): resolve file size validation
     perf(rag): optimize document embedding
     docs(api): update endpoint documentation
     test(chat): add conversation flow tests
     refactor(core): improve error handling
     ```

8. **PR Best Practices**
   - Keep PRs focused and small (< 400 lines when possible)
   - Include before/after screenshots for UI changes
   - Add migration steps if needed
   - List breaking changes clearly
   - Update relevant documentation

---

## 🧪 Test Strategy

### Backend Testing (`pytest`)
- Write tests for all API endpoints
- Mock external services (LLM, WhatsApp, etc.)
- Use fixtures for common test data
- Aim for >80% coverage for critical paths
- Test error scenarios and edge cases
- Include integration tests for critical flows
- Performance testing for heavy operations
- Security testing for sensitive endpoints

### Frontend Testing (`Karma + Jasmine`)
- Unit test all services and components
- Use TestBed for component testing
- Mock HTTP calls and external dependencies
- Test form validations thoroughly
- E2E tests for critical user journeys
- Accessibility testing (a11y)
- Cross-browser compatibility tests
- Mobile responsiveness testing

### Integration Testing
- Focus on RAG-related endpoints
- Test document processing pipeline
- Verify embedding generation
- Test chat completion flows
- Load testing for concurrent users
- Test data consistency across services
- Verify WebSocket connections
- Test failure recovery scenarios

---

## 📂 Folder Structure and Architecture

### Backend Structure
```
/backend
  /api
    /v1
      /auth
      /documents
      /chat
      /rag
  /core
    /services
    /models
    /utils
    /middlewares
    /decorators
  /tests
    /unit
    /integration
    /performance
  /config
    /environments
    /schemas
  /scripts
    /migrations
    /seeders
  /docs
    /api
    /architecture
```

### Frontend Structure
```
/frontend
  /src
    /app
      /components
        /shared
        /features
      /services
        /api
        /state
      /models
        /interfaces
        /types
      /utils
        /helpers
        /constants
      /pages
      /layouts
      /guards
      /interceptors
      /pipes
    /assets
    /environments
    /styles
      /themes
      /variables
    /tests
      /unit
      /e2e
```

### Configuration Management
- Use strongly typed configurations
- Validate environment variables at startup
- Separate dev/prod/test configs
- Use feature flags for gradual rollouts
- Document all configuration options
- Keep secrets in secure vaults
- Use ConfigMaps for non-sensitive data

---

## 🚀 CI/CD Guidelines

### GitHub Actions Pipeline
- **Branch Protection Rules**
  - Require status checks to pass
  - Require PR reviews
  - No direct pushes to main/master
  - Enforce signed commits

- **Workflow Structure**
  ```yaml
  # Example workflow stages
  - lint-test:
      - Code linting
      - Unit tests
      - Integration tests
  - security:
      - SAST scanning
      - Dependency checks
      - Container scanning
  - build:
      - Build artifacts
      - Build Docker images
  - deploy:
      - Deploy to EKS
      - Run smoke tests
  ```

- **Environment Secrets**
  - AWS credentials
  - Docker registry credentials
  - Database credentials
  - API keys
  - Use GitHub Environments for different stages

- **Workflow Best Practices**
  - Use reusable workflows
  - Cache dependencies
  - Use composite actions
  - Implement matrix testing
  - Set timeout limits
  - Use workflow concurrency
  - Implement proper error handling

### AWS EKS Deployment

- **Cluster Configuration**
  ```yaml
  # Required EKS settings
  - Kubernetes version: 1.27+
  - Node groups:
      - System: t3.medium (min 2 nodes)
      - Application: t3.large (auto-scaling 2-10)
      - ML/RAG: t3.2xlarge (auto-scaling 1-5)
  - Regions: us-east-1 (primary), eu-west-1 (DR)
  ```

- **Infrastructure as Code**
  - Use Terraform for EKS cluster management
  - Store Terraform state in S3
  - Use Terraform workspaces for environments
  - Version control all IaC

- **AWS Services Integration**
  - RDS for PostgreSQL
  - ElastiCache for Redis
  - S3 for document storage
  - CloudWatch for logging
  - AWS Certificate Manager for TLS
  - AWS Load Balancer Controller
  - External DNS for Route53

- **Security Requirements**
  - Use AWS KMS for encryption
  - Implement IAM roles for service accounts
  - Network policies for pod communication
  - Security groups for node access
  - Private subnets for worker nodes
  - WAF for API protection

- **Monitoring & Logging**
  - CloudWatch Container Insights
  - Prometheus + Grafana
  - AWS X-Ray for tracing
  - FluentBit for log aggregation
  - Set up proper log retention

### Docker Requirements
- Use multi-stage builds
- Minimize image layers
- Include security scanning
- Set proper user permissions
- Cache dependencies efficiently
- Document all configurations
- Include health checks
- Use specific version tags

### Kubernetes Deployment
- Use rolling updates
- Configure resource limits
- Implement auto-scaling
- Set up monitoring
- Configure backups
- Use network policies
- Implement pod disruption budgets
- Configure proper liveness/readiness probes

- **EKS-Specific Requirements**
  - Use AWS Load Balancer Controller
  - Implement AWS IAM authentication
  - Use EKS-optimized AMIs
  - Configure cluster autoscaler
  - Use node selectors for workload placement
  - Implement proper taints and tolerations

- **Deployment Strategy**
  ```yaml
  # Example deployment configuration
  - Blue/Green deployment
  - Canary releases for critical services
  - Feature flags for gradual rollout
  - Automated rollback capability
  ```

- **Resource Management**
  ```yaml
  # Example resource quotas
  - CPU limits and requests
  - Memory limits and requests
  - Storage quotas
  - Pod scaling limits
  ```

### Monitoring & Observability
- Implement structured logging
- Set up metrics collection
- Use distributed tracing
- Monitor resource usage
- Set up alerting
- Keep audit logs
- Monitor API performance
- Track error rates

### Required Tools
- Docker & Docker Compose
- Kubernetes (minikube/kind)
- Python 3.10+
- Node.js 18+
- VSCode or compatible IDE
- Git hooks for pre-commit checks
- Database management tools
- API testing tools (Postman/Insomnia)
- AWS CLI v2+
- eksctl
- kubectl
- Terraform
- AWS IAM Authenticator
- Helm v3+

### Environment Setup
- Use `docker-compose` for development
- Implement hot-reload
- Use development certificates
- Set up debugging tools
- Configure IDE extensions
- Use local development databases
- Mock external services

- **AWS Development Setup**
  - Configure AWS CLI profiles
  - Setup AWS SSO authentication
  - Configure kubectl for EKS
  - Setup AWS VPN/Direct Connect
  - Configure AWS SDK

### GitHub Repository Settings

- **Branch Protection**
  ```yaml
  main:
    - Require pull request reviews
    - Require status checks
    - Require signed commits
    - Include administrators
  ```

- **Actions Permissions**
  - Allow specific actions
  - Set up environment secrets
  - Configure OIDC for AWS
  - Set up deployment environments

- **Security Settings**
  - Enable Dependabot alerts
  - Enable code scanning
  - Configure secret scanning
  - Set up security advisories

---

## 💻 Development Environment

### Required Tools
- Docker & Docker Compose
- Kubernetes (minikube/kind)
- Python 3.10+
- Node.js 18+
- VSCode or compatible IDE
- Git hooks for pre-commit checks
- Database management tools
- API testing tools (Postman/Insomnia)

### Local Setup
- Use `docker-compose` for development
- Implement hot-reload
- Use development certificates
- Set up debugging tools
- Configure IDE extensions
- Use local development databases
- Mock external services

---

## 📝 Code Style

### Python (Backend)
- Follow PEP 8 strictly
- Use type hints everywhere
- Document all public APIs
- Use black for formatting
- Implement proper exception handling
- Use dataclasses where appropriate
- Follow asyncio best practices
- Use proper logging levels

### TypeScript (Frontend)
- Enable strict mode
- Use proper type definitions
- Follow Angular style guide
- Implement proper error handling
- Use reactive programming patterns
- Follow component lifecycle best practices
- Optimize change detection
- Use proper module organization

### General Practices
- Write self-documenting code
- Use meaningful variable names
- Keep cyclomatic complexity low
- Follow DRY principle
- Use design patterns appropriately
- Write defensive code
- Handle errors gracefully
- Use proper abstraction levels

---

## 🔒 Security Guidelines

### Authentication & Authorization
- Implement proper JWT handling
- Use secure session management
- Implement role-based access control
- Use proper password hashing
- Implement MFA where needed
- Handle token expiration
- Implement API key rotation
- Use proper CORS policies

### Data Security
- Encrypt sensitive data
- Implement proper backup strategies
- Use secure communication channels
- Implement data validation
- Handle PII properly
- Implement audit logging
- Use proper data retention policies
- Implement data masking

---

Remember: These guidelines ensure consistency, quality, and security across the project. When in doubt, ask in the PR discussion or refer to existing implementations. 