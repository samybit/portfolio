# Portfolio // Samy Barsoum

The source code for my personal web development portfolio. Designed with a modular architecture that supports multiple aesthetic paradigms, focusing on striking visual contrasts, interactive elements, and high performance.

**Live Site:** [https://samyb.vercel.app](https://samyb.vercel.app)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **3D & WebGL:** React Three Fiber & Drei
- **Animations:** Framer Motion & tsParticles
- **Icons:** Lucide React
- **Email Service:** Resend (via Next.js Server Actions)

## Key Features

- **Multi-Theme Architecture:** A dynamic theme engine featuring strict Default Brutalism, frosted-glass Neumorphism, and the vibrant Ember (Warm Charcoal & Fiery Orange) styles.
- **Optimized 3D Integration:** Interactive WebGL components with custom hardware killswitches (0% GPU usage when scrolled out of view).
- **Magnetic Scroll Physics:** Custom, debounced scroll listeners for fluid, perfectly aligned full-screen section transitions without layout thrashing.
- **Parallax Inversion Effect:** A seamless, single-DOM scroll mask that elegantly inverts layout colors and typography using backdrop filters.
- **Serverless Contact Form:** Uses Next.js Server Actions and the Resend API to securely handle form submissions directly from the edge.
- **Native Internationalization (i18n):** Zero-dependency bilingual architecture (English / Arabic) with flawless RTL layout mirroring and statically generated edge routes.
- **Production Ready:** Fully optimized with comprehensive SEO metadata, dynamic OpenGraph previews, and ARIA accessibility standards.

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/samybit/portfolio
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Resend API key:

```env
RESEND_API_KEY=re_your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## License

The code in this repository is open source and licensed under the [MIT License](LICENSE). You are completely free to use it to experiment or build your own portfolio!

**A quick note on personal assets:**  
While the code is free to use, my personal branding (my name, resume, project descriptions, and images) is copyrighted. If you decide to fork or use this codebase, please be kind enough to remove my personal data and replace it with your own amazing work. Happy coding!