import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { StayDetail } from "./pages/StayDetail";
import { Experiences, Saved, NotFound } from "./pages/Collections";
export function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      location.pathname === "/"
        ? "ROAMLY — A little further from ordinary"
        : `ROAMLY — ${location.pathname.startsWith("/stays/") ? "Your next escape" : location.pathname.slice(1).replace(/^./, (c) => c.toUpperCase())}`;
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stays" element={<Catalog />} />
          <Route path="/stays/:id" element={<StayDetail />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
