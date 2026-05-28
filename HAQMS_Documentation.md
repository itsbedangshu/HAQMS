# HAQMS Technical Documentation

**Project:** Hospital Appointment & Queue Management System (HAQMS)  
**Date:** May 2026

---

## 1. Issues Identified

During the initial codebase audit, several critical architectural, performance, and security bugs were discovered:

*   **Security (SQL Injection):** The Doctor Directory search API (`/api/doctors`) utilized `prisma.$queryRawUnsafe` with raw string concatenation, allowing malicious actors to inject raw SQL syntax.
*   **Security (Information Disclosure):** The global Express error handler leaked raw backend stack traces and file paths directly to the frontend.
*   **Security (Authorization Bypass):** The application failed to enforce Role-Based Access Control (RBAC) on critical endpoints, allowing lower-privileged Receptionist users to delete patient records.
*   **Performance (N+1 Query):** The Appointment API looped over individual appointment records, executing sequential select statements to fetch related Patient and Doctor data, causing severe database bottlenecks.
*   **Performance (Event Loop Blocking):** The Admin Reporting API performed sequential blocking queries inside a `for` loop, dragging down throughput and artificially delaying rendering.
*   **Data Integrity (Race Conditions):** The Live Queue generation API utilized a basic "read-then-write" pattern. If two receptionists checked in patients at the exact same millisecond, identical queue tokens were issued.
*   **Data Integrity (Schema Pollution):** Form inputs for numeric data (like phone numbers) lacked robust validation, permitting string pollution into the PostgreSQL database.

---

## 2. Fixes Implemented

*   **SQL Injection Remediation:** Refactored the Doctor Directory search to utilize Prisma's parameterized `Prisma.sql` queries, effectively neutralizing any injection attempts by sanitizing user input automatically.
*   **Secure Error Handling:** Rewrote the `index.js` global error handler to strip internal system messages in production environments, ensuring that only generic 500-level error messages reach the client.
*   **Access Control Enforcement:** Restored and hardened JWT role validation to ensure only users with the `ADMIN` role can execute destructive deletion requests.
*   **N+1 Query Elimination:** Replaced the sequential iteration loop in the Appointments API with Prisma's highly efficient `include` relational fetch, flattening database traffic to a single optimized join query.
*   **Race Condition Mitigation:** Overhauled the Token Generation logic. Implementing atomic checks to ensure token numbering is robust and duplicate-proof under concurrent load.
*   **Input Validation:** Enforced strict regex pattern-matching on the frontend UI and backend controllers to ensure telephone and demographic data remain cleanly formatted.

---

## 3. Optimizations Performed

*   **Concurrent Asynchronous Processing:** Rewrote the heavy Admin System Audit reporting engine to utilize `Promise.all()`. This allowed nested database queries to resolve concurrently, drastically cutting API latency and unlocking the Node.js event loop.
*   **Debounce Search Logic:** Implemented debounce techniques on the frontend search bars (such as the Patient Registry table) to reduce API spam and lower database resource utilization during fast keystrokes.
*   **UI/UX Polishing & Interactivity:** Integrated full loading states (`isRegistering`, `isBooking`, `isCheckingIn`) to all forms and buttons. This provides visual feedback (spinners) and dynamically disables submit buttons to physically prevent users from double-submitting forms over slow networks. Added a global Next.js `loading.js` state for seamless page transitions.

---

## 4. Remaining Known Issues

The application is currently stable and all critical assignment bugs have been eliminated. However, for a massive enterprise-scale deployment, the following minor architectural considerations remain:

*   **Prisma Schema Indexing:** The database currently lacks composite indexes on foreign keys (like `department`, `specialization`, and `status`). If the hospital scales to millions of records, adding `@@index` tags to the Prisma schema will be necessary to prevent full table scans.
*   **Real-time State Updates:** The live queue board currently relies on manual refresh triggers when state changes. In a V2 release, implementing Server-Sent Events (SSE) or WebSockets would allow the board to update instantly across all receptionists' screens without manual fetches.

---

## 5. Approach and Reasoning

When addressing the architectural flaws of the system, the primary philosophy was to **leverage the native capabilities of the stack rather than over-engineering solutions**. 

For example:
*   Rather than implementing a heavy message broker (like RabbitMQ) to handle the token generation race condition, the logic was refactored natively inside the existing API request cycle to achieve the same result cleanly.
*   Rather than installing a heavyweight form validation library like Zod or Formik, security was achieved using native HTML5 pattern matching paired with lightweight backend conditional checks to keep the bundle size small and performant.

The approach followed a strict hierarchy: **Security first** (patching SQL injection and auth bypass), **Data Integrity second** (fixing race conditions and schema pollution), and **Performance third** (resolving N+1 queries and concurrent loop resolution). Finally, UI optimization was layered on top to create a polished, production-ready aesthetic.
