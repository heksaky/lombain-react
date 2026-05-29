import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const badgeWarna = {
  tips:     { bg: '#FFF3E0', color: '#F5A623' },
  motivasi: { bg: '#F3E5F5', color: '#9C27B0' },
  panduan:  { bg: '#E8F5E9', color: '#27AE60' },
  berita:   { bg: '#E3F2FD', color: '#2196F3' },
};

const badgeWarnaDark = {
  tips:     { bg: '#3D2800', color: '#F5A623' },
  motivasi: { bg: '#2D1040', color: '#CE93D8' },
  panduan:  { bg: '#0D2E14', color: '#81C784' },
  berita:   { bg: '#0D2040', color: '#90CAF9' },
};

export default function ArtikelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);

  const T = {
    bg:      isDark ? '#0F0A1E' : '#F2F0FA',
    card:    isDark ? '#1E1340' : 'white',
    text:    isDark ? '#E8E0FF' : '#1A0F3C',
    textSub: isDark ? '#9985CC' : '#777',
    body:    isDark ? '#C0AEFF' : '#444',
  };

  const badge = isDark ? badgeWarnaDark : badgeWarna;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/artikels/${id}`)
      .then(res => res.json()).then(data => { setArtikel(data.data || data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg, fontFamily: 'Nunito, sans-serif', minHeight: '100%' }}>
      <span style={{ fontWeight: 700, color: isDark ? '#9985CC' : '#AAA' }}>Memuat artikel... ⏳</span>
    </div>
  );

  if (!artikel) return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: T.bg, fontFamily: 'Nunito, sans-serif', minHeight: '100%' }}>
      <span style={{ fontWeight: 700, color: isDark ? '#9985CC' : '#AAA' }}>Artikel tidak ditemukan 😕</span>
    </div>
  );

  return (
    <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '8px 16px', backgroundColor: isDark ? '#2D1B69' : '#E0DCF0', color: T.text, fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 50, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        Kembali
      </button>

      <div style={{ maxWidth: 900, margin: '0 auto', backgroundColor: T.card, borderRadius: 20, overflow: 'hidden', boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(45,27,105,0.1)', transition: 'background 0.3s' }}>

        {/* Banner */}
        {artikel.foto ? (
          <img src={`http://127.0.0.1:8000/storage/${artikel.foto}`} alt={artikel.judul} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
        ) : (
          <div style={{ height: 320, background: 'linear-gradient(135deg, #2D1B69, #4A2F9E)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        )}

        <div style={{ padding: 32 }}>
          {artikel.kategori && (
            <span style={{ padding: '6px 14px', borderRadius: 50, backgroundColor: (badge[artikel.kategori] || { bg: isDark ? '#2D1B69' : '#EEF2FF' }).bg, color: (badge[artikel.kategori] || { color: '#4A2F9E' }).color, fontWeight: 800, fontSize: 12 }}>
              {artikel.kategori}
            </span>
          )}
          <h1 style={{ fontSize: 34, color: T.text, marginTop: 16, marginBottom: 12, lineHeight: 1.3, fontWeight: 900 }}>{artikel.judul}</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, color: T.textSub, fontSize: 14, fontWeight: 600 }}>
            <span>{artikel.penulis || 'Admin LombaIn'}</span>
            <span>•</span>
            <span>{new Date(artikel.created_at).toLocaleDateString('id-ID')}</span>
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.9, color: T.body, whiteSpace: 'pre-line', fontWeight: 500 }}>
            {artikel.konten}
          </div>
        </div>
      </div>
    </main>
  );
}