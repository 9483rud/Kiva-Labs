# Kiva Labs

Kiva Labs is a highly customizable, distraction-free desktop study workspace engineered to centralize academic materials, focus tools, and classroom platform streams. Built using a modern frontend stack, it features a scalable modular architecture allowing users to tailor their study environment to their exact needs.

---

## 🎨 Design Philosophy & Aesthetic
Kiva Labs utilizes a deep cyberpunk-inspired palette, fusing deep dark purples (`#0f0c1b`) with high-impact neon glows (`#e25eff`) and accents (`#00f0ff`). Scalable vector graphics (SVGs) ensure the brand assets and iconography remain crisp and clean at any window size.

---

## 🚀 Key Features

- **Dynamic Modular Architecture:** Toggle specific tools (Timer, Tasks, Notes, etc.) on or off on-the-fly. The sidebar and workspace dynamically adjust based on your active modules.
- **Collapsible Sidebar Layout:** Instantly scale the sidebar navigation between full-text views and localized, high-density icon matrices.
- **Centralized Integration Hub:** Connect directly to 3rd party school platforms like Google Workspace, Microsoft 365, and Canvas LMS to sync schedules and import slides/docs.
- **Component-Level Styling Separation:** Every view module houses its own decoupled logic and encapsulated CSS stylesheet for seamless maintenance and performance.

---

## 💻 Tech Stack

- **Framework:** React 18
- **Language:** TypeScript (TSX)
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Modular Custom Variables)

---

## 🛠️ Local Setup Instructions

Follow these steps to pull the code from GitHub and run Kiva Labs locally on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 1. Clone the Repository
```bash
git clone [https://github.com/9483rud/Kiva-Labs.git](https://github.com/9483rud/Kiva-Labs.git)
cd Kiva-Labs
```

### 2. Install Project Dependencies
This reads the configuration registry and sets up Teact, TypeScript, Vite:
```bash
npm install
```

### 3. Launch the Local Development Server 
```bash 
npm run dev
```

Once running, the terminal will provide a local adress (usually http://localhost:5173). Open that URL in your web browser to interact with your live environment!

## 📂 Project Architecture 
```text 
├── index.html
├── package.json
├── vite.config.ts
└── src
    ├── App.css               # Global theme variables & layout rules
    ├── App.tsx               # Root component & central module state registry
    ├── index.css             # Main Entry Reset CSS
    ├── main.tsx              # Application mount controller
    └── components
        ├── Icons.tsx         # Inline SVG vector asset factory
        ├── Sidebar.tsx       # Collapsible navigation menu component
        ├── Sidebar.css       
        ├── Dashboard.tsx     # Home panel layout with preview widgets
        ├── Dashboard.css     
        ├── IntegrationsView.tsx # 3rd party plugin integration manager
        ├── IntegrationsView.css 
        ├── SettingsView.tsx  # Feature toggles Control Panel
        ├── SettingsView.css  
        └── PlaceholderView.tsx # Shared layout for modules under construction
```