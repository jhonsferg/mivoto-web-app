# MiVoto Frontend

This is the Angular frontend application for the MiVoto electronic voting system.

## Project Structure

The project follows a scalable architecture organized by domain:

- **Core (`src/app/core`)**: Singleton services, interceptors, guards, and models used throughout the application.
- **Shared (`src/app/shared`)**: Reusable components, pipes, and directives.
- **Features (`src/app/features`)**: Business logic modules (Auth, Dashboard, Voting).
- **Layouts (`src/app/layouts`)**: Main wrappers for different page types (Main Layout, Auth Layout).

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1.  Clone the repository.
2.  Navigate to `mivoto-web-app`.
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`.

### connection to Backend

The application connects to the backend at `http://localhost:8080/api/v1` by default. You can change this in `src/environments/environment.ts`.

## Build

To build the project for production:

```bash
ng build
```

## Running Tests

Run unit tests via Karma:

```bash
ng test
```
