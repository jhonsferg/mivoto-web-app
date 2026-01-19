# 🗳️ Sistema de Votación Electrónica - Frontend

Aplicación web moderna desarrollada con **Angular 19+** que proporciona una interfaz intuitiva, segura y responsiva para el sistema de votación electrónica MiVoto.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink?style=for-the-badge&logo=SASS&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Testing](#-testing)
- [Docker](#-docker)

## ✨ Características

- **Arquitectura Modular**: Organizada por capas (Core, Shared, Features) para máxima escalabilidad y mantenimiento.
- **Componentes Standalone**: Uso de las últimas características de Angular para reducir boilerplate y mejorar el rendimiento.
- **Gestión de Estado Reactiva**: Utilizando Signals y RxJS para un flujo de datos eficiente y predecible.
- **Seguridad Integrada**:
    - **Interceptores HTTP**: Inyección automática de tokens JWT en cada petición.
    - **Renovación Automática**: Sistema inteligente de _refresh token_ transparente al usuario.
    - **Guards**: Protección de rutas basada en autenticación y roles de usuario.
- **Diseño Responsivo**: Interfaz adaptable a múltiples dispositivos (móvil, tablet, escritorio).
- **Internacionalización (i18n)**: Soporte multi-idioma preparado con Ngx-Translate.
- **Manejo de Fechas Avanzado**: Integración con **DayJS** para manipulación y formateo robusto de fechas.

## 🏗️ Arquitectura

La estructura del proyecto sigue las mejores prácticas de Angular ("Clean Architecture" adaptada a Frontend):

```txt
src/app/
├── core/                  # Servicios Singleton, interceptores, guards y modelos globales
│   ├── constants/         # Constantes de la aplicación
│   ├── guards/            # Protección de rutas
│   ├── interceptors/      # Manipulación global de peticiones HTTP
│   ├── models/            # Interfaces y modelos de dominio
│   └── services/          # Servicios de lógica de negocio y comunicación API
├── shared/                # UI Kit reutilizable
│   ├── components/        # Componentes tontos (Botones, Alertas, Inputs, Dialogs)
│   ├── directives/        # Directivas de comportamiento (ej: ClickOutside)
│   └── pipes/             # Transformación de datos (ej: DateFormat)
├── features/              # Módulos de negocio (Lazy Loaded)
│   ├── auth/              # Login, registro, recuperación de contraseña
│   ├── dashboard/         # Panel principal de administración/usuario
│   └── voting/            # Flujo completo de votación
└── assets/                # Recursos estáticos (i18n, imágenes, iconos)
```

## 🛠️ Tecnologías

- **Angular 19**: Framework SPA de última generación.
- **TypeScript 5.x**: Tipado estático robusto.
- **SCSS**: Preprocesador CSS para estilos modulares y mantenibles.
- **RxJS**: Programación reactiva para manejo de eventos asíncronos.
- **DayJS**: Librería ligera y moderna para manipulación de fechas.
- **@auth0/angular-jwt**: Utilidades estándar para manejo de JWT.
- **Ngx-Translate**: Sistema de internacionalización.
- **ESLint & Prettier**: Aseguramiento de calidad y formato de código.

## 📦 Requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v18.13.0 o superior (Recomendado v20 LTS)
- **NPM**: v8.x o superior
- **Angular CLI**: v19.x (`npm install -g @angular/cli`)

## 🚀 Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/jhonsferg/mivoto-web-app.git
   cd mivoto-web-app
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

## 🎯 Ejecución

### Desarrollo

Ejecuta el servidor de desarrollo. La aplicación se recargará automáticamente si cambias algún archivo.

```bash
ng serve
```

Abre tu navegador en `http://localhost:4200/`.

### Producción

Para construir el proyecto para producción (optimizado, minificado y con "tree-shaking"):

```bash
ng build --configuration production
```

Los artefactos de construcción se almacenarán en el directorio `dist/`.

## 🧪 Testing

Ejecuta las pruebas unitarias a través de [Karma](https://karma-runner.github.io) y [Jasmine](https://jasmine.github.io):

```bash
ng test
```

## 🐳 Docker

El proyecto incluye una configuración Docker multicapa lista para despliegue en Nginx.

```bash
# Construir la imagen
docker build -t mivoto-frontend -f docker/Dockerfile .

# Ejecutar el contenedor (Puerto 80)
docker run -p 80:80 mivoto-frontend
```

---
Desarrollado para **MiVoto** - Sistema de Votación Electrónica Seguro.
