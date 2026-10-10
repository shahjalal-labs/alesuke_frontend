# 🏛️ Alesuke — Digital Estate Planning, Will Preparation & Legacy Asset Custody Portal

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js_16" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React_18" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turbopack-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Turbopack" />
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant_Design" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux_Toolkit" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Legal_Tech-6366F1?style=for-the-badge&logo=shield&logoColor=white" alt="Legal_Tech" />
  
</p>

---

## 📌 Executive Overview

**Alesuke Frontend** is an innovative legal-tech and digital estate planning web portal engineered with **Next.js 16 (Turbopack, App Router)**. The application empowers users to catalog tangible and digital assets (cryptocurrency wallets, cloud accounts, intellectual property), draft legally structured Last Will & Testament documents, designate trusted loved ones/beneficiaries, and automate posthumous or milestone-triggered asset distribution instructions.

---

## 🚀 Key Engineering & Domain Capabilities

- **Step-by-Step Will Wizard**: Guided legal questionnaire to author Last Will & Testament documents with customized clause allocation.
- **Digital & Physical Asset Inventory**: Secure ledger for documenting cryptocurrency wallets, domain names, bank accounts, and heirlooms.
- **Loved Ones & Beneficiary Allocation**: Assign specific assets or percentage shares to designated family members with identity verification.
- **Cryptographic Custody Security**: Zero-knowledge encryption principles for digital asset credentials and delivery triggers.
- **Next.js 16 App Router Structure**: Features `(user_dashboard)` and `(dashboard_flow)` for intuitive multi-stage estate navigation.

---

## 🏛️ Application Architecture & Route Tree

```plaintext
alesuke_frontend/
├── assets/
│   └── banner.svg                     # High-resolution architectural banner
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Multi-factor authentication & ID verification
│   │   ├── (default)/
│   │   │   ├── how-it-works/          # Step-by-step estate planning explainer
│   │   │   ├── pricing/               # Subscription tiers & legal custody plans
│   │   │   └── profile-setup/         # Estate creator identity onboarding
│   │   ├── (user_dashboard)/
│   │   │   ├── will/                  # Active Last Will & Testament document manager
│   │   │   ├── assets/                # Tangible estate property catalog
│   │   │   ├── digital-assets/        # Crypto, passwords & digital credentials
│   │   │   └── my-loved-ones/         # Designated beneficiaries & contact relays
│   │   ├── layout.tsx                 # Root layout with Redux & Theme providers
│   │   └── globals.css                # Tailwind CSS design system
│   ├── components/                    # Legal form steps, asset allocation tables
│   └── redux/                         # RTK Query API slices & estate state
├── package.json                       # Next.js 16.1.6, React 18, Tailwind CSS
└── tsconfig.json
```

---

## 💻 Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Framework** | **Next.js 16** (App Router, Turbopack, Server/Client Components) |
| **UI Components** | Ant Design, Lucide Icons, Custom Tailwind Primitives |
| **State Management** | Redux Toolkit (RTK), RTK Query API Caching |
| **Styling** | Tailwind CSS 3.4, PostCSS, Responsive Mobile-First Theme |
| **Language** | TypeScript 5 (Strict Mode) |

---

## 🛠️ Getting Started & Local Development

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `yarn`, or `pnpm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/alesuke_frontend.git
cd alesuke_frontend
npm install
```

### 2. Configure Environment Variables
Create a local `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server (Turbopack)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
