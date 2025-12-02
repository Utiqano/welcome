import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="dashboard">
      <h1>Bienvenue dans le Dashboard Admin</h1>
      <p>Statut : {isLoggedIn ? "Connecté ✓" : "Non connecté"}</p>
      <div style={{ marginTop: "30px" }}>
        <h2>WKW Automotive - Administration</h2>
        <p>Ici vous pouvez gérer les véhicules, clients, commandes, etc.</p>
      </div>
    </div>
  );
}
