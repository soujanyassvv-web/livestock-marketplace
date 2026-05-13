import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Livestock from "./pages/Livestock";
import AddLivestock from "./pages/AddLivestock";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/livestock" element={<Livestock />} />

        <Route path="/add" element={<AddLivestock />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;