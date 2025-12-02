// src/components/Sidebar.jsx
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, signIn, signOut } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      setShowLogin(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowLogin(false);
    // Retour à l'accueil après déconnexion
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
    // Ferme le sidebar sur mobile après clic
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && window.innerWidth <= 768 && (
        <div className="overlay active" onClick={toggleSidebar} />
      )}

      <div
        className={`sidebar ${
          isOpen || window.innerWidth > 768 ? "open" : "closed"
        }`}
      >
        <div className="sidebar-header">
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <img 
      src="/wkw-logo.png" 
      alt="Logo" 
      style={{ height: '90px', borderRadius: '8px' }} 
    />
    <h2 style={{ margin: 0, fontSize: '20px' }}>WKW Automotive</h2>
  </div>
  <button className="toggle-btn" onClick={toggleSidebar}>
    ×
  </button>
</div>

        <ul>
          {/* Accueil */}
          <li
            className={window.location.pathname === "/" ? "active" : ""}
            onClick={() => navigateTo("/")}
          >
            Accueil
          </li>

          {/* Menu admin (visible seulement si connecté) */}
          {user && (
            <>
              <li onClick={() => navigateTo("/admin-content")}>
                Administration du site
              </li>
            </>
          )}

          {/* Séparateur */}
          {user && <hr style={{ margin: "25px 20px", borderColor: "#445" }} />}

          {/* Connexion / Profil */}
          {user ? (
            <>
              <li
                style={{
                  color: "#a8e6cf",
                  fontWeight: "bold",
                  paddingLeft: "30px",
                }}
              >
                {user.email.split("@")[0]}
              </li>
              <li
                style={{ color: "#ff6b6b", fontWeight: "bold" }}
                onClick={handleLogout}
              >
                Déconnexion
              </li>
            </>
          ) : (
            <li
              style={{ fontWeight: "bold", color: "#00d4ff" }}
              onClick={() => setShowLogin(!showLogin)}
            >
              Espace Admin {showLogin ? "▲" : "▼"}
            </li>
          )}
        </ul>

        {/* Formulaire de connexion */}
        {showLogin && !user && (
          <div className="login-form">
            <h3>Espace Administrateur</h3>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p
                  style={{
                    color: "#ff6b6b",
                    fontSize: "14px",
                    margin: "8px 0",
                  }}
                >
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
            <small
              style={{ color: "#aaa", display: "block", marginTop: "10px" }}
            >
            </small>
          </div>
        )}
      </div>
    </>
  );
}
