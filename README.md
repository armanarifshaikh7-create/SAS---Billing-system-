# 👗 VogueThreads POS & Multi-Tenant Retail SaaS Engine

A production-ready, heavily animated multi-tenant SaaS billing & POS system architected for clothing and apparel retail boutiques, featuring full financial telemetry (daily capital, income, weighted-average COGS, operational expenses, gross & net profit), cash drawer reconciliation, immutable Day-Close Z-Reports, granular role-based access control (RBAC), and a 60fps physics-driven fluid UI.

---

## 🌟 Key Highlights & Feature Matrix

### 1. POS Billing ("The Star Screen")
- **Instant Barcode Engine**: Auto-focused, always-listening keyboard scanner (<20ms lookup).
- **Fly-to-Cart Animation**: Physics-based bezier arc item addition.
- **Cart Reflow**: Smooth `AnimatePresence` + Framer Motion layout transitions without layout jumping.
- **Micro-Interactions**: Bouncing quantity steppers, green scanner flash rings, and rolling digit totals.
- **Park / Hold Bills**: Multi-tab bill parking (e.g., customer in fitting room) with instant resume.
- **Split Payments**: Simultaneous tender across **Cash, Card, UPI, and Khata (Store Credit)** with automated cash change calculation.
- **Customer CRM & Loyalty**: Instant phone/name search, inline new client registration, and automated 1-point-per-dollar reward accumulation.
- **Printable Thermal Receipts**: Real-time 80mm and 58mm thermal receipt modal with dynamically rendered **Code-128 barcodes** (`JsBarcode`) and **QR codes** (`qrcode`), with 1-click WhatsApp and Print output.
- **Keyboard Shortcuts**:
  - `F2`: Auto-focus Barcode / SKU scan input
  - `F4`: Proceed to Checkout & Pay
  - `F8`: Hold / Park current cart
  - `Esc`: Close active modal / clear search

### 2. Deep Financial Telemetry (The Core Ask)
- **Capital Deployed Tracking**: Real-time sum of `Current Inventory Asset Value + Operating Expenses`.
- **Accurate COGS Math**: Cost of Goods Sold tracked per sold garment variant.
- **Weighted-Average Cost Formula**: Auto-calculated whenever a Purchase Order is received:
  $$\text{New Cost} = \frac{(\text{Current Stock} \times \text{Old Cost}) + (\text{Received Qty} \times \text{PO Unit Cost})}{\text{Current Stock} + \text{Received Qty}}$$
- **Gross Profit**: $\text{Gross Profit} = \text{Net Sales} - \text{COGS}$
- **Net Profit**: $\text{Net Profit} = \text{Gross Profit} - \text{Operating Expenses} - \text{Staff Commissions}$
- **Cash Drawer Reconciliation**: Tracks opening float, cash sales, payouts, and flags counted vs. expected discrepancies.
- **Immutable Day-Close (Z-Report)**: One-click locking snapshots all numbers into an audit-safe `DailySnapshot` that cannot be altered.

### 3. Granular RBAC (Role-Based Access Control)
| Role | POS Billing | Own Sales | Stock Lookup | Cost / Profit / Capital | Staff Management | Day-Close | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (All Tenants, MRR) |
| **Store Owner / Admin** | ✅ | ✅ | ✅ | ✅ | ✅ (Full) | ✅ | ❌ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ (No Delete) | ✅ | ❌ |
| **Accountant** | ❌ | ❌ | ✅ | ✅ (Read-only) | ❌ | ❌ | ❌ |
| **Cashier / Employee** | ✅ | ✅ (Own only) | ✅ (Stock counts) | ❌ (Strict 403 API & UI) | ❌ | ❌ | ❌ |

> **Security Rule**: Permissions are enforced on **both UI and API**. If a Cashier attempts to call `/api/finance/daily`, `/api/finance/day-close`, or request `costPrice` on variants, the API returns `403 Forbidden` and completely strips cost/profit data.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (Tested on Node v24.20)
- **npm**: v9+ or v11+

### 2. Setup & Database Seeding
The project is configured out-of-the-box with **Prisma ORM** and SQLite for zero-friction local execution, with a production PostgreSQL schema ready for Neon/Supabase/Vercel.

```bash
# 1. Install dependencies
npm install

# 2. Sync database schema
npx prisma db push

# 3. Seed rich retail inventory, users, historical sales & Z-reports
node scripts/seed.mjs

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` to access the terminal.

---

## 🔑 Pre-Seeded Test Accounts

| Account Role | Email | Password | Permissions & Notes |
| :--- | :--- | :--- | :--- |
| **Store Owner** | `owner@voguethreads.com` | `admin123` | Full access to finances, employees, settings, and day-close. |
| **Cashier #1** | `cashier1@voguethreads.com` | `cashier123` | Lead Cashier. POS billing only. **Cost prices and profits strictly hidden.** |
| **Cashier #2** | `cashier2@voguethreads.com` | `cashier123` | Weekend Cashier terminal. |
| **Store Manager** | `manager@voguethreads.com` | `admin123` | Can override prices, view finances; cannot delete employees. |
| **Accountant** | `accountant@voguethreads.com` | `admin123` | Read-only financial statements, tax breakdown, and profit-loss. |
| **Super Admin** | `admin@saaspos.com` | `admin123` | SaaS owner: views all tenants, MRR, changes plans, impersonates. |
| **Isolated Tenant** | `owner@urbanknit.com` | `admin123` | Secondary tenant ("UrbanKnit Studio") verifying row-level isolation. |

> **Tip**: You can switch roles with 1-click in the top-right navigation bar using the **"Switch Demo Role"** pill.

---

## 🏷️ Barcodes Cheat Sheet for Fast Testing

| Barcode | Garment Product | Color / Size | Selling Price |
| :--- | :--- | :--- | :--- |
| `890123456001` | Oxford Cotton Button-Down Shirt | Sky Blue / S | $59.00 |
| `890123456002` | Oxford Cotton Button-Down Shirt | Sky Blue / M | $59.00 |
| `890123456004` | Oxford Cotton Button-Down Shirt | Crisp White / M | $59.00 |
| `890123456006` | Slim-Fit Stretch Denim Jeans | Vintage Indigo / 30 | $89.00 |
| `890123456007` | Slim-Fit Stretch Denim Jeans | Vintage Indigo / 32 | $89.00 |
| `890123456010` | Floral Chiffon Tiered Midi Dress | Emerald Floral / S | $95.00 |
| `890123456014` | Merino Wool Ribbed Turtleneck | Warm Camel / S | $115.00 |
| `890123456017` | Therma-Sphere Running Zip Jacket | Stealth Black / M | $129.00 |
| `890123456020` | Handmade Mulberry Silk Scarf | Royal Burgundy / One Size | $42.00 |

---

## 🧪 Testing Suite (Vitest)

The project includes unit and integration tests verifying RBAC security, financial math, and POS state:

```bash
# Run test suite
npm test
```

### Test Coverage Highlights:
- `tests/rbac.test.ts`: Verifies Cashier cannot view finance, cost prices, or manage employees; verifies Manager cannot delete staff; verifies Store Admin & Super Admin scopes.
- `tests/finance.test.ts`: Verifies COGS, Gross Profit, Net Profit, Weighted-Average Cost formula, and cash drawer reconciliations.
- `tests/cart.test.ts`: Verifies cart scanning, duplicate incrementing, line/bill discounts, taxes, and bill parking/resuming.

---

## 🐳 Docker Production Deployment

To run containerized with PostgreSQL:

```bash
# Run with Docker Compose
docker-compose up -d --build
```
