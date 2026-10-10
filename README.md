# 🌐 Alesuke — Multi-Vendor Marketplace & Service Booking Client

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix_UI" />
  <img src="https://img.shields.io/badge/Marketplace-A855F7?style=for-the-badge&logo=globe&logoColor=white" alt="Marketplace" />
  
</p>

---

## 📌 Executive Overview

Alesuke Client is a responsive customer-facing web application that enables users to discover verified service providers, compare price quotes, schedule appointments, and manage service bookings.

---

## 🚀 Key Frontend Engineering Highlights

- **Provider Discovery**: Location-aware search and verified customer reviews.
- **Service Booking Workflow**: Multi-step booking wizard with calendar slot selection.
- **User Account Dashboard**: Active bookings, cancellation requests, and invoice receipts.
- **Clean Design System**: Modern aesthetic with Tailwind CSS and Radix UI accessible components.
- **Optimized CWV Metrics**: High Core Web Vitals performance with code-splitting and asset optimization.

---

## 📂 Project Architecture

```plaintext
alesuke_frontend/
├── assets/
│   └── banner.svg         # UI architecture visual banner
├── src/
│   ├── components/        # Reusable design system primitives & UI atoms
│   ├── pages/ or app/     # Application routes & layouts
│   ├── hooks/             # Custom React hooks & state encapsulation
│   ├── services/          # API client endpoints & HTTP adapters
│   └── styles/            # Tailwind CSS configurations & themes
├── public/                # Static assets & icons
├── package.json
└── tsconfig.json
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/alesuke_frontend.git
cd alesuke_frontend
npm install
```

### 2. Environment Configuration
Create a local `.env` file if required:
```bash
cp .env.example .env 2>/dev/null || true
```

### 3. Run Development Server
```bash
npm run dev
```

Application will launch locally at `http://localhost:3000` or `http://localhost:5173`.

---

## 👨‍💻 Engineering & Authorship

Developed and maintained by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
