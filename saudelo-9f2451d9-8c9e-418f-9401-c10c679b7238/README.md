# Secure Task Management System - Setup Guide

This guide will help you set up and run the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.19+ or v20.11+ or v24+)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder-name>
```

### 2. Install Dependencies

From the project root directory, run:

```bash
npm install
```

This will install all required dependencies for both the frontend (Angular dashboard) and backend (NestJS API).


## Running the Application

### Development Mode

The project uses Nx monorepo, which allows you to run multiple applications simultaneously.

#### Run the Full Application (Frontend + Backend)

```bash
npx nx serve dashboard
```

This command will:
- Start the NestJS API backend (usually on `http://localhost:3000`)
- Start the Angular dashboard frontend (usually on `http://localhost:4200`)
- Automatically proxy API requests from frontend to backend

#### Run Backend Only

```bash
npx nx serve api
```

The API will be available at `http://localhost:3000/api`

#### Run Frontend Only

```bash
npx nx serve dashboard
```

The dashboard will be available at `http://localhost:3000/dashboard`

### Production Build

To build the application for production:

```bash
# Build both applications
npx nx run-many --target=build --all

# Or build individually
npx nx build api
npx nx build dashboard
```

Built files will be in the `dist/` directory.

## Technology Stack

### Backend (NestJS API)
- **Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Password Security**: bcrypt for password hashing
- **API Prefix**: All endpoints prefixed with `/api`

### Frontend (Angular Dashboard)
- **Framework**: Angular
- **Build Tool**: esbuild
- **Styling**: Tailwind CSS
- **Routing**: Angular Router

### Monorepo
- **Tool**: Nx
- **Package Manager**: npm

## Project Structure

```
├── apps/
│   ├── api/              # NestJS backend application
│   │   └── src/
│   │       ├── app/
│   │       │   ├── auth/           # Authentication module (JWT)
│   │       │   ├── task/           # Task management module
│   │       │   ├── entities/       # TypeORM entities
│   │       │   │   └── user.entity.ts
│   │       │   ├── app.module.ts
│   │       │   └── app.controller.ts
│   │       └── main.ts
│   └── dashboard/        # Angular frontend application
│       └── src/
├── node_modules/         # Dependencies (generated)
├── dist/                 # Built files (generated)
├── dev.db               # SQLite database (generated)
├── package.json          # Project dependencies
└── nx.json              # Nx workspace configuration
```

## Available Commands

```bash
# Start development servers
npx nx serve dashboard    # Run frontend + backend
npx nx serve api         # Run backend only

# Build for production
npx nx build api         # Build backend
npx nx build dashboard   # Build frontend

# Run tests
npx nx test api          # Test backend
npx nx test dashboard    # Test frontend

# Lint code
npx nx lint api          # Lint backend
npx nx lint dashboard    # Lint frontend

# Clear Nx cache (if you encounter issues)
npx nx reset
```

## Troubleshooting

### Port Already in Use

If you get an error that port 3000 or 4200 is already in use:

```bash
# On macOS/Linux, find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:4200 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Node Version Issues

If you encounter Node.js version errors, ensure you're using the correct version:

```bash
node --version  # Should be 18.19+, 20.11+, or 24+
```

Consider using a Node version manager like [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20
nvm use 20
```

### Clear Cache and Reinstall

If you encounter unexpected errors:

```bash
# Remove node_modules and caches
rm -rf node_modules
rm -rf .nx/cache
rm -rf dist

# Reinstall dependencies
npm install
```

### Database Issues

If the SQLite database has issues, you can delete and regenerate it:

```bash
rm dev.db
# Restart the API, and it will create a new database with the schema
npx nx serve api
```

The database schema is automatically created based on your TypeORM entities when `synchronize: true` is set.

### Testing Authentication

**Quick test flow:**

1. Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123","orgId":"demo-org"}'
```

2. Login and save the token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

3. Use the token to access protected routes:
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <paste-your-token-here>"
```

### Common Authentication Errors

- **401 Unauthorized on /api/tasks**: Your JWT token is missing, invalid, or expired
- **500 Error on register/login**: Check that the User entity is properly imported in `app.module.ts`
- **"User already exists"**: The username is already taken, try a different username

## API Endpoints

### Authentication (Public - No JWT Required)

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","orgId":"org-001"}'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "orgId": "org-001"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "orgId": "org-001"
  }
}
```

### Tasks (Protected - JWT Required)

All task endpoints require the `Authorization: Bearer <token>` header.

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"Complete project","description":"Finish the task management system"}'
```

**Get all tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"completed":true}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Authentication & Security

This application uses JWT (JSON Web Tokens) for authentication:

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Secret**: Currently set to `dev-secret` (change this in production!)
- **Token Expiration**: JWT tokens expire after 24 hours
- **Protected Routes**: All `/api/tasks/*` endpoints require a valid JWT token
- **User Isolation**: Users can only access their own tasks

### Security Notes for Production

Before deploying to production:

1. **Change the JWT secret** in `apps/api/src/app/auth/auth.module.ts` and `apps/api/src/app/auth/jwt.strategy.ts`
2. Set `synchronize: false` in TypeORM configuration (in `app.module.ts`)
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Add rate limiting to prevent brute force attacks
6. Consider implementing refresh tokens

## Additional Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Angular Documentation](https://angular.io/docs)

## Support

If you encounter any issues not covered in this guide, please:
1. Check the project's issue tracker
2. Contact the project maintainer
3. Review the error logs in the terminal

## Development Tips

- Keep your Node.js version up to date
- Run `npm install` after pulling new changes
- Clear the Nx cache if you experience build issues: `npx nx reset`
- Use `npx nx graph` to visualize project dependencies
