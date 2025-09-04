# Zerosix Expenses Frontend

A structured, functional React + Vite + TypeScript app with Tailwind and Zustand.

## Features
- Expenses tab with:
  - Month chooser (current + past 11 months)
  - Filters: payer, category, payment type, search
  - Total for the selected month
  - Click an item to open a **full-screen** detail view
- Profile tab
- API integration via Axios using `VITE_API_URL`
- Automatic **mock fallback** if the API is unavailable

## Getting Started
```bash
# 1) Install
npm install

# 2) (Optional) set your API base URL (expects /expenses and /profile)
echo "VITE_API_URL=http://localhost:4000" > .env

# 3) Run
npm run dev
```

### Expected API
- `GET /expenses?start=ISO&end=ISO&payer=&category=&paymentType=&search=` → `Expense[]`
- `GET /profile` → `Profile`

If the API is down or missing, the app uses a seeded in-memory mock.

## Tech
- React 18, Vite 5, TypeScript
- Tailwind CSS
- Zustand for state
- Axios for HTTP
- React Router 6
- dayjs + lucide-react

## Project Structure
```
src/
  components/      # Reusable UI
  pages/           # Routes
  services/        # API client + mocks
  store/           # Zustand store
  utils/           # Helpers
  types.ts
```

## Notes
- Adjust filters and data model in `src/services/api.ts` and `src/types.ts`.
- To adapt for your backend, implement real endpoints and remove the mock fallback.
