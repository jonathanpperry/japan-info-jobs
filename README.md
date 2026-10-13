# Japan Info Jobs Modern

A modernized cross-platform job-search application built with **Angular, Ionic, TypeScript, and Capacitor**.

This project is a modernization of [Japan Info Jobs](https://github.com/jonathanpperry/jobs-in-japan-ionic), an Ionic application originally developed in Japan for Fuji TV Lab.

The goal is to rebuild the original application's functionality using modern frameworks, native mobile integrations, and maintainable application architecture while preserving the original product's purpose.

## Background

Japan Info Jobs originated as an independently proposed job-search application during my time working in Japan. The proposal received board approval and funding for development.

The original application was built with Angular, Ionic, Capacitor, and Firebase, providing functionality for browsing job opportunities, managing resumes, and submitting job applications.

This repository represents a fresh implementation of that application, using the legacy codebase as a functional reference rather than attempting to upgrade every dependency through multiple major versions.

**Original repository:** [jobs-in-japan-ionic](https://github.com/jonathanpperry/jobs-in-japan-ionic)

## Technology Stack

- **Angular** – Frontend application framework
- **Ionic Framework** – Cross-platform mobile UI components
- **TypeScript** – Type-safe application development
- **Capacitor** – Native Android and iOS integration
- **Firebase** – Planned authentication and backend integration
- **SCSS** – Application styling

## Features

The modernization aims to preserve and improve the original application's functionality:

- User registration and authentication
- Native mobile authentication
- Job listings and detailed job descriptions
- Job searching and category filtering
- Resume creation, editing, and management
- Job applications and application tracking
- User profile management
- Application settings and language preferences

These features are being migrated incrementally and should not be considered fully implemented yet.

## Modernization Goals

The primary objectives of this project are:

1. Replace legacy Angular modules with standalone components.
2. Adopt current Angular, Ionic, and Capacitor architectures.
3. Replace deprecated Cordova plugins with maintained Capacitor alternatives.
4. Implement modern authentication and session management.
5. Preserve and improve the original application's functionality.
6. Improve code maintainability, type safety, and modularity.
7. Establish reliable Android and iOS build workflows.
8. Introduce automated testing and modern development practices.

## Project Status

**Active development – Incremental modernization**

The application has been scaffolded as a new Ionic/Angular project. Features from the original application are being migrated and tested individually.

### Migration Roadmap

- [x] Initialize modern Ionic/Angular project
- [x] Establish modern application routing structure
- [ ] Complete native icon and splash screen configuration
- [ ] Migrate login and registration pages
- [ ] Implement modern Firebase/Capacitor authentication
- [ ] Implement authentication guards and session persistence
- [ ] Migrate navigation and primary application layout
- [ ] Migrate job listings and search functionality
- [ ] Migrate resume management
- [ ] Migrate job application workflows
- [ ] Migrate user settings and language preferences
- [ ] Validate Android builds
- [ ] Validate iOS builds
- [ ] Implement automated testing
- [ ] Prepare a release-ready application

## Getting Started

### Prerequisites

- Node.js and npm compatible with the installed Angular version
- Ionic CLI
- Android Studio for Android development
- Xcode on macOS for iOS development

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jonathanpperry/jobs-in-japan-modern.git
cd jobs-in-japan-modern
npm install
```

### Run the Development Server

```bash
npx ionic serve
```

### Build the Application

```bash
npm run build
```

### Android Development

After configuring the Android native project:

```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio can then be used to build, debug, and run the application on an emulator or physical Android device.

## Native Application Assets

The project uses `@capacitor/assets` to generate platform-specific app icons and splash screens.

Source images are maintained in the root-level `assets/` directory.

Generate native assets with:

```bash
npx capacitor-assets generate
```

Synchronize changes with Capacitor:

```bash
npx cap sync
```

## Migration Strategy

Rather than upgrading through every intermediate Angular and Ionic release, this project takes an incremental migration approach.

The original application remains available as a reference while features are transferred into the modern project.

Each feature is:

1. Reviewed in the legacy application.
2. Adapted to modern Angular and Ionic conventions.
3. Updated to use supported services and native plugins.
4. Tested independently before integration.

This approach allows the modern application to maintain a working build throughout development.

## Related Repository

**[Japan Info Jobs – Original Ionic Application](https://github.com/jonathanpperry/jobs-in-japan-ionic)**

The original repository preserves the historical implementation and development work.

This repository focuses on modernizing the application's architecture, dependencies, and mobile capabilities.

## Author

**Jonathan P. Perry**

Software Engineer

[GitHub](https://github.com/jonathanpperry)

## License

No open-source license has been assigned. All rights reserved unless otherwise specified. Reuse or redistribution of original project materials remains subject to applicable ownership and permission requirements.
