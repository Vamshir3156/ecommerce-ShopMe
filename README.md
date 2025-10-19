# ShopX — Advanced E‑Commerce (JWT, React, SQLite, No External DB)

**Zero external setup.** Backend uses SQLite (file) + JWT in httpOnly cookies. Frontend is React (Vite) + Tailwind + Redux Toolkit.

## Quick Start

```bash
cd ecom-advanced-jwt
npm i
cp server/.env.example server/.env
npm run dev
```

Open client at http://localhost:5173 and API at http://localhost:5000

### Default Accounts
- Admin: admin@shop.dev / Admin@123
- User: demo@shop.dev / Demo@123

### Notes
- To change client origin, set CLIENT_ORIGIN in `server/.env`.
- For production, set real JWT secrets and `NODE_ENV=production`.
