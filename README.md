# 🤖 AI-Powered Code Review Assistant

## 📝 Overview
The AI-Powered Code Review Assistant is a sophisticated tool that leverages artificial intelligence to analyze GitHub pull requests. It provides instant, detailed code reviews by examining PR descriptions, code changes, and file modifications. The system integrates seamlessly with GitHub's OAuth for authentication and offers a user-friendly interface for managing and reviewing pull requests.

Built with modern web technologies and powered by GROQ's advanced AI capabilities, this tool provides comprehensive code analysis and review suggestions in real-time.

## 🛠️ Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (v18.3.1 or higher)
- npm (v9.0.0 or higher)
- Git
- A GitHub account
- A GitHub OAuth application (for authentication)
- A GROQ API key (for AI analysis)

## 🚀 Frontend Setup
1. Navigate to the Client directory:
   ```bash
   cd Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Client directory with your GitHub OAuth credentials:
   ```
   VITE_GITHUB_CLIENT_ID=your_client_id
   VITE_GITHUB_CLIENT_SECRET=your_client_secret
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend is built with:
- React 18.3.1
- TypeScript 5.7.2
- Vite 6.2.0
- Chakra UI 1.8.8
- React Router 6.22.1
- React Markdown 10.1.0

## 🔧 Backend Setup
1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Server directory:
   ```
   PORT=3001
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GROQ_API_KEY=your_groq_api_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

The backend is built with:
- Node.js
- Express 5.1.0
- TypeScript 5.8.3
- Axios 1.9.0

## 🧠 How It Works
The application follows a sophisticated workflow:

1. **Authentication Flow**:
   - Users authenticate via GitHub OAuth
   - Access tokens are securely stored in localStorage
   - Session management ensures secure access
   - Automatic redirection to dashboard when logged in

2. **PR Analysis Process**:
   - Fetches user's pull requests from GitHub API
   - Retrieves detailed PR information including:
     - PR title and description
     - Code changes and file modifications
     - Additions and deletions statistics
     - File status (added, modified, deleted)
   - Sends PR data to GROQ AI backend for analysis
   - Caches analysis results for efficient session management

3. **AI Analysis (Powered by GROQ)**:
   - **Code Quality Assessment**:
     - Identifies potential bugs and issues
     - Suggests code improvements
     - Checks for best practices
     - Analyzes code complexity
   
   - **Change Analysis**:
     - Reviews file modifications
     - Analyzes code diffs
     - Identifies potential conflicts
     - Suggests optimization opportunities
   
   - **Documentation Review**:
     - Analyzes PR descriptions
     - Checks for missing documentation
     - Suggests documentation improvements
   
   - **Security Analysis**:
     - Identifies potential security vulnerabilities
     - Suggests security best practices
     - Reviews sensitive data handling

4. **Response Formatting**:
   - Supports markdown formatting
   - Structured feedback sections
   - Code block highlighting
   - Bullet points and lists
   - Hierarchical organization of suggestions

## 📱 How to Use
1. **Login**:
   - Click the "Login with GitHub" button
   - Authorize the application
   - You'll be redirected to the dashboard

2. **Viewing PRs**:
   - The dashboard displays all your pull requests
   - PRs are organized by repository
   - Status indicators show open/closed state
   - Select a PR to view its details

3. **Analysis Features**:
   - View AI-generated code reviews
   - See detailed code change analysis
   - Navigate between different PRs
   - Markdown-formatted feedback
   - Real-time analysis updates

4. **Session Management**:
   - Analysis results are cached during your session
   - Logout clears all session data
   - Automatic redirection to dashboard when logged in
   - Persistent login state

## 🔍 Troubleshooting
1. **Authentication Issues**:
   - Ensure GitHub OAuth credentials are correctly set in `.env`
   - Check if the callback URL is properly configured in GitHub OAuth settings
   - Clear browser cache and localStorage if experiencing login problems

2. **API Connection Problems**:
   - Verify backend server is running on port 3001
   - Check GROQ API key is valid and properly set
   - Ensure all environment variables are correctly configured

3. **Analysis Failures**:
   - Check GROQ API key validity
   - Verify PR data is being properly fetched
   - Ensure code changes are accessible
   - Check network connectivity

4. **Performance Issues**:
   - Clear browser cache
   - Check for large PRs that might need more processing time
   - Verify GROQ API rate limits
   - Monitor backend server resources

## 👨‍💻 Credits
This project was developed by **samehel** as part of a portfolio project. The application demonstrates advanced integration of AI technology with GitHub's API for automated code review processes.

