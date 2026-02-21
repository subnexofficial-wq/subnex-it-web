# Subnex IT Web (subnex-web)

Production-style Next.js ecommerce platform for digital products, subscriptions, and automation services, with user authentication, checkout, payment verification, and an admin dashboard.

## Overview

This repository contains the full web application for Subnex:

- Public storefront and product catalog
- Product details with variants, coupon support, and cart flow
- User auth and profile management
- Checkout + payment gateway integration (UddoktaPay)
- Payment webhook + payment sync/verification endpoints
- Admin panel for products, coupons, orders, automation settings, sliders, users, and stats
- MongoDB-backed API using Next.js App Router route handlers

## Tech Stack

- Framework: Next.js 16 (App Router)
- UI: React 19, Tailwind CSS 4
- Database: MongoDB (`sub_nex_web` database)
- Auth: JWT + bcrypt
- Email: Resend
- Analytics: Google Tag Manager (`NEXT_PUBLIC_GTM_ID`)
- Charts/UI libs: Recharts, Swiper, Framer Motion, React Icons, Lucide

## Key Features

- Product browsing, category filtering, and search
- Product detail page with variant pricing, quantity handling, coupon apply/remove, buy-now flow
- Client cart state persisted in `localStorage`
- User auth (`/api/auth/*`) with HTTP-only token cookie
- Admin auth (`/api/admin/auth/*`) with separate `adminToken` cookie and middleware protection
- Order creation + admin email notification
- Payment initiation + webhook-based status update + manual sync/verify fallback
- Review system and rating update pipeline
- Admin modules:
  - Product CRUD
  - Coupon CRUD/validation
  - Order management and status updates
  - Automation settings + automation orders
  - Slider management
  - Dashboard stats, transactions, and user listing

## Project Structure

```text
src/
  app/
    (public)/                Public pages (home, products, cart, checkout, etc.)
    (auth)/                  User login/register pages
    (dashboard)/admin/       Admin login + dashboard pages
    api/                     All backend route handlers
    payment/                 Payment result and method pages
    user/                    User profile/settings pages
    layout.js                Root layout + providers + GTM injection
    sitemap.js               Static sitemap entries
  actions/
    productActions.js        Product read/search server actions
    priceAction.js           Server-side price calculation
  Components/               UI components (storefront, checkout, admin, etc.)
  hooks/
    useAuth.js               Auth context/provider
    CartContext.js           Cart context/provider
  lib/
    auth.js                  Hashing/JWT helpers
    mongodb.js               Mongo connection/cache
    mailer.js                Resend wrapper
  middleware.js              Admin route protection
```

## Application Routes

### Public / User-facing

- `/`
- `/automation`
- `/digital-product`
- `/subscription`
- `/products`
- `/products/[id]`
- `/cart`
- `/checkouts`
- `/contact`
- `/privacy-policy`
- `/terms-of-service`
- `/payment`
- `/payment/[method]`
- `/payment/success`
- `/payment/cancel`
- `/login`
- `/register`
- `/reset-password`
- `/user`
- `/user/profile`
- `/user/settings`

### Admin

- `/admin` (login)
- `/admin/register` (initial/admin registration)
- `/admin/dashboard`
- `/admin/dashboard/products`
- `/admin/dashboard/products/add`
- `/admin/dashboard/orders`
- `/admin/dashboard/coupons`
- `/admin/dashboard/automation`
- `/admin/dashboard/automation-orders`
- `/admin/dashboard/sliders`
- `/admin/dashboard/users`
- `/admin/dashboard/payments-Methods`

## API Reference

### Authentication (User)

- `[POST] /api/auth/register`
- `[POST] /api/auth/login`
- `[POST] /api/auth/logout`
- `[GET, PUT, DELETE] /api/auth/me`
- `[POST] /api/auth/forgot-password`
- `[POST] /api/auth/reset-password`

### Authentication (Admin)

- `[POST] /api/admin/auth/register`
- `[POST] /api/admin/auth/login`
- `[POST] /api/admin/auth/logout`

### Products

- `[GET] /api/products`
- `[GET] /api/products/[id]`
- `[GET] /api/products/category/[category]`
- `[GET] /api/products/search`
- `[POST] /api/admin/products/create`
- `[GET] /api/admin/products/list`
- `[PUT] /api/admin/products/update`
- `[PUT, DELETE] /api/admin/products/[id]`
- `[DELETE] /api/admin/products/delete`

### Coupons

