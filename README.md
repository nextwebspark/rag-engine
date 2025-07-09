# RAG Engine

A scalable RAG (Retrieval-Augmented Generation) based AI agent system that allows organizations to create accounts, upload documents, and interact through WhatsApp using LLM-powered responses.

## Features

- Multi-organization support with admin accounts
- Document upload and management system
- RAG-based LLM integration
- WhatsApp Business API integration
- Scalable Kubernetes deployment

## Architecture

### System Components

1. **Frontend (Angular SPA)**
   - Authentication Module
   - Document Management Interface
   - Admin Dashboard
   - Organization Management
   - Real-time Chat Interface

2. **Backend Services**
   - Authentication Service (JWT-based)
   - Document Processing Service
   - RAG Engine Service
   - WhatsApp Integration Service
   - Vector Store Service

3. **Storage Layer**
   - PostgreSQL (User/Org data)
   - MinIO (Document storage)
   - Vector Database (Document embeddings)
   - Redis (Caching/Session)

4. **Infrastructure**
   - Kubernetes Cluster
   - Nginx Ingress Controller
   - Prometheus/Grafana Monitoring
   - ELK Stack for Logging

## Tech Stack

### Frontend
- Angular 17+
- Angular Material
- NgRx for state management
- RxJS
- Jest for testing
- ESLint + Prettier

### Backend
- Python 3.10+
- FastAPI
- PostgreSQL
- Redis for caching
- Celery for async tasks
- Vector database (Qdrant/Weaviate)
- pytest for testing

### Infrastructure
- Docker
- Kubernetes
- MinIO (S3-compatible storage)
- Nginx
- Prometheus/Grafana
- ELK Stack

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker
- Kubernetes cluster
- MinIO

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nextwebspark/rag-engine.git
   cd rag-engine
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Infrastructure Setup**
   ```bash
   # Start MinIO
   docker-compose up minio

   # Start PostgreSQL
   docker-compose up postgres

   # Start Redis
   docker-compose up redis
   ```

## Development Workflow

1. Create a feature branch from main
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push changes and create PR
   ```bash
   git push origin feature/your-feature-name
   ```

4. Wait for CI checks and code review

## Deployment

Kubernetes deployment instructions will be added as the project progresses.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE) 