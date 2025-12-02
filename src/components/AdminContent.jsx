// src/components/AdminContent.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../AuthContext";

export default function AdminContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    slogan: "",
    planning_visites: "",
    horaires_resto: "",
    consignes: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data: content, error } = await supabase
      .from("site_content")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(error);
    } else if (content) {
      setData({
        slogan: content.slogan || "",
        planning_visites: content.planning_visites || "",
        horaires_resto: content.horaires_resto || "",
        consignes: content.consignes || "",
      });
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    setLoading(true);

    // VÉRIFIE QUE L'UTILISATEUR EST CONNECTÉ
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("Vous devez être connecté pour sauvegarder");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("site_content").upsert({
      id: 1, // on force toujours la ligne id=1
      slogan: data.slogan,
      planning_visites: data.planning_visites,
      horaires_resto: data.horaires_resto,
      consignes: data.consignes,
      updated_at: new Date(),
    });

    if (error) {
      alert("Erreur : " + error.message);
      console.error(error);
    } else {
      alert("Sauvegardé avec succès !");
      fetchContent();
      window.dispatchEvent(new Event("content-updated"));
    }
    setLoading(false);
  };

  if (!user) return <div>Accès refusé</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{ color: "#1a2b49", marginBottom: "30px", textAlign: "center" }}
      >
        Administration - Contenu du site
      </h1>

      {loading && <p>Chargement...</p>}

      <div className="admin-card">
        <label>Slogan principal</label>
        <input
          value={data.slogan}
          onChange={(e) => setData({ ...data, slogan: e.target.value })}
          placeholder="Votre partenaire automobile de confiance"
        />
      </div>

      <div className="admin-card">
        <label>Planning des visites</label>
        <textarea
          rows="6"
          value={data.planning_visites}
          onChange={(e) =>
            setData({ ...data, planning_visites: e.target.value })
          }
        />
      </div>

      <div className="admin-card">
        <label>Horaires restauration</label>
        <textarea
          rows="5"
          value={data.horaires_resto}
          onChange={(e) => setData({ ...data, horaires_resto: e.target.value })}
        />
      </div>

      <div className="admin-card">
        <label>Consignes de sécurité</label>
        <textarea
          rows="7"
          value={data.consignes}
          onChange={(e) => setData({ ...data, consignes: e.target.value })}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={saveChanges} disabled={loading} className="save-btn">
          {loading ? "Sauvegarde..." : "Sauvegarder toutes les modifications"}
        </button>
      </div>
    </div>
  );
}
