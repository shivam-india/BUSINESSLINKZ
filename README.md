# BizLink: Universal Connected Business Network & Digital Khata 🌐⚡

> **Universal Business Discovery Platform** | Powered by **SerpApi** Google Maps Local Search, Live Turn-by-Turn GPS Navigation, and Digital Khata Bahi (Credit/Debit) Ledger.

---

## 💡 1. Executive Summary & Core Philosophy

**BizLink** connects any enterprise—from neighborhood bakeries, beauty salons, auto mechanics, grocery marts, cafes, and fashion boutiques to wholesale depots and manufacturing plants worldwide.

It bridges:
1. **B2C (Customer to Store):** Walk-in consumers searching for nearby products, getting 1-click Google Maps directions, and tracking personal store credit.
2. **B2B (Store to Supplier):** Merchants discovering wholesale distributors, super stockists, and factory direct lines.
3. **Digital Khata Bahi (Udhaar & Jama):** Recording credit/debit transactions with customer balances and instant WhatsApp reminders.

```
   [ Tier 0: Manufacturers & Factories ]
                 ↓
   [ Tier 1: Regional Super Wholesalers ]
             ↙        ↘
   [ Wholesalers ]   [ Bulk Stockists ]
             ↘        ↙
      [ YOUR STORE / ENTERPRISE ]
   (Bakery, Salon, Mechanic, Retailer, Cafe)
             ↙        ↘
   [ Trade Contractors ]  [ Walk-in Customers ]
```

---

## 🌟 2. Key Features

- 🥐 **Universal Business Categories Worldwide:** Works for bakeries, stationery, clothing, grocery, salons, mechanics, auto spare parts, sanitary/hardware, electronics, cafes, shoes, pharmacies, and custom search queries.
- 🗺️ **Google Maps Turn-by-Turn Navigation:** 1-click directions button on every business card opening live Google Maps driving/walking routes.
- 📍 **Browser GPS Radius Search:** Search within a 1 km, 2 km, 5 km, 10 km, 25 km, or 50 km radius of your live GPS location.
- 📸 **Real Store Photos & Ratings:** Real imagery, Google review scores, open/closed status, and formatted addresses.
- 📒 **Digital Khata Bahi (Credit / Debit):** Track Udhaar (Given / Receivable) and Jama (Received) with automatic balance calculations, invoice numbers, and 1-click WhatsApp payment reminders.
- 👥 **Dual Portals:** Create an account as an **Individual Customer** or **Business Owner / Merchant**.

---

## 🚀 3. Quick Start & Running Locally

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (Optional for live SerpApi)
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 4. SerpApi Configuration (Vercel & Local)

BizLink isolates all SerpApi calls within a secure backend API endpoint (`/api/search-businesses` & `src/services/serpapiService.ts`). The API key is **never exposed to client-side JavaScript**.

### Local `.env.local`:
```env
SERPAPI_KEY=your_actual_serpapi_key_here
```

### Vercel Deployment:
Add `SERPAPI_KEY` under **Project Settings > Environment Variables** and trigger a redeployment.

---

## 📁 5. Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/search-businesses/route.ts  # Secure backend SerpApi proxy
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── customer/CustomerPortal.tsx     # Individual customer portal
│   │   ├── dashboard/                      # Business dashboard & Khata views
│   │   ├── landing/LandingPage.tsx         # Universal landing page
│   │   ├── modals/                         # Khata, Profile, & Register modals
│   │   └── network/SupplyChainGraph.tsx    # Interactive multi-tier graph
│   ├── context/BizLinkContext.tsx          # Global state, Khata, & GPS logic
│   ├── services/serpapiService.ts          # SerpApi Google Maps search engine
│   └── types/index.ts                      # TypeScript definitions
├── package.json
└── README.md
```
