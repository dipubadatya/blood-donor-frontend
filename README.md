

# Blood Donor Tracker

A React application that helps medical clinics find nearby blood donors. Features interactive maps, role-based dashboards, distance-based filtering, and real-time donor visibility.

**Live App:** [https://blood-donor-tracker.vercel.app](https://blood-donor-tracker.vercel.app)
**Backend API:** [https://blood-donor-backend-0ri5.onrender.com](https://blood-donor-backend-0ri5.onrender.com)

**Repositories:**
[Frontend](https://github.com/dipubadatya/blood-donor-frontend) · [Backend](https://github.com/dipubadatya/blood-donor-backend)

---

## The Problem

When a patient urgently needs blood, clinics waste critical time calling through donor lists manually. There's no quick way to know which donors are nearby, available, and have the right blood group. This app puts that information on a map in seconds.

---

## How It Works

There are two roles — **Donors** and **Medical Staff**. Each sees a different dashboard after logging in.

**Donors** can:
- Update their profile and location coordinates
- Toggle their availability on or off
- Control whether they appear in search results

**Medical Staff** can:
- Search donors by blood group
- Filter results within a 5km or 10km radius
- View matching donors on an interactive map
- See each donor's name, blood group, distance, availability, and contact option

---

## Built With

**Frontend:** React 19, Vite, React Router v7, Tailwind CSS, Leaflet, Framer Motion, Axios

**Deployment:** Vercel (frontend), Render (backend)

---

## Screenshots

<div align="center">

### Landing Page
<img width="100%" alt="Landing Page" src="https://github.com/user-attachments/assets/b6904c68-4f40-4862-8670-447080c38344" />

<br/><br/>

### Login
<img width="100%" alt="Login Page" src="https://github.com/user-attachments/assets/352e3fa2-735f-45a6-ad4c-8982de53976f" />

<br/><br/>

### Registration
<img width="100%" alt="Register Page" src="https://github.com/user-attachments/assets/9c6dd99e-4a3c-499b-803c-ec5b99611b0b" />

<br/><br/>

### Medical Search
<img width="100%" alt="Medical Search Page" src="https://github.com/user-attachments/assets/15747604-641b-418a-bd14-c1b06bc25644" />

<br/><br/>

### Map View
<img width="100%" alt="Map View" src="https://github.com/user-attachments/assets/a523569e-45b8-4dbb-b78a-7f8ec8a60dd3" />

<br/><br/>

### Donor Dashboard
<img width="100%" alt="Donor Dashboard" src="https://github.com/user-attachments/assets/054eef87-56ea-43d4-9410-3377a2d6db19" />

</div>

---

## Map Integration

Built with Leaflet and React Leaflet:

- OpenStreetMap tile layer
- Dynamic marker rendering based on search results
- Distance-based filtering draws only relevant donors
- Markers update as donors toggle availability

---

## Authentication

- Login and registration with role selection
- Token-based session handling
- Protected routes redirect unauthorized users
- Role-based redirection — donors and medical staff land on different dashboards

---

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── App.jsx
├── public/
├── vercel.json
└── package.json
```

---

## Getting Started

### Clone and install

```bash
git clone https://github.com/dipubadatya/blood-donor-frontend.git
cd blood-donor-frontend
npm install
```

### Configure environment

Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=https://blood-donor-backend-0ri5.onrender.com/api
```

### Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for production

```bash
npm run build
```

---

## SPA Routing on Vercel

A `vercel.json` file handles client-side routing so page refreshes don't return 404:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Author

**Dipu Badatya**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dipu-badatya/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dipubadatya)
