# HR Talent Hub - Lottery & Teams

A React application for HR/Talent management, built with Vite and React using TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hr-talent-hub---lottery-&-teams
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the root directory if needed (see `.env.example` if available, or refer to `env.local` instructions).
   - **Note**: Ensure `GEMINI_API_KEY` is set in `.env` or `.env.local` if using Gemini features.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally preview the production build.

## 🛠 Project Structure

```
├── .github/workflows   # GitHub Actions (Deployment)
├── src/                # Source code
├── dist/               # Production build output
├── public/             # Static assets
└── ...
```

## 🚀 Deployment

This project is configured to deploy automatically to **GitHub Pages** using GitHub Actions.

1. Push changes to the `main` branch.
2. The `Deploy to GitHub Pages` action will trigger automatically.
3. Once valid, the site will be live at your GitHub Pages URL.

**Note**: You need to enable GitHub Pages in your repository settings:
- Go to **Settings** > **Pages**
- Build and deployment source: **GitHub Actions**
