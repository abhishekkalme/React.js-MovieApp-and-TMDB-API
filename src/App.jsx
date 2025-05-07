import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SearchResult from "./components/SearchResult";
import Movies from "./pages/Movie";
import WebSeries from "./pages/TV";
import TVDetails from "./pages/TVDetails";

const App = () => {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<WebSeries />} />
        <Route path="/tv/:id" element={<TVDetails />} />


      </Routes>
    </Router>
  );
};

export default App;
