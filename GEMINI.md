# Project Overview
This project is a React-based web application, likely a portfolio or interactive showcase, integrated with Firebase and utilizing Google's Gemini API for AI-powered features. It uses Vite as the build tool and includes 3D elements via Three.js (Fiber).

# Technologies
- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS.
- **Backend/Services:** Firebase (Firestore, likely others), Google Gen AI.
- **Interactive:** Three.js, React Three Fiber.
- **Routing:** React Router.

# Building and Running
- **Install Dependencies:** `npm install`
- **Configure:** Ensure `GEMINI_API_KEY` is set in a `.env.local` file.
- **Run Locally (Development):** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`
- **Lint:** `npm run lint`

# Development Conventions
- Use `npm run dev` for local development.
- Keep dependencies updated via `package.json`.
- Adhere to the existing structure:
  - `src/pages`: Main application views.
  - `src/components`: Reusable UI components (including 3D elements).
  - `src/firebase.ts`: Firebase configuration and initialization.
