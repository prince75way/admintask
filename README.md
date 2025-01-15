# Admin Task Management API

This is a backend application built with **TypeScript** and **Express.js** for managing user profiles, authentication, and user administration functionalities such as blocking users, disabling two-factor authentication, updating passwords, and handling profile images.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features
- **User Authentication**: Login, update password, and two-factor authentication support.
- **Email Notification**: Sends email on registration or forgot password using `nodemailer`.
- **User Blocking**: Admins can block or unblock users.
- **Profile Management**: Upload profile images using `multer`.
- **Swagger Documentation**: API documentation using Swagger.

---

## Technologies Used
- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB with Mongoose**
- **Multer for file uploads**
- **Nodemailer for sending emails**
- **JWT for authentication**
- **Swagger for API documentation**

---

## Getting Started

### Prerequisites
- Node.js (>= 14.x)
- MongoDB

### .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/admin-task-db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

