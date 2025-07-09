# 👨‍💻 Development Rules & Guidelines

These rules apply to **all contributors and PRs** in this project. Follow them strictly to maintain quality and avoid regressions.

---

## ✅ Base Rules for Every PR

1. **Keep the application runnable**
   - After every PR, the backend and frontend must start without errors.
   - If you modify a major service, ensure local deployment or dev environment still works (e.g., `docker-compose up` or `kubectl apply` should succeed).

2. **Include test coverage**
   - Every feature, service, or API must have **unit or integration tests**.
   - Write tests in the same PR unless explicitly discussed.

3. **Do not delete files or major code blocks without approval**
   - Renaming or deleting files must be communicated in the PR description.
   - Avoid breaking working flows.

4. **Seek approval before implementing any new major feature**
   - Create a design discussion or PR draft before jumping into large changes.
   - Use the Cursor `rules` file to break big features into small steps.

5. **Keep commits atomic and meaningful**
   - One logical change per commit.
   - Use clear commit messages like:
     - `feat(auth): add JWT login endpoint`
     - `fix(upload): resolve file size limit bug`
     - `test(rag): add embedding tests for .txt files`

6. **Follow PR Template**
   - Always describe what's changed and why.
   - Mention related issue or Cursor rule step.

---

## 🧪 Test Strategy

### Backend Testing (`pytest`)
- Write tests for all API endpoints
- Mock external services (LLM, WhatsApp, etc.)
- Use fixtures for common test data
- Aim for >80% coverage for critical paths

### Frontend Testing (`Karma + Jasmine`)
- Unit test all services and components
- Use TestBed for component testing
- Mock HTTP calls and external dependencies
- Test form validations thoroughly

### Integration Testing
- Focus on RAG-related endpoints
- Test document processing pipeline
- Verify embedding generation
- Test chat completion flows

---

## 📂 Folder Structure Expectations

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
  /tests
    /api
    /services
    /utils
  /config
```

### Frontend Structure
```
/frontend
  /src
    /app
      /components
      /services
      /models
      /utils
      /pages
    /assets
    /environments
```

### Configuration
- All services must support ENV-based config
- Use `.env.example` for documentation
- Keep secrets in Kubernetes secrets
- Use ConfigMaps for non-sensitive config

---

## 🚀 CI/CD Guidelines

### Docker Requirements
- Keep Dockerfiles optimized and secure
- Use multi-stage builds where appropriate
- Document all exposed ports and volumes
- Include health checks

### Kubernetes Compatibility
- PR should never break Kubernetes manifest compatibility
- Update deployment yamls when adding new services
- Document resource requirements
- Include readiness/liveness probes

### Monitoring & Logging
- Add appropriate metrics for new features
- Include relevant log statements
- Follow structured logging format
- Support trace ID propagation

---

## 💻 Development Environment

### Required Tools
- Docker & Docker Compose
- Kubernetes (minikube/kind)
- Python 3.10+
- Node.js 18+
- VSCode or compatible IDE

### Local Setup
- Use `docker-compose` for development
- Keep resource usage reasonable
- Document any new development dependencies
- Update setup scripts as needed

---

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Document public functions
- Use black for formatting

### TypeScript (Frontend)
- Follow Angular style guide
- Use strict type checking
- Document public methods
- Use ESLint + Prettier

---

Remember: These guidelines ensure consistency and quality across the project. When in doubt, ask in the PR discussion or refer to existing implementations. 