
# ✅ Project Title: TheSearchPilot – SEO Performance Analyzer

## 🎯 Purpose
To provide website owners, influencers, content creators, and digital marketers with **data-driven SEO analysis and actionable suggestions** that help their web presence **rank better in search engines like Google**.

The platform aims to:
- Help **influencers** and **creators** make their personal sites or landing pages SEO-friendly.
- Serve **eCommerce** or **dropshipping** users with tools to analyze product pages.
- Potentially become a one-stop portal for **ad campaign optimization** across social/search platforms.

## 💡 Initial Vision (Core Idea)
The original idea evolved from building a **hybrid portal** where:
- **Influencers** or **content creators** could submit their webpages or campaign links,
- Get **SEO scores**, **user experience insights**, and **optimization suggestions**,
- Use these insights to improve **discoverability**, **click-through**, and **conversion** on their profiles or products.

Future versions may offer:
- Integration with Instagram, TikTok, YouTube bios/landing pages.
- Suggestions tailored to creator profiles (e.g., Shopify landing page vs. personal blog vs. link-in-bio tools).

## 📦 MVP Scope

### 🔹 Functional Requirements

#### 1. User Dashboard
- Input for a webpage URL.
- Analyze button triggers backend API.
- Toggle between Mobile/Desktop SEO view.

#### 2. SEO Results Viewer (SeoReport.jsx)
- **Field Metrics** (Real-world performance):
  - CLS, TTFB, FCP (percentiles).
- **Lab Metrics** (Simulated tests from Google Lighthouse):
  - Performance, SEO, Accessibility, Best Practices.
  - Key render timings: FCP, LCP.
- **Recommendations**:
  - Structured audit-based advice for better SEO and user experience.

## 🔧 Technical Setup

### Frontend
- **Tech:** React + Vite
- **UI:** Tailwind CSS
- **Core Component:** `SeoReport.jsx`
- **Planned UI Additions:** Authentication form, user profile/dashboard, historical scan results.

### Backend
- **Server:** Express.js
- **SEO API Proxy Endpoint:** `/api/seo-check`
- **3rd Party API:** Google PageSpeed Insights
- **Security:** `.env` for API key, server-side calls only

## 🔐 API Integration

- **Google PageSpeed Insights**
- Key passed via environment variable.
- Response broken down into:
  - `loadingExperience.metrics`
  - `lighthouseResult.categories`
  - `lighthouseResult.audits`

## 📂 Repository & Dev Environment

- **GitHub Repo:** [thesearchpilot-dashboard-first](https://github.com/pranaymahulikar/thesearchpilot-dashboard-first)
- **Dev Environment:** GitHub Codespaces (shared setup)
- **Run Scripts:**
  - Frontend: `npm run dev`
  - Backend: `npm run server`

## 📌 Future Plans

- ✅ OAuth Authentication (Google/Facebook planned)
- ⏳ Custom onboarding for influencers (profile type selector)
- ⏳ Personalized SEO checklist based on creator goals (e.g. link-in-bio, product showcase)
- ⏳ Save and compare multiple scans
- ⏳ Multi-page site crawling (for blogs or Shopify stores)
- ⏳ White-label reports or shareable dashboards
