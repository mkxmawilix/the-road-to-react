import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import Games from "./pages/Games";
import HackerNews from "./pages/HackerNews";
import NoPage from "./pages/NoPage";

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="todos" element={<Todos />} />
          <Route path="games-list" element={<Games />} />
          <Route path="hacker-news" element={<HackerNews />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
