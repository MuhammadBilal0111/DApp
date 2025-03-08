import "./App.css";
import Header from "./components/Header";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Project from "./pages/Project";
import { useEffect, useState } from "react";
import { isWallectConnected } from "./services/blockchain";

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadBlockchain = async () => {
      await isWallectConnected();
      console.log("Blockchain loaded");
      setLoaded(true);
    };

    loadBlockchain();

    return () => {}; // Cleanup function
  }, []);
  return (
    <BrowserRouter>
      <Header />

      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      ) : null}
    </BrowserRouter>
  );
}

export default App;
