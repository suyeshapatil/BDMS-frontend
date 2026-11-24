# Blood Donation Management System (BDMS) — Frontend

React 18 / Vite frontend for the CDAC Final Year Major Project **Blood Donation
Management System** (Project Code `PGCP-AC-027`). Built to integrate exactly with
the existing Spring Boot backend — every API call, request field, and response field
in this app mirrors the backend's controllers/DTOs one-to-one. No endpoints, fields,
or data were invented.

---

## 1. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 (JavaScript, not TypeScript) |
| Build tool | Vite |
| Routing | React Router DOM v6 |
| HTTP client | Axios (single shared instance) |
| Auth | JWT (access + refresh), stored in `localStorage` |
| State | React Context API (`AuthContext`) |
| Styling | Bootstrap 5 |
| Icons | react-icons (Feather set) |
| Charts | Recharts |
| Notifications | react-toastify |
| Forms | react-hook-form |

---

## 2. Project Structure

```
src/
├── api/            # axiosClient.js + one file per backend module (11 total)
├── components/
│   ├── common/     # Loader, Spinner, SearchBar, Pagination, ConfirmModal,
│   │               # EmptyState, ProfileCard, StatusBadge, NotificationsList
│   ├── layout/      Navbar, Sidebar, Footer, Breadcrumb, PublicLayout, DashboardLayout
│   ├── forms/        FormInput, FormSelect, FormTextarea
│   ├── tables/       DataTable
│   ├── dashboard/     StatCard
│   └── charts/         AdminStatsChart
├── pages/
│   ├── public/     Home, About, Contact
│   ├── auth/       Login, Register, ForgotPassword, ResetPassword
│   ├── donor/      Dashboard, Profile, BloodRequests, DonationHistory, Notifications
│   ├── hospital/   Dashboard, Profile, CreateBloodRequest, ManageBloodRequests,
│   │               SearchDonors, Notifications
│   ├── admin/      Dashboard, ManageUsers, ManageDonors, ManageHospitals,
│   │               ApproveHospitals, AdminBloodRequests, AdminDonationHistory,
│   │               AdminReports, AdminNotifications
│   └── errors/     NotFound (404), Forbidden (403), ServerError (500)
├── context/        AuthContext.jsx
├── hooks/          useAuth, usePagination
├── routes/         ProtectedRoute, RoleRoute
├── constants/      roles.js, enums.js, routes.js
├── utils/          tokenStorage.js, formatters.js
├── App.jsx
└── main.jsx
```

---

## 3. Setup Instructions

### 3.1 Prerequisites
- Node.js 18+ and npm
- The BDMS Spring Boot backend running (default: `http://localhost:8080`)

### 3.2 Install & configure

```bash
cp .env.example .env
# edit .env if your backend isn't on localhost:8080
npm install
npm run dev
```

The app starts on **http://localhost:5173** (Vite default).

### 3.3 Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

### 3.4 Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Base URL the axios client prefixes every request with |

---

## 4. Authentication Flow

1. **Register** (`/register`) — role-conditional form (Donor / Hospital / Admin) posts to `POST /auth/register`. On success the access + refresh tokens and user info are stored and the person is redirected straight to their role's dashboard (no separate login step needed).
2. **Login** (`/login`) — `POST /auth/login`, same token/redirect behavior.
3. **Auto-login** — `AuthContext` restores the session from `localStorage` on every page load/refresh, so an already-logged-in person is never bounced back to `/login`.
4. **JWT attachment** — a single axios instance (`api/axiosClient.js`) attaches `Authorization: Bearer <accessToken>` to every request automatically.
5. **Auto-refresh** — on a `401`, the interceptor transparently calls `POST /auth/refresh-token` once, retries the original request with the new token, and queues any other requests that failed concurrently so they don't each trigger their own refresh.
6. **Auto-logout** — if the refresh call itself fails (refresh token expired/invalid), storage is cleared and the browser is redirected to `/login`.
7. **Forgot / Reset password** — `POST /auth/forgot-password` emails a token (per backend design, this is a short-lived JWT, not a DB-stored token); `/reset-password` posts `{ token, newPassword }` to `POST /auth/reset-password`.
8. **Logout** — calls `POST /auth/logout` (best-effort; the JWT is stateless) and always clears local storage regardless of the API's response.

## 5. Routing & Role Guards

