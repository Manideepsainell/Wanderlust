
# Wanderlust (Property Booking Platform)

A full-stack property listing and booking platform built with Node.js, Express, MongoDB, and EJS. It supports authentication, authorization, Cloudinary image uploads, and map-based property visualization using Mapbox.

## 🔥 Features
- User authentication & authorization (JWT/session-based depending on your implementation)
- Property listing CRUD (Create / Read / Update / Delete)
- Cloudinary image upload + deletion pipeline
- Mapbox integration for location display
- Filtering and category-based listings
- Secure routing (only owner can edit/delete listing)
- Modular backend routing (MVC-style organization)

## 🧱 Tech Stack
**Backend:** Node.js, Express.js  
**Frontend:** EJS, HTML, CSS, Bootstrap  
**Database:** MongoDB  
**Image Storage:** Cloudinary  
**Maps/Geo:** Mapbox

## 📂 Project Structure (High Level)
Wanderlust/
├── models/ # MongoDB schemas
├── routes/ # Express routes
├── controllers/ # Business logic
├── views/ # EJS templates
├── public/ # CSS/JS/assets
└── README.md


## ⚙️ Environment Variables
Create a `.env` file in the root folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
SESSION_SECRET=your_session_secret
```

🚀 Run Locally
1) Clone repo
git clone https://github.com/Manideepsainell/Wanderlust.git
cd Wanderlust

2) Install dependencies
npm install

3) Run the app
npm start


App runs on: http://localhost:3000

🔐 Authorization Rules

Only logged-in users can create listings

Only listing owner can edit/delete a listing

Secure server-side validation and route protection middleware

🛠️ Future Enhancements

Booking system with date selection

Payment integration (Razorpay / Stripe)

Admin dashboard for moderation

Search + advanced filters

👨‍💻 Author

Manideep Sai Nellutla
LinkedIn: https://www.linkedin.com/in/manideep-sai-97681a330/

GitHub: https://github.com/Manideepsainell
