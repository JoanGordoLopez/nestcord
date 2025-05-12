# Nestcord
Nestcord is a social media built with Next.js, TypeScript, Tailwind CSS, and Supabase. It uses the App Router of Next.js for improved routing and performance.

## 🚀 Features

* Modern user interface with Tailwind CSS
* Secure authentication with Supabase
* Scalable architecture with Next.js App Router
* Organized code structure (src/ folder with components, context, database, hooks, libs, and middleware)

## 🛠️ Technologies Used

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Vercel
* Supabase

## 📁 Project Structure

```
/src
├── app - Back-End and Front-end routes
├── components - UI Components
├── context - User Context Module
├── database - Database Context
├── hooks - React Hooks
├── libs - App Types
└── middleware.ts - Next.js Middleware File Route
```

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* pnpm or npm (pnpm recommended)
* A Supabase account and project
* Vercel account (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/marcfernandezo/x-clone.git

# Navigate to the project directory
cd x-clone

# Install dependencies
pnpm install

# Set up your environment variables
cp .env.example .env
```

### Configuration

1. Update your `.env` file with your Database credentials.
2. Make sure your Supabase project has the necessary tables and configuration.

### Running the Project

```bash
# Run the development server
pnpm run dev
```

### Building for Production

```bash
pnppm run build
```

### Deploying

You can deploy this project on platforms like Vercel or Netlify.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.
