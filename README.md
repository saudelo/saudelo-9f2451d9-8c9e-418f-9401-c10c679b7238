# Secure-Task-Management-System
Secure Task Management System - Setup Guide
This guide will help you set up and run the project on your local machine.
Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v20.11+ or v24+)
Download from nodejs.org
Verify installation: node --version
npm (comes with Node.js)
Verify installation: npm --version
Git
Download from git-scm.com
Verify installation: git --version
Installation Steps
1. Clone the Repository
git clone <repository-url>
cd <project-folder-name>

2. Install Dependencies
From the project root directory, run:
npm install

This will install all required dependencies for both the frontend (Angular dashboard) and backend (NestJS API).
3. Environment Configuration (if applicable)
If the project requires environment variables, create a .env file in the root directory or in apps/api/:
# Example .env file
DATABASE_PATH=./database.sqlite
JWT_SECRET=your-secret-key-here
PORT=3000

Ask the project maintainer for the required environment variables.
Running the Application
Development Mode
The project uses Nx monorepo, which allows you to run multiple applications simultaneously.
Run the Full Application (Frontend + Backend)
npx nx serve dashboard

This command will:
Start the NestJS API backend (usually on http://localhost:3000)
Start the Angular dashboard frontend (usually on http://localhost:4200)
Automatically proxy API requests from frontend to backend
Run Backend Only
npx nx serve api

The API will be available at http://localhost:3000
Run Frontend Only
npx nx serve dashboard

The dashboard will be available at http://localhost:3000
Production Build
To build the application for production:
# Build both applications
npx nx run-many --target=build --all

# Or build individually
npx nx build api
npx nx build dashboard

Built files will be in the dist/ directory.
Project Structure
├── apps/
│   ├── api/              # NestJS backend application
│   │   └── src/
│   └── dashboard/        # Angular frontend application
│       └── src/
├── node_modules/         # Dependencies (generated)
├── dist/                 # Built files (generated)
├── package.json          # Project dependencies
└── nx.json              # Nx workspace configuration

Available Commands
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

Troubleshooting

Node Version Issues
If you encounter Node.js version errors, ensure you're using the correct version:
node --version  # Should be 20.11+, or 24+

Consider using a Node version manager like nvm:
nvm install 20
nvm use 20

Clear Cache and Reinstall
If you encounter unexpected errors:
# Remove node_modules and caches
rm -rf node_modules
rm -rf .nx/cache
rm -rf dist

# Reinstall dependencies
npm install

Database Issues
If the SQLite database has issues, you can delete and regenerate it:
rm database.sqlite
# Restart the API, and it will create a new database
npx nx serve api

Default Credentials (if applicable)
Ask the project maintainer for default login credentials or how to create an initial user.
Additional Resources
Nx Documentation
NestJS Documentation
Angular Documentation
Support
If you encounter any issues not covered in this guide, please:
Check the project's issue tracker
Contact the project maintainer
Review the error logs in the terminal
Development Tips
Keep your Node.js version up to date
Run npm install after pulling new changes
Clear the Nx cache if you experience build issues: npx nx reset
Use npx nx graph to visualize project dependencies

