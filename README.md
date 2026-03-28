# TicketFlow

A high-performance concert ticket booking platform built with Next.js. Supports real-time inventory tracking, discount code validation, and secure payment processing via Stripe.

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** + [MagicUI](https://magicui.design) components
- **Stripe** for payment processing
- **GCP Cloud Run** for deployment

---

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

Copy `.env.production.example` and fill in your values:

```bash
cp .env.production.example .env.local
```

| Variable | Description |
|----------|-------------|
| `Stripe_CHANNEL_SECRET` | Stripe secret key |
| `NEXT_PUBLIC_BASE_URL` | Public base URL of the service |
| `STATUS_PROVIDER_URL` | URL of the external status-provider Worker (e.g. `https://inferfix-status-provider.YOUR_SUBDOMAIN.workers.dev/status`) |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/activity/status` | Get ticket availability and event status |
| `POST` | `/api/checkout/validate-coupon` | `{ code: string }` — validate a discount code |
| `POST` | `/api/checkout/payment` | Process ticket purchase |
| `POST` | `/api/tickets/reserve` | `{ qty: number }` — reserve 1–4 tickets |

---

## Deployment (GCP Cloud Run)

```bash
docker build -t gcr.io/YOUR_PROJECT/ticketflow .
docker push gcr.io/YOUR_PROJECT/ticketflow

gcloud run deploy ticketflow \
  --image gcr.io/YOUR_PROJECT/ticketflow \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_BASE_URL=https://YOUR_SERVICE_URL.run.app" \
  --set-env-vars="Stripe_CHANNEL_SECRET=sk_live_your_key_here" \
  --set-env-vars="STATUS_PROVIDER_URL=https://inferfix-status-provider.YOUR_SUBDOMAIN.workers.dev/status"
```
