## Vite Widget Project

This project is a widget repository designed for embedding into chatbot applications with knowledge bases. It is built using Vite for fast development and modern frontend tooling.

## Installation

### Clone the repository:

```bash
git clone <repository-url>
cd vite-project
```

## Install dependencies:

```bash
npm install
```

## Getting Started

In the project directory, you can run:

```bash
npm run dev
```

Runs the app in development mode with Vite. The app will be available at http://localhost:5173.

```bash
npm run build
```

Builds the project for production into the dist folder. It also creates an embedded JavaScript file by copying assets into dist/embeded.js.

```bash
npm run embededjs
```

Copies all JavaScript assets from the dist/assets folder into a single embeded.js file for embedding purposes.

```bash
npm run lint
```

Runs ESLint on the project files to ensure code quality. Reports unused directives and disallows warnings.

```bash
npm run preview
```

Locally previews the production build using Vite's preview feature.

## Dependencies

- **Axios: ^1.6.5 - For HTTP requests.**
- **JS Cookie: ^3.0.5 - For managing cookies.**
- **Moment.js: ^2.30.1 - For date and time handling.**
- **React: ^18.2.0 - For building user interfaces.**
- **React DOM: ^18.2.0 - React DOM bindings.**
- **React GA4: ^2.1.0 - Google Analytics 4 integration.**
- **React Markdown: ^9.0.1 - For rendering Markdown.**
- **React Router DOM: ^6.21.2 - For routing.**
- **React Simple Typewriter: ^5.0.1 - Typewriter effect for text.**
- **React Toastify: ^9.1.3 - For toast notifications.**
- **React Typewriter Effect: ^1.1.0 - Animated typewriter effects.**
- **UUID: ^9.0.1 - For unique identifiers.**
- **Vite Plugin CSS Injected by JS: ^3.3.1 - Inject CSS dynamically.**

## Project Structure

- **src/**
- **├── components/ # Reusable UI components**
- **├── pages/ # Application pages**
- **├── assets/ # Static assets like images and styles**
- **├── App.jsx # Root React component**
- **├── main.jsx # Entry point**
- **└── index.css # Global styles**
