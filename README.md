# Command Orchestra Frontend

A voice-controlled automation system that orchestrates various productivity workflows and tools through speech recognition and manual triggers.

## Overview

Command Orchestra is a modern web application that allows you to control different "modes" of your digital workspace through voice commands or manual triggers. Each mode is designed to set up specific environments for different types of work or activities.

## Features

### 🎤 Voice Control

- Real-time speech recognition
- Natural language command processing
- Visual feedback for voice commands
- Transcript display with command history

### 🎯 Automation Modes

**GYM Notes** - Fitness tracking and workout logging

- Running
- Cycling
- Mobility
- Gym workout

**Studio Mode** - Music production environment

- Opens FL Studio
- Configure EZdrummer 3 settings
- Configures audio settings

**Launch Ritual Mode** - Development environment

- Opens Obsidian for note-taking
- Launches Cursor IDE
- Activates AI agents
- Sets up development workflow

**Explorer Mode** - Research and browsing setup

- Opens browser research tabs
- Configures voice logging
- Sets up research environment

**Focus Mode** - Deep work environment

- Activates Do Not Disturb
- Plays deep focus playlist
- Minimal distraction setup

**Archive Mission** - Session cleanup

- Backs up notes and work
- Closes applications
- Resets workspace to clean state

### 🎨 Modern UI

- Beautiful gradient backgrounds
- Responsive design
- Real-time status indicators
- Interactive automation cards
- Toast notifications for feedback

## Technology Stack

This project is built with modern web technologies:

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Web Speech API** - Voice recognition

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd command-orchestra-frontend
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:8083`

### Building for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Voice Commands**: Click the microphone button to start voice recognition, then speak your commands naturally (e.g., "start focus mode", "gym notes running")

2. **Manual Triggers**: Click on any automation card to trigger it manually

3. **Sub-modes**: Some automations like "GYM Notes" have sub-triggers for specific activities

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

### Key Components

- `VoiceControl` - Handles speech recognition and voice commands
- `AutomationTriggers` - Displays and manages automation cards
- `Header` - Application title and branding
- `StatusFooter` - Shows current system status

### Adding New Automations

To add a new automation mode:

1. Add the trigger definition to `automationTriggers` array in `src/pages/Index.tsx`
2. Implement the backend logic for the automation (if needed)
3. Add appropriate keywords for voice recognition
