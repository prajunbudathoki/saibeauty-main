# Sai Beauty 💗

**Sai Beauty** is a web application built for a beauty salon business in Dubai, UAE. It provides customers with a digital platform to explore beauty services, discover salon locations, view the gallery, and access appointment-booking functionality.

🌐 **Live Website:** [https://saibeauty.vercel.app](https://saibeauty.vercel.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Database](#-database)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Author](#-author)
- [License](#-license)

---

## 📖 Overview

Sai Beauty is a salon website designed to improve the online experience for customers looking for beauty services.

The application brings salon information, services, and appointment-related functionality together in one place. It aims to make discovering salon services more convenient while providing a foundation for managing customer interactions and bookings.

### Project Goals

- Establish a professional online presence for the salon.
- Make salon services easier to discover.
- Provide information about salon locations and the team.
- Showcase salon work through a visual gallery.
- Give customers access to appointment-booking functionality.
- Provide an accessible and responsive user experience.

---

## ✨ Features

### Customer Experience

- **Service Discovery:** Explore beauty services offered by the salon.
- **Salon Locations:** Discover available salon locations.
- **Gallery:** Browse images showcasing the salon and its work.
- **Team Information:** Learn about the salon team.
- **Appointment Booking:** Access the appointment-booking experience.
- **Customer Accounts:** Access account-related functionality.
- **Booking Management:** Navigate to the customer bookings section.
- **Contact Information:** Find information for contacting the salon.

### User Interface

- Organized website navigation.
- Responsive layouts for different screen sizes.
- Reusable UI components.
- Utility-first styling with Tailwind CSS.

> The availability and behavior of individual features depend on the application's current implementation and configuration.

---

## 🛠️ Technology Stack

The repository structure indicates the use of TypeScript, a pnpm-based package management workflow, Tailwind CSS, and Prisma-related database tooling.

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe application development |
| React | User interface development, if configured in the project |
| TanStack Start | Full-stack React framework, if confirmed by the project dependencies |
| Prisma | Database access and schema management |
| Tailwind CSS | Utility-first styling |
| PostCSS | CSS processing |
| pnpm | Package management |
| Vercel | Application hosting and deployment |

The exact framework, database provider, authentication solution, and other integrations should be confirmed using `package.json`, `prisma/`, and the application's configuration before documenting them as dependencies.

---

## 📂 Project Structure

The repository currently contains the following top-level structure:

```text
sai-beauty/
├── app/                    # Application code and routes
├── prisma/                 # Prisma schema and database-related files
├── public/                 # Static assets
├── .gitignore              # Git exclusion rules
├── aaa.png                 # Image asset
├── app.config.ts           # Application configuration
├── biome.json              # Biome tooling configuration
├── components.json         # UI component generator configuration
├── package.json            # Dependencies and npm scripts
├── pnpm-lock.yaml          # Locked dependency versions
├── postcss.config.ts       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

### Directory Overview

**`app/`**

Contains the application's main code. Depending on the framework configuration, this directory may include routes, UI components, layouts, server-side logic, and application styles.

**`prisma/`**

Contains database-related configuration and schema files used by Prisma. It may also include migrations and seed scripts.

**`public/`**

Stores static assets that can be served directly by the application, such as images, icons, and other public files.

### Root Configuration Files

- `app.config.ts` — Application configuration.
- `package.json` — Project metadata, dependencies, and available scripts.
- `pnpm-lock.yaml` — Records the resolved dependency versions for reproducible installations.
- `tsconfig.json` — TypeScript compiler configuration.
- `tailwind.config.ts` — Tailwind CSS configuration.
- `postcss.config.ts` — PostCSS configuration.
- `components.json` — Configuration for the UI component tooling.
- `biome.json` — Configuration for Biome formatting and linting tools.
- `.gitignore` — Specifies files and directories Git should ignore.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure you have installed:

- Node.js compatible with the project's dependencies.
- pnpm.
- Git.
- Access to the required database and external services, if applicable.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd sai-beauty
```

Replace `<YOUR_REPOSITORY_URL>` with your actual Git repository URL.

### 2. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Configure Environment Variables

Create the environment file required by the application.

For example:

```bash
touch .env
```

Add the environment variables required by your project. See the [Environment Variables](#-environment-variables) section.

### 4. Configure the Database

If Prisma requires a database connection, configure the appropriate database URL in your environment file.

Run the project's required Prisma commands after checking the scripts and schema in the repository.

### 5. Start the Development Server

Check the scripts defined in `package.json`.

If the project defines a `dev` script, run:

```bash
pnpm dev
```

Open the local URL printed in your terminal.

The port and URL depend on the application's configuration.

---

## 🔐 Environment Variables

The application may require environment variables for database connectivity, authentication, email delivery, image storage, or other integrations.

The following is an illustrative example. It is **not a verified list of the variables required by this repository**.

```env
# Database
DATABASE_URL=

# Authentication
AUTH_SECRET=
AUTH_URL=

# Email service, if configured
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=

# Image storage, if configured
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Security Guidelines

- Use the exact variable names expected by your application.
- Never commit real credentials or API keys to Git.
- Ensure local environment files are covered by `.gitignore`.
- Configure production secrets through your hosting provider.
- Use separate credentials for development and production where appropriate.

---

## 📜 Available Scripts

The available commands are defined in `package.json`.

Common commands may include:

| Command | Purpose |
|---|---|
| `pnpm install` | Install project dependencies |
| `pnpm dev` | Start the development server, if configured |
| `pnpm build` | Build the application, if configured |
| `pnpm start` | Start the production server, if configured |
| `pnpm lint` | Run linting, if configured |
| `pnpm exec prisma generate` | Generate Prisma Client, if Prisma is configured |
| `pnpm exec prisma studio` | Open Prisma Studio, if available |

These commands are examples. Verify the actual scripts in `package.json` before relying on them.

---

## 🗄️ Database

The repository includes a `prisma/` directory, indicating that Prisma is part of the project's database tooling.

Prisma provides a schema-based approach to defining data models and accessing a database from application code.

Depending on the project configuration, the database workflow may include:

1. Defining models in the Prisma schema.
2. Configuring the database connection.
3. Creating and applying migrations.
4. Generating Prisma Client.
5. Accessing database records through application services.

### Useful Prisma Commands

Generate Prisma Client:

```bash
pnpm exec prisma generate
```

Inspect the database schema:

```bash
pnpm exec prisma studio
```

For projects using Prisma migrations, development migrations may be applied with:

```bash
pnpm exec prisma migrate dev
```

**Important:** Confirm the configured database provider and Prisma version before running database commands. Database migrations should be reviewed before being applied to production.

---

## 🌐 Deployment

The live application is available at:

**[https://saibeauty.vercel.app](https://saibeauty.vercel.app)**

The project is deployed on Vercel.

A typical deployment workflow includes:

1. Push the application code to the configured Git repository.
2. Import the repository into Vercel.
3. Configure the appropriate build settings.
4. Add the required production environment variables.
5. Ensure the production database and external services are accessible.
6. Deploy the application.
7. Verify the critical customer-facing workflows.

### Production Checklist

Before releasing changes, verify:

- [ ] The application builds successfully.
- [ ] Production environment variables are configured.
- [ ] Database connectivity works.
- [ ] Authentication works, if enabled.
- [ ] Appointment-related workflows behave as expected.
- [ ] Images and other assets load correctly.
- [ ] Error and empty states display appropriately.
- [ ] The deployed application works on mobile and desktop.

---

## 🧪 Testing

Testing is important for ensuring that customer-facing functionality works reliably.

Recommended areas to test include:

- Navigation between pages.
- Service and location discovery.
- Appointment-booking workflows.
- Authentication and authorization.
- Customer booking access.
- Database operations.
- Form validation and error handling.
- Responsive layouts.
- Loading and empty states.

Automated tests can be added using appropriate unit-testing, component-testing, and end-to-end testing tools.

The actual testing framework and existing test coverage should be verified in the repository.

---

## 👨‍💻 Author

**Prajun Budathoki**

Full Stack Developer

- GitHub: [@prajunbudathoki](https://github.com/prajunbudathoki)
- LinkedIn: [Prajun Budathoki](https://www.linkedin.com/in/prajun-budhathoki-831676232/)

<p align="center">
  Built with care for Sai Beauty.
</p>
