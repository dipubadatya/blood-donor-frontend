
# 🩸 Blood Donor Tracker – Frontend

A modern, responsive React application that enables medical clinics to find nearby blood donors using interactive maps, role-based dashboards, and real-time distance filtering.

---

## 🌐 Live Application

Frontend:
https://blood-donor-tracker.vercel.app

Backend API:
https://blood-donor-backend-0ri5.onrender.com

---

## 📦 Repository

Frontend:
https://github.com/dipubadatya/blood-donor-frontend

Backend:
https://github.com/dipubadatya/blood-donor-backend

---

## 🚀 Features

### 🔐 Authentication UI

- Login & Registration
- Role-based redirection
- Protected routes
- Token-based session handling

---

### 🧑‍🩸 Donor Dashboard

- Update profile details
- Update location coordinates
- Toggle availability (On / Off)
- View current availability status

---

### 🏥 Medical Dashboard

- Search donors by blood group
- Filter donors within 5km / 10km radius
- Interactive map with donor markers
- Donor cards displaying:
  - Name
  - Blood group
  - Distance
  - Availability
  - Contact option

---

## 🗺 Map Integration

Built using Leaflet and React Leaflet:

- Interactive OpenStreetMap tiles
- Dynamic marker rendering
- Distance-based filtering
- Real-time donor visibility

---

## 🛠 Tech Stack

- React 19
- Vite
- React Router v7
- Axios
- Tailwind CSS
- Leaflet
- Framer Motion
- Vercel (Deployment)

---

## 📁 Folder Structure

```

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── App.jsx
│
├── public/
├── vercel.json
└── package.json

```

---

## ⚙️ Installation (Local Development)

### 1️⃣ Clone Repository

```

git clone [https://github.com/dipubadatya/blood-donor-frontend.git](https://github.com/dipubadatya/blood-donor-frontend.git)
cd blood-donor-frontend

```

### 2️⃣ Install Dependencies

```

npm install

```

### 3️⃣ Setup Environment Variables

Create `.env` file:

```

VITE_BACKEND_URL=[https://blood-donor-backend-0ri5.onrender.com/api](https://blood-donor-backend-0ri5.onrender.com/api)

```

### 4️⃣ Run Development Server

```

npm run dev

```

Runs on:
http://localhost:5173

---

## 🚀 Build for Production

```

npm run build

```

---

## 🔄 SPA Routing Fix (Vercel)

`vercel.json` added:

```

{
"rewrites": [
{
"source": "/(.*)",
"destination": "/index.html"
}
]
}

```

Prevents 404 errors on refresh.

---

## 📸 Screenshots

- Landing Page
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 130849" src="https://github.com/user-attachments/assets/b6904c68-4f40-4862-8670-447080c38344" /> </p>

- Login Page
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 130808" src="https://github.com/user-attachments/assets/352e3fa2-735f-45a6-ad4c-8982de53976f" />  </p>

- Register  Page
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 130821" src="https://github.com/user-attachments/assets/9c6dd99e-4a3c-499b-803c-ec5b99611b0b" />  </p>

- Medical Search Page
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 130912" src="https://github.com/user-attachments/assets/15747604-641b-418a-bd14-c1b06bc25644" /> </p>

- Map View
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 131018" src="https://github.com/user-attachments/assets/a523569e-45b8-4dbb-b78a-7f8ec8a60dd3" />  </p>

- Donor Dashboard
<p align="center">  <img width="1920" height="1080" alt="Screenshot 2026-02-21 131108" src="https://github.com/user-attachments/assets/054eef87-56ea-43d4-9410-3377a2d6db19" />  </p>


---

## 👨‍💻 Author

DIPU BADATYA
GitHub: https://github.com/dipubadatya  
LinkedIn: https://www.linkedin.com/in/dipu-badatya/
```



Tell me which one you want.