- `ProtectedRoute` — redirects to `/login` if not authenticated (and remembers the attempted URL to return to after login).
- `RoleRoute` — redirects to `/403` if the logged-in user's role isn't in the route's `allowedRoles`.
- Every Donor/Hospital/Admin route is wrapped in **both** guards, so an authenticated Donor hitting a Hospital-only URL gets a 403 page, not a broken screen.

## 6. API Integration Guide (for frontend developers)

Each backend module has exactly one file in `src/api/`, and every exported function
maps to exactly one backend endpoint (method + path in the comment below):

| File | Backend endpoints covered |
|---|---|
| `authApi.js` | `POST /auth/register`, `/login`, `/refresh-token`, `/forgot-password`, `/reset-password`, `/change-password`, `/logout` |
| `donorApi.js` | `GET/PUT/PATCH/DELETE /donors`, `/donors/{id}`, `/donors/me`, `/donors/{id}/availability` |
| `hospitalApi.js` | `GET /hospitals`, `/hospitals/verified`, `/hospitals/{id}`, `/hospitals/me`; `PUT/DELETE /hospitals/{id}` |
| `bloodRequestApi.js` | `POST /blood-requests`, `GET /blood-requests`, `/{id}`, `/hospital/{id}`, `/matching-me`; `PATCH /{id}/status`; `DELETE /{id}` |
| `donorResponseApi.js` | `POST /donor-responses/accept`, `/reject`; `PATCH /{id}/status`; `GET /donor/{id}`, `/request/{id}` |
| `donationHistoryApi.js` | `POST /donation-history`; `GET /donation-history`, `/donor/{id}`, `/hospital/{id}` |
| `hospitalApprovalApi.js` | `POST /hospital-approvals`; `GET /hospital-approvals`, `/hospital/{id}` |
| `notificationApi.js` | `POST /notifications`; `GET /notifications/me`, `/me/unread`; `PATCH /{id}/read`; `DELETE /{id}` |
| `reportApi.js` | `POST /reports`; `GET /reports` |
| `dashboardApi.js` | `GET /dashboard/stats` |
| `adminUserApi.js` | `GET /admin/users`, `/{id}`; `PATCH /{id}/activate`, `/{id}/deactivate`; `DELETE /{id}` |

**Response shape:** every backend response is wrapped as
`{ success, message, data, timestamp }` (the backend's `ApiResponse<T>`). Every
`axiosClient` call in this app reads the payload via `response.data.data` —
components never need to unwrap this themselves.

**Error shape:** `axiosClient`'s response interceptor normalizes every failure into
`{ status, message, errors }`, where `errors` is the backend's field-level validation
map (`{ fieldName: "message" }`) when present, or `null` otherwise. Forms display
`err.message` via toast and can additionally read `err.errors` for field-level detail.

**Adding a new endpoint:** add one function to the relevant `api/*.js` file (or a new
file if it's a new backend module), call it from a page/component, and unwrap with
`response.data.data`. Never call `axios`/`fetch` directly from a component.

---

## 7. Known Design Notes

- Refresh tokens and password-reset tokens are stateless JWTs on the backend (no
  server-side revocation), matching the backend's own documented design — the
  frontend doesn't add anything on top of that.
- Client-side pagination (`usePagination`) is used for admin list pages since the
  backend's list endpoints don't paginate server-side.
- `SearchDonors` (hospital) and `ManageDonors`/`ManageUsers` (admin) filter using the
  exact query parameters the backend's `GET /donors` endpoint supports
  (`bloodGroup`, `city`) plus client-side text filtering for convenience.

## 8. Verification Status

This project could not be run through `npm install && npm run build` in the sandbox
that produced it — outbound access to the npm registry was blocked
(`403 host_not_allowed`). In place of a runtime build, the following static checks
were performed and passed on the full source tree:

- Every relative import (`./`, `../`) resolves to a real file
- No unused imports, no duplicate import sources per file
- No `TODO`/`FIXME`/placeholder/mock-data markers anywhere in `src/`
- No unreachable-code patterns
- Every `<Route>` in `App.jsx` references an imported, existing page component
- Every Sidebar link has a matching route
- Every `api/*.js` function maps to a real, existing backend endpoint (cross-checked
  against the backend's controllers)

**Please run `npm install && npm run build` locally** as the final confirmation
before deploying — this documents that the check was done as thoroughly as possible
without an actual compiler/bundler run, not that a build was watched to succeed.
