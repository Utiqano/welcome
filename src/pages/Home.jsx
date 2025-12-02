// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { translations } from '../i18n'

const languages = ['fr', 'en', 'de']
const flags = { fr: 'FR', en: 'GB', de: 'DE' }

export default function Home() {
  const [lang, setLang] = useState('fr')
  const t = translations[lang]

  const [content, setContent] = useState({
    slogan: t.slogan,
    planning_visites: t.planning,
    horaires_resto: t.resto,
    consignes: t.safety
  })

  const fetchContent = async () => {
    // CORRIGÉ : on prend la première ligne sans .limit(1) + select précis
    const { data, error } = await supabase
      .from('site_content')
      .select('slogan, planning_visites, horaires_resto, consignes')
      .order('id')
      .limit(1)

    if (error) {
      console.error('Erreur:', error)
    } else if (data && data.length > 0) {
      const row = data[0]
      setContent({
        slogan: row.slogan || t.slogan,
        planning_visites: row.planning_visites || t.planning,
        horaires_resto: row.horaires_resto || t.resto,
        consignes: row.consignes || t.safety
      })
    }
  }

  useEffect(() => {
    fetchContent()
    const handle = () => fetchContent()
    window.addEventListener('content-updated', handle)
    return () => window.removeEventListener('content-updated', handle)
  }, [lang])

  return (
    <>
      {/* Sélecteur de langue */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: 'white',
        padding: '10px 15px',
        borderRadius: '50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '10px'
      }}>
        {languages.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              width: '40px',
              height: '40px',
              background: lang === l ? '#1a2b49' : 'transparent',
              color: lang === l ? 'white' : '#1a2b49',
              border: '2px solid #1a2b49',
              borderRadius: '50%',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {flags[l]}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
  <img 
    src="/wkw-logo.png" 
    alt="WKW Automotive Tunisia Logo" 
    style={{
      height: '200px',        // ajuste la taille comme tu veux
      maxWidth: '90%',
      objectFit: 'contain'
    }} 
  />
</div>

      <div style={{ padding: '100px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '48px', color: '#1a2b49', fontWeight: 'bold' }}>
            {t.welcome}
          </h1>
          <p style={{ fontSize: '28px', color: '#555', fontStyle: 'italic', marginTop: '15px' }}>
            {content.slogan}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          <div className="info-card">
            <h3>{t.planningTitle}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#444', lineHeight: '1.7', marginTop: '15px' }}>
              {content.planning_visites}
            </pre>
          </div>

          <div className="info-card">
            <h3>{t.restoTitle}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#444', lineHeight: '1.7', marginTop: '15px' }}>
              {content.horaires_resto}
            </pre>
          </div>

          <div className="info-card">
            <h3>{t.safetyTitle}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#444', lineHeight: '1.7', marginTop: '15px' }}>
              {content.consignes}
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}