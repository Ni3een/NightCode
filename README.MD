# 🌙 NightCode

> AI-powered coding assistant for your terminal — Build faster, code smarter.

[![npm version](https://img.shields.io/npm/v/ainightcode.svg)](https://www.npmjs.com/package/ainightcode)
[![npm downloads](https://img.shields.io/npm/dm/ainightcode.svg)](https://www.npmjs.com/package/ainightcode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**NightCode** is a beautiful, terminal-native AI coding assistant that brings the power of multiple AI models (GPT, Claude, Gemini, Groq) directly to your command line. Think of it as your always-on pair programmer.

## ✨ Features

- 🤖 **Multiple AI Models** - Choose from GPT-5, Claude Opus/Sonnet/Haiku, Gemini, and Groq
- 🎨 **Beautiful Terminal UI** - Modern, responsive interface built with React Ink
- 🔐 **Secure Authentication** - OAuth integration with Clerk
- 💳 **Credit-based Billing** - Pay-as-you-go model with transparent pricing
- 🚀 **Real-time Streaming** - Get AI responses as they're generated
- 📁 **Context-Aware** - Works with your project files and structure
- 🛠️ **Tool Integration** - Execute commands, read/write files, and more

## 🚀 Quick Start

### Installation

```bash
npm install -g ainightcode
```

### Usage

Simply run:

```bash
ainightcode
```

That's it! The CLI will launch an interactive session where you can:
- Ask coding questions
- Generate code snippets
- Debug issues
- Refactor code
- Get explanations

## 📦 Tech Stack

### Frontend (CLI)
- **Runtime**: Node.js (v18+)
- **UI Framework**: React + Ink
- **Styling**: Tailwind-inspired terminal colors
- **HTTP Client**: Hono Client

### Backend (Server)
- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL + Prisma
- **Authentication**: Clerk OAuth
- **Deployment**: Railway
- **AI Models**: OpenAI, Anthropic, Google AI, Groq

### Infrastructure
- **Package Registry**: npm
- **Version Control**: Git + GitHub
- **CI/CD**: Custom publish scripts
- **Monitoring**: Railway metrics

## 🏗️ Architecture

```
NightCode/
├── packages/
│   ├── cli/          # Terminal interface (published to npm)
│   ├── server/       # Backend API (deployed to Railway)
│   ├── database/     # Prisma schema & migrations
│   └── shared/       # Shared types & utilities
└── scripts/          # Build & publish automation
```

## 💻 Development

### Prerequisites
- [Node.js](https://nodejs.org) >= 18.0.0
- [Bun](https://bun.sh) >= 1.0.0 (for development)
- PostgreSQL database
- Clerk account for authentication

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Ni3een/NightCode.git
cd NightCode
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Run database migrations:
```bash
cd packages/database
bunx prisma migrate dev
```

5. Start development servers:
```bash
# Terminal CLI
bun run dev

# Backend API
bun run dev:server
```

## 🔧 Configuration

Users can override default settings by creating `~/.ainightcode/.env`:

```env
API_URL=http://localhost:3000
CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_OAUTH_CLIENT_ID=your-client-id
```

## 📝 Commands

Inside the NightCode CLI:
- `tab` - Switch between agents/modes
- `Ctrl+C` - Cancel current request
- `Ctrl+D` - Exit
- Type your question or command and press Enter

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh)
- UI powered by [React Ink](https://github.com/vadimdemedes/ink)
- Authentication by [Clerk](https://clerk.com)
- AI models from OpenAI, Anthropic, Google, and Groq

## 📧 Contact

**Nitin Bhatt** - [GitHub](https://github.com/Ni3een)

Project Link: [https://github.com/Ni3een/NightCode](https://github.com/Ni3een/NightCode)

NPM Package: [https://www.npmjs.com/package/ainightcode](https://www.npmjs.com/package/ainightcode)

---

⭐ Star this repo if you find it helpful!
