import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout.jsx";
import Home from "./pages/home.jsx";
import NoPage from "./pages/no-page";
import SimpleListItems from "./features/simple-list-items";
import Todos from "./features/todos";
import Games from "./features/games-list";
import HackerNews from "./features/hacker-news";

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="simple-list-items" element={<SimpleListItems />} />
          <Route path="todos" element={<Todos />} />
          <Route path="games-list" element={<Games />} />
          <Route path="hacker-news" element={<HackerNews />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