- `[GET] /api/coupons/validate`
- `[POST] /api/admin/coupons`
- `[POST] /api/admin/coupons/create`
- `[GET] /api/admin/coupons/list`
- `[GET] /api/admin/coupons/validate`
- `[GET, PUT, DELETE] /api/admin/coupons/[id]`

### Orders & Payments

- `[POST] /api/orders`
- `[GET] /api/orders/[id]`
- `[GET] /api/orders/my-orders`
- `[GET] /api/orders/success`
- `[POST] /api/checkout`
- `[POST] /api/uddoktapay/initiate`
- `[POST] /api/webhook/uddoktapay`
- `[POST] /api/orders/sync-payment`
- `[POST] /api/orders/verify-payment`
- `[POST] /api/payment/verify`
- `[GET] /api/admin/orders`
- `[PATCH] /api/admin/orders/[id]`
- `[GET] /api/admin/transactions`

### Automation

- `[GET] /api/automationPublic`
- `[GET, POST, PUT, DELETE] /api/admin/automation`
- `[GET, PUT, DELETE] /api/admin/automation-orders`

### Other

- `[GET, POST] /api/reviews`
- `[GET, POST, DELETE] /api/admin/sliders`
- `[GET] /api/admin/stats`
- `[GET] /api/admin/users/list`

## Database Collections

The codebase uses these MongoDB collections:

- `users`
- `admins`
- `products`
- `orders`
- `automation_orders`
- `coupons`
- `reviews`
- `transactions`
- `sliders`
- `automation_settings`

Database name in code: `sub_nex_web`.

## Environment Variables

Create `.env.local` in project root.

```env
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

MASTER_ADMIN_KEY=

RESEND_API_KEY=
INVOICE_EMAIL="Subnex Invoice <billing@example.com>"
SECURITY_EMAIL="Subnex Security <security@example.com>"
ADMIN_EMAIL="Subnex Order <order@example.com>"

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_IMGBB_API_KEY=

UDDOKTAPAY_API_KEY=
UDDOKTAPAY_BASE_URL=https://pay.subnexit.com/api/checkout-v2
NEXT_PUBLIC_BASE_URL=https://subnexit.com/
```

### Variable Notes

- `MONGODB_URI`: MongoDB connection string.
- `JWT_*`: User/admin token signing + expiry.
- `MASTER_ADMIN_KEY`: Required by admin registration endpoint.
- `RESEND_API_KEY` + `*_EMAIL`: Outbound email sender setup.
- `NEXT_PUBLIC_IMGBB_API_KEY`: Client-side uploads to ImgBB.
- `UDDOKTAPAY_*`: Payment checkout + verification.
- `NEXT_PUBLIC_BASE_URL`: Used to build redirect/cancel/webhook URLs.

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB database

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

Open `https://subnexit.com/`.

### Build & Start Production Mode

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Auth and Access Control

- User JWT cookie: `token`
- Admin JWT cookie: `adminToken`
- Middleware (`src/middleware.js`) guards `/admin/*`
- Admin login includes attempt limit + temporary lock logic

## Payment Lifecycle (High-level)

1. Frontend starts checkout and calls payment endpoints.
2. Order is stored with `paymentStatus: unpaid`.
3. User pays through UddoktaPay.
4. Webhook endpoint verifies payment status against gateway and updates DB.
5. Fallback/manual APIs (`/api/orders/sync-payment`, `/api/orders/verify-payment`, `/api/payment/verify`) support reconciliation.

## Images and External Hosts

Configured in `next.config.mjs`:

- `https://i.ibb.co/**`
- `https://placehold.co/**`

## SEO

- Static sitemap defined in `src/app/sitemap.js`.
- Base URL currently hardcoded there as `https://subnexit.com`.

## Security Notes

- Never commit real secrets to git.
- Rotate all keys immediately if secrets were exposed in history.
- Use different credentials for local/staging/production.
- For production, enforce HTTPS and verify secure cookie behavior.

## Deployment Checklist

- Set all required environment variables.
- Confirm `NEXT_PUBLIC_BASE_URL` matches deployment domain.
- Confirm webhook endpoint is reachable publicly.
- Verify MongoDB network/IP access rules.
- Run `npm run build` and fix all lint/runtime issues.

## Known Improvement Areas

- Add automated tests (unit/integration/e2e).
- Add API request validation schema layer.
- Standardize error response contracts.
- Add rate limiting for auth/payment endpoints.
- Add `.env.example` (recommended for onboarding).

## License

No license file is currently defined in this repository. Add one if external contribution/distribution is planned.
