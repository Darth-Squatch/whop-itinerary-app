# Whop Itinerary Builder Starter

This is a beginner-friendly starter app for the exact setup you described:

- the **creator** is the only person who can edit a trip
- the **customer** buys access through a Whop product/experience
- the **customer** can only **view** the published itinerary

It uses two Whop app patterns:

- **Dashboard view** for admins to manage trips
- **Experience view** for customers to read their paid itinerary

## What this starter does

- verifies the current Whop user from the iframe header
- checks whether a visitor is an **admin** for dashboard pages
- checks whether a visitor has **paid access** for customer pages
- stores trips in a database
- lets the original creator edit a trip
- blocks non-creators from editing
- only shows published trips to customers

## Important note before you start

This is a **starter project**, not a one-click install.
You will still need to:

1. create the app in Whop
2. set your environment variables
3. run the database migration
4. deploy the app
5. paste the deployed URL into Whop

That said, this gives you a real foundation so you are not starting from zero.

---

## 1. Install the tools on your computer

You need these first:

- Node.js 20+
- npm or pnpm
- Git
- VS Code

## 2. Create your Whop app

In the Whop developer dashboard:

1. click **Create app**
2. copy your **WHOP_API_KEY**
3. copy your **app ID**
4. later, set the base URL to your deployed app

## 3. Put the project on your computer

Unzip this folder, then in Terminal:

```bash
cd whop-itinerary-app
npm install
```

## 4. Add your environment variables

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Then edit `.env` and add your real values:

```env
WHOP_API_KEY=your_real_whop_api_key
WHOP_APP_ID=app_xxxxxxxxxxxxxx
DATABASE_URL="file:./dev.db"
```

## 5. Create the database

This starter uses SQLite so local setup is easy.

```bash
npx prisma generate
npx prisma db push
```

That creates a local database file for development.

## 6. Start the app locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## 7. Understand the two main routes

### Dashboard route

```text
/dashboard/[companyId]
```

Example:

```text
/dashboard/biz_xxxxxxxxxxxxxx
```

This route is for you, the admin/creator.

### Customer route

```text
/experience/[experienceId]
```

Example:

```text
/experience/exp_xxxxxxxxxxxxxx
```

This route is for the paying customer.

---

## 8. How the permission logic works

### Dashboard page

The page checks whether the current user is an **admin** of the company.
If not, the page blocks access.

### Trip editing

Even if someone is an admin, they still cannot edit every trip.
Only the original `creatorUserId` can make changes.

### Experience page

The page checks whether the current user has access to the Whop **experience**.
If they do, they can view the itinerary.
If they do not, access is denied.

---

## 9. How to connect a trip to a paid product

The app stores a trip by **experience ID**.
That means one paid Whop experience should map to one itinerary.

Flow:

1. create or choose a product in Whop
2. connect your app as an experience
3. use that `experienceId` when creating the trip in the dashboard
4. customers who buy access to that experience can open the itinerary page

---

## 10. How to deploy it

The easiest path is Vercel.

### Basic deploy flow

1. push the project to GitHub
2. import the repo into Vercel
3. add the same environment variables in Vercel
4. deploy
5. copy the Vercel URL
6. paste that URL into your Whop app settings as the base URL

---

## 11. What you should change before production

This starter is intentionally simple. Before going live, you should:

- move from SQLite to Postgres
- add better form validation and nicer UI
- add image uploads
- add drag-and-drop sorting
- add delete buttons for days and items
- add proper toasts and loading states
- add a published snapshot system if you want hidden drafts

---

## 12. Production recommendation

When you are ready for a real launch, switch these:

- **database:** Supabase Postgres or Neon Postgres
- **hosting:** Vercel
- **file storage:** Supabase storage

---

## 13. What to do next

A good next sequence is:

1. run this locally
2. create one test trip
3. confirm the dashboard loads in Whop
4. confirm the customer view loads in Whop
5. then improve the UI

---

## 14. Where the important code lives

- `app/dashboard/[companyId]/page.tsx` → creator/admin view
- `app/experience/[experienceId]/page.tsx` → customer view
- `app/api/trips/route.ts` → create trip API
- `app/api/trips/[tripId]/route.ts` → update trip API
- `lib/auth.ts` → Whop auth + access checks
- `lib/whop-sdk.ts` → Whop SDK setup
- `prisma/schema.prisma` → database schema

---

## 15. One small warning

Right now, when you update a trip, the route replaces all days and items with the newest version. That keeps the code simple for learning, but it is not the most efficient production pattern.

That is okay for your first version.
