# 🍿CineVerse - Movie & TV Explorer

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwindcss&logoColor)](https://tailwindcss.com/)
[![TMDB API](https://img.shields.io/badge/TMDB-API-01B4E4?logo=themoviedatabase&logoColor)](https://developer.themoviedb.org/)
[![License](https://img.shields.io/github/license/abhishekkalme/React.js-MovieApp-and-TMDB-API)](https://github.com/abhishekkalme/React.js-MovieApp-and-TMDB-API/tree/main?tab=MIT-1-ov-file#MIT-1-ov-file)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b70d2d89-1fb9-4036-9f24-9a48d69e4ed8/deploy-status)](https://app.netlify.com/sites/cineverse25/deploys)


> CineVerse is a modern, responsive web application built with **React.js 19** and **Vite** that lets users explore, discover, and track movies, TV shows, and anime using the **TMDB (The Movie Database) API**.

<img src="./Screenshot/Screenshot.png" alt="App Screenshot" width="100%"/>

🔗 **Live Demo**: [https://cineverse25.netlify.app](https://cineverse25.netlify.app/)

---

## 🔥 Features & Highlights

- 🔎 **Comprehensive Search** for movies, TV series, and anime.
- 📺 **Dedicated Platforms Section**: Discover content specifically available on popular streaming platforms.
- 🌸 **Anime Hub**: A specialized page dedicated to anime enthusiasts.
- ✨ **Interactive UI/UX**: Smooth animations and fluid transitions utilizing **Framer Motion**, **Swiper**, and **React Slick**.
- 👤 **User Profiles & Context**: Keep track of watched content and save your favorites using built-in contexts (`AuthContext`, `SavedContext`, `WatchedContext`).
- 🎬 **Detailed Tracking**: Explore seasons, episodes, cast, crew, trailers, and reviews.
- 📍 **Watch Providers**: Built-in integration to see exactly where to stream, rent, or buy content.
- 📱 **Fully Responsive Application**: A mobile-first approach ensuring a premium experience on any device screen.
- 🚀 **Performance Optimized**: Leveraging Vite and React 19 for blazing-fast load times with Skeleton loading components.

## ⚙️ Tech Stack

- **Frontend Framework**: React 19, React Router v7
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4, Lucide React, React Icons
- **State Management**: React Context API (`Auth`, `Saved`, `Watched`)
- **Animations & Sliders**: Framer Motion, Swiper, React Slick
- **API Engine**: [TMDB API](https://developer.themoviedb.org/docs/getting-started) via Axios

## 📂 Project Structure Snapshot
- `src/pages/`: Contains main routes (`Home`, `Movie`, `TV`, `Anime`, `Platforms`, `Profile`, `Watch`, `Community`).
- `src/components/`: Reusable, modular UI components (`Navbar`, `SkeletonCard`, `Modals`, `Pagination`, etc.).
- `src/context/`: Contexts managing the app's global tracking state.
- `src/api/`: TMDB API interaction utilities.

## 🚀 Quick Start

Follow these steps to set up the project locally on your machine.

### Clone the repository

```bash
git clone https://github.com/abhishekkalme/React.js-MovieApp-and-TMDB-API.git
cd React.js-MovieApp-and-TMDB-API
```

### Installation

Install the project dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a new file named `.env.local` in the root of your project and add the following content:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_bearer_token
VITE_TMDB_BASE_URL=your_tmdb_base_url
```
> **Get an API key**: [https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api)

Replace the placeholder values with your actual TMDB credentials. Ensure you sign up as a developer on TMDB if you don't already have an account.

### Running the Project 

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

---
# 📄 License
This project is licensed under the [MIT License](https://github.com/abhishekkalme/React.js-MovieApp-and-TMDB-API/tree/main?tab=MIT-1-ov-file#MIT-1-ov-file).
