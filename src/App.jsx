// src/App.jsx
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AdminContent from "./components/AdminContent";
import "./index.css";

function AppContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Responsive automatique
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Détermine la page à afficher
  const currentPath = window.location.pathname;

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarOpen ? "" : "shifted"}`}>
        {/* Bouton menu mobile */}
        {!sidebarOpen && (
          <button
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label="Ouvrir le menu"
          >
            Menu
          </button>
        )}

        {/* Contenu principal */}
        {currentPath === "/admin-content" ? (
          user ? (
            <AdminContent />
          ) : (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <h1 style={{ color: "#1a2b49" }}>Accès refusé</h1>
              <p>Vous devez être connecté pour accéder à l'administration.</p>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  marginTop: "20px",
                  padding: "12px 30px",
                  background: "#1a2b49",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Retour à l'accueil
              </button>
            </div>
          )
        ) : (
          <Home />
        )}
      </div>
    </div>
  );
}

// App principale avec AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
