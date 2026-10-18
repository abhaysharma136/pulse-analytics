# Pulse Analytics

A modern enterprise analytics dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Pulse Analytics demonstrates interactive data visualization, transaction management, API-driven filtering, and performance-conscious frontend architecture.

## Overview

Pulse Analytics provides an analytics workspace for exploring business metrics, revenue trends, traffic sources, and transaction data. It uses mock API responses to demonstrate a realistic dashboard workflow without requiring a production backend or database.

## Features

- **Analytics dashboard:** Business metrics, revenue trends, and traffic-source visualizations.
- **Analytics Explorer:** Explore chart data across configurable date ranges and metrics.
- **Transaction management:** Search, filter, sort, and paginate transaction records.
- **Debounced search:** Reduces unnecessary updates while users type.
- **Virtualized transaction list:** Demonstrates rendering large datasets efficiently.
- **API data fetching:** TanStack Query manages server-state fetching and caching.
- **Mock API layer:** Mock Service Worker (MSW) provides predictable API responses for local development.
- **CSV export:** Export analytics data from the Explorer.
- **Responsive interface:** Built with reusable dashboard components and Tailwind CSS.

## Tech Stack

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| Framework      | Next.js 16, React 19                                |
| Language       | TypeScript                                          |
| Styling        | Tailwind CSS 4, shadcn/ui                           |
| Data fetching  | TanStack Query                                      |
| Tables         | TanStack Table                                      |
| Virtualization | TanStack Virtual                                    |
| Charts         | Recharts                                            |
| Icons          | Lucide React                                        |
| API mocking    | Mock Service Worker                                 |
| Testing        | Vitest, React Testing Library, user-event, jest-dom |
| Build tooling  | Next.js, Turbopack                                  |

## Getting Started

### Prerequisites

- Node.js compatible with your installed Next.js version
- npm

### Installation

Clone the repository or navigate to your local project directory:

```bash
cd pulse-analytics
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_ENABLE_MOCKS=true
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

Build the application:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Testing

Run the automated test suite:

```bash
npm test
```

### Current test coverage

The current suite contains **20 passing tests across 3 test files**.

| Test file                     |  Tests | Coverage                                                       |
| ----------------------------- | -----: | -------------------------------------------------------------- |
| `filterChartData.test.ts`     |      5 | Date-range filtering and chronological ordering                |
| `processTransactions.test.ts` |      7 | Search, status filtering, sorting, and pagination              |
| `TransactionsTable.test.tsx`  |      8 | Rendering, search, filters, sorting, pagination, and UI states |
| **Total**                     | **20** | **All passing**                                                |

These results reflect the current test suite; they do not imply complete coverage of every application component or integration.

## Architecture

The application uses the Next.js App Router and separates dashboard presentation, data fetching, API mocking, and reusable data-processing utilities.

Key areas of the codebase include:

- `src/app/` — Application routes, layout, and providers.
- `src/features/analytics/` — Analytics Explorer and chart-data utilities.
- `src/features/transactions/` — Transaction table, query hooks, virtualization, and processing utilities.
- `src/services/` — API request functions.
- `src/mocks/` — Mock API handlers and sample data.
- `src/types/` — Shared TypeScript types.
- `src/test/` — Test environment setup.

The exact file organization may evolve as the application grows.

### Data flow

1. Dashboard components request data through service functions.
2. TanStack Query manages requests and cached results.
3. MSW intercepts supported API requests when mock mode is enabled.
4. Mock handlers return analytics and transaction data.
5. UI controls update query parameters or filter chart data.
6. Reusable components render the resulting metrics, charts, and tables.

## Performance Considerations

The application incorporates several frontend optimization techniques:

- **Dynamic imports:** Selected dashboard components and chart-heavy UI are loaded dynamically.
- **Query caching:** TanStack Query uses a configured stale time to reduce unnecessary refetching.
- **Debounced input:** Search input updates are debounced.
- **Request cancellation:** The transaction API flow supports abort signals.
- **Virtualized rendering:** TanStack Virtual renders a window of rows instead of mounting every transaction simultaneously.
- **Memoized computations:** Memoization is used where appropriate for derived data and rendering.

These are implementation techniques, not guarantees of a particular Lighthouse score or performance improvement.

## Production Build Measurements

Measurements captured locally on October 18, 2026:

| Measurement                      | Result                   |
| -------------------------------- | ------------------------ |
| Production build                 | Successful               |
| TypeScript validation            | Passed                   |
| Static routes reported           | `/` and `/_not-found`    |
| Generated JavaScript chunk files | 14                       |
| Combined JavaScript chunk size   | 1,098 KB (approximately) |
| Automated tests                  | 20 passing               |

**Measurement notes:** The JavaScript size is the sum of the generated `.next/static/chunks/**/*.js` files, measured from the local production build. It is an uncompressed aggregate across chunks, not the initial JavaScript required for the homepage. It should not be interpreted as the page's network transfer size.

Lighthouse scores, compressed transfer sizes, real-device timings, and before/after performance comparisons have not yet been measured.

## Scope and Limitations

- Dashboard data is mocked for demonstration.
- No production database or authentication system is included in the documented demo scope.
- Performance results depend on the browser, machine, network, and production deployment.
- Mock data and local build measurements should not be interpreted as production analytics.

## Future Improvements

- Add browser-based Lighthouse measurements and performance budgets.
- Expand component and integration test coverage.
- Add loading, error, and empty states to remaining dashboard sections.
- Connect the interface to a production API.
- Add authentication, authorization, and persistent data storage.
- Add automated CI checks for linting, tests, and production builds.

## License

Add a license before distributing or publishing the project if you intend to make it open source.
