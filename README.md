 🌍 Wanderlust – Airbnb Clone

A full-stack web application for property listings and bookings, inspired by Airbnb. Users can register, add new properties, edit listings, upload images, view maps, and book stays.

##🚀 Live Demo
[Wanderlust App](https://wanderlust-uv2i.onrender.com)

## 📌 Features

- 🧑‍💻 User Authentication (Register/Login/Logout)
- 🏠 Add/Edit/Delete Property Listings (CRUD)
- 🖼️ Image Upload with Cloudinary Integration
- 🗺️ Interactive Maps via Mapbox
- 💬 Flash Messages & Validation
- 🔒 Access Control & Authorization
- 🌐 Deployed on Render

## 🛠️ Tech Stack

| Frontend       | Backend       | Database      | Other Tools            |
|----------------|----------------|----------------|-------------------------|
| HTML, CSS, EJS | Node.js, Express.js | MongoDB Atlas | Cloudinary, Mapbox, Mongoose, Render |

## 📁 Folder Structure

wanderlust/
├── models/ # Mongoose schemas
├── public/ # Static assets
├── routes/ # Express routes
├── views/ # EJS templates
├── middleware/ # Custom auth middleware
├── app.js # Entry point
├── cloudinary/ # Config for image upload
└── utils/ # Error handling, helper functions

bash
Copy
Edit

## 🔧 Installation (for local development)

```bash
git clone https://github.com/Manideepsainell/Wanderlust.git
cd Wanderlust
npm install
Set up .env file:

env
Copy
Edit
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=mongodb://localhost:27017/wanderlust
SECRET=your_session_secret
Then start the server:

bash
Copy
Edit
npm start
App runs on: http://localhost:3000

📎 Links
Live App: wanderlust-uv2i.onrender.com

GitHub Repo: github.com/Manideepsainell/Wanderlust

Author
Manideep Sai Nellutla
📧 nmanideepsai25@gmail.com
🔗 LinkedIn

