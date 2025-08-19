# Clinical Trial Matching System

A decentralized clinical trial matching system using Fetch.ai's uAgents and the Internet Computer Protocol (ICP). The system enables privacy-preserving matching of patients with clinical trials while maintaining data security and patient control.

## 🏗️ System Architecture

![System Architecture](https://via.placeholder.com/800x400.png?text=Architecture+Diagram)

### Core Components

- **uAgents (Fetch.ai)**: Patient, Trial, and Matching agents with ASI protocol support
- **Internet Computer Protocol (ICP)**: Canister smart contracts for data storage and matching logic
- **Frontend**: React-based patient portal and research organization dashboard
- **MCP System**: Model Context Protocol server for tool integration
- **Image AI**: DALL-E 3 image generation and Claude 3.5 image analysis
- **Monitoring**: Prometheus metrics and Grafana dashboards

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.11+
- DFX SDK (for ICP development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd greyguard-trials-quest

# Copy environment template
cp env.example .env

# Edit .env with your API keys
nano .env
```

### 2. Deploy Locally

```bash
# Run the deployment script
./deploy_local.sh

# Or manually:
npm install
npm run build
docker-compose up -d
```

### 3. Access the System

- **Frontend**: http://localhost:3000
- **DFX Local**: http://localhost:8000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AGENTVERSE_API_KEY=your_agentverse_api_key_here

# ICP Configuration
DFX_NETWORK=local
DFX_HOST=127.0.0.1:8000

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=clinical_trials
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure_password_123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### API Keys Required

- **OpenAI**: For DALL-E 3 image generation and GPT-4 prompt optimization
- **Anthropic**: For Claude 3.5 image analysis
- **Agentverse**: For uAgent deployment and management

## 🏥 Features

### Patient Management
- Secure profile creation with encrypted health data
- Zero-knowledge proof generation for privacy
- Bitcoin blockchain anchoring for audit trails
- Consent management with granular permissions

### Clinical Trial Matching
- Privacy-preserving matching algorithms
- ASI protocol integration for agent communication
- Multi-criteria matching (symptoms, location, age, gender)
- Real-time eligibility verification

### AI Integration
- Natural language processing for patient queries
- Image generation for medical visualization
- Image analysis for medical imaging
- Dynamic task routing to specialized agents

### Security & Privacy
- AES-256 encryption for sensitive data
- Merkle tree certification for data integrity
- Principal-based authentication on ICP
- Automatic key rotation and audit logging

## 🐳 Docker Services

The system runs the following services:

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| DFX Local | 8000 | ICP local network |
| Patient Agent | 8002 | Patient management uAgent |
| Trial Agent | 8003 | Trial management uAgent |
| Matching Agent | 8004 | Matching engine uAgent |
| MCP Server | 8005 | Model Context Protocol server |
| Redis | 6379 | Message broker and caching |
| PostgreSQL | 5432 | Additional data storage |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Monitoring dashboard |

## 📊 Monitoring

### Metrics Available

- Agent request counts and durations
- Error rates by type
- Active connections
- Health check status
- Performance metrics

### Accessing Metrics

```bash
# View all metrics
curl http://localhost:9090/metrics

# Access Grafana dashboard
open http://localhost:3001
# Username: admin, Password: admin
```

## 🔌 API Endpoints

### Patient Agent

- `POST /profile` - Create/update patient profile
- `POST /matching` - Request clinical trial matching
- `POST /consent` - Grant/revoke consent
- `GET /matches` - Get matching history

### Trial Agent

- `POST /trial` - Register new clinical trial
- `GET /trials` - List available trials
- `PUT /trial/:id` - Update trial information
- `DELETE /trial/:id` - Remove trial

### Matching Engine

- `POST /match` - Process matching request
- `GET /eligibility/:patient_id/:trial_id` - Check eligibility
- `POST /consent-request` - Request patient consent

## 🧪 Development

### Running Agents Locally

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start individual agents
cd agents
python -m uagents.run patient_agent
python -m uagents.run trial_agent
python -m uagents.run matching_agent
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### ICP Canister Development

```bash
# Start local network
dfx start --background

# Deploy canisters
dfx deploy

# View canister status
dfx canister status clinical_trial_matcher
```

## 🚀 Deployment

### Local Development

```bash
./deploy_local.sh
```

### Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Agentverse Deployment

```bash
# Deploy to Agentverse
agentverse deploy patient_agent
agentverse deploy trial_agent
agentverse deploy matching_agent
```

## 🧪 Testing

### Run Tests

```bash
# Frontend tests
npm test

# Python tests
pytest tests/

# Integration tests
npm run test:integration
```

### Test Coverage

```bash
# Frontend coverage
npm run test:coverage

# Python coverage
pytest --cov=agents tests/
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guide](docs/SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards

- TypeScript for frontend
- Python 3.11+ for agents
- Motoko for ICP canisters
- Follow existing code style
- Add comprehensive tests

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- [Issues](https://github.com/your-org/clinical-trial-matching/issues)
- [Discussions](https://github.com/your-org/clinical-trial-matching/discussions)
- [Documentation](docs/)

### Common Issues

#### Services Not Starting

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs [service_name]

# Restart services
docker-compose restart
```

#### API Key Issues

```bash
# Verify environment variables
cat .env

# Check if keys are loaded
docker-compose exec frontend env | grep API_KEY
```

#### Port Conflicts

```bash
# Check port usage
lsof -i :3000
lsof -i :8000

# Stop conflicting services
sudo lsof -ti:3000 | xargs kill -9
```

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic patient and trial management
- ✅ ASI protocol integration
- ✅ Image AI capabilities
- ✅ MCP server implementation

### Phase 2 (Next)
- 🔄 Advanced ZK proof generation
- 🔄 Multi-chain integration
- 🔄 Machine learning matching
- 🔄 Mobile application

### Phase 3 (Future)
- 📋 Regulatory compliance tools
- 📋 Advanced analytics dashboard
- 📋 International trial support
- 📋 AI-powered trial design

---

**Note**: This system maintains a 100% patient opt-in model where:
1. Patients control all personal health data
2. No data is shared without explicit consent
3. Matching occurs through privacy-preserving computations
4. All operations are auditable via blockchain records
