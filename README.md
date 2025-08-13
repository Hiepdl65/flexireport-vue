# FlexiReport Vue Frontend

A modern Vue 3 frontend for the FlexiReport system, built with Vue 3, Tailwind CSS, and Pinia.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS for beautiful, responsive design
- 🔧 **Report Builder**: Drag-and-drop interface for creating reports
- 📊 **Data Sources**: Support for multiple database types (MySQL, PostgreSQL, CSV, etc.)
- 📋 **Templates**: Save and reuse report templates
- 🔐 **Permissions**: Role-based access control for templates
- 📤 **Export**: Multiple export formats (PDF, Excel, CSV)
- 🌙 **Dark Mode**: Built-in dark/light theme support

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend setup)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file (optional):
```bash
cp .env.example .env
```

3. Update API configuration in `src/services/api.js` if needed:
```javascript
baseURL: 'http://localhost:8000/api/v1'
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── common/         # Common/reusable components
│   ├── layout/         # Layout components (header, sidebar)
│   └── report-builder/ # Report builder specific components
├── views/              # Page components
├── stores/             # Pinia stores
├── services/           # API services
├── router/             # Vue Router configuration
└── assets/             # Static assets and styles
```

## API Integration

The frontend integrates with the following backend APIs:

- **Data Sources**: `/api/v1/data-sources/`
- **Templates**: `/api/v1/templates/`
- **Reports**: `/api/v1/reports/`
- **Permissions**: `/api/v1/permissions/`

## Backend Setup

Make sure the backend API is running at `http://localhost:8000`. See the backend repository for setup instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
