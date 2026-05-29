import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const kategoriArtikel = [
  { id: 'semua', label: 'Semua' },
  { id: 'tips', label: 'Tips & Trik' },
  { id: 'motivasi', label: 'Motivasi' },
  { id: 'panduan', label: 'Panduan' },
  { id: 'berita', label: 'Berita' },
];

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

export default function ArtikelPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [activeKategori, setActiveKategori] = useState('semua');
  const [search, setSearch] = useState('');
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedCard, setClickedCard] = useState(null);

  const T = {
    bg:           isDark ? '#0F0A1E' : '#F2F0FA',
    card:         isDark ? '#1E1340' : 'white',
    cardBorder:   isDark ? '#2D1B69' : '#E0DCF0',
    text:         isDark ? '#E8E0FF' : '#1A0F3C',
    textSub:      isDark ? '#9985CC' : '#888',
    textMuted:    isDark ? '#6B5A99' : '#AAA',
    btnInactive:  isDark ? '#2D1B69' : 'white',
    btnInactiveColor: isDark ? '#C0AEFF' : '#555',
    btnInactiveBorder: isDark ? '#4A2F9E' : '#E0DCF0',
    featuredBg:   isDark ? '#160C35' : '#EEF2FF',
    thumbBg:      isDark ? '#2D1B69' : '#EEF2FF',
    searchBg:     isDark ? '#2D1B69' : '#F2F0FA',
    searchBorder: isDark ? '#4A2F9E' : '#E0DCF0',
    searchText:   isDark ? '#E8E0FF' : '#1A0F3C',
  };

  const badge = isDark ? badgeWarnaDark : badgeWarna;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/artikels', {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => { setArtikelData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCardClick = (id) => {
    setClickedCard(id);
    setTimeout(() => { setClickedCard(null); navigate(`/artikel/${id}`); }, 150);
  };

  const filtered = artikelData.filter(a => {
    const matchKat = activeKategori === 'semua' || a.kategori === activeKategori;
    const matchSearch = a.judul?.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  const artikelUtama = filtered[0];
  const artikelLainnya = filtered.slice(1);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .artikel-card { animation: fadeInUp 0.35s ease both; }
        .artikel-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(45,27,105,0.18) !important; }
        .kategori-btn { transition: all 0.2s cubic-bezier(.34,1.56,.64,1); }
        .kategori-btn:active { transform: scale(0.93); }
      `}</style>

      <main style={{ flex: 1, padding: '24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

        {/* Title + Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: T.text, marginBottom: 4 }}>📰 Artikel</h2>
            <p style={{ fontWeight: 600, fontSize: 13, color: T.textSub }}>Tips, panduan, dan inspirasi untuk para pejuang lomba</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: T.searchBg, border: `2px solid ${T.searchBorder}`, borderRadius: 50, padding: '8px 16px', minWidth: 200 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: 13, color: T.searchText, outline: 'none', fontFamily: 'Nunito, sans-serif' }}/>
          </div>
        </div>

        {/* Kategori */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' }}>
          {kategoriArtikel.map(k => (
            <button key={k.id} onClick={() => setActiveKategori(k.id)} className="kategori-btn"
              style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 50, fontWeight: 800, fontSize: 13,
                backgroundColor: activeKategori === k.id ? '#2D1B69' : T.btnInactive,
                color: activeKategori === k.id ? 'white' : T.btnInactiveColor,
                border: `2px solid ${activeKategori === k.id ? '#2D1B69' : T.btnInactiveBorder}`,
                cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {k.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: T.textMuted }}>Memuat artikel... ⏳</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: T.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>Tidak ada artikel ditemukan
          </div>
        )}

        {/* Artikel Utama */}
        {!loading && artikelUtama && (
          <div className="artikel-card" onClick={() => handleCardClick(artikelUtama.id)}
            style={{ backgroundColor: T.card, borderRadius: 20, overflow: 'hidden', marginBottom: 20, cursor: 'pointer',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(45,27,105,0.1)',
              border: `2px solid ${clickedCard === artikelUtama.id ? '#4A2F9E' : T.cardBorder}`,
              transition: 'all 0.2s', transform: clickedCard === artikelUtama.id ? 'scale(0.98)' : 'scale(1)' }}>
            <div style={{ width: '100%', height: 180, backgroundColor: T.featuredBg, overflow: 'hidden', position: 'relative' }}>
              {artikelUtama.foto ? (
                <img src={`http://127.0.0.1:8000/storage/${artikelUtama.foto}`} alt={artikelUtama.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D1B69 0%, #4A2F9E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
              )}
              <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 50, fontWeight: 900, fontSize: 11, backgroundColor: (badge[artikelUtama.kategori] || { bg: '#EEF2FF' }).bg, color: (badge[artikelUtama.kategori] || { color: '#4A2F9E' }).color }}>
                ✨ Featured
              </span>
            </div>
            <div style={{ padding: '16px 20px 20px' }}>
              {artikelUtama.kategori && (
                <span style={{ padding: '3px 10px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: (badge[artikelUtama.kategori] || { bg: T.featuredBg }).bg, color: (badge[artikelUtama.kategori] || { color: '#4A2F9E' }).color }}>
                  {kategoriArtikel.find(k => k.id === artikelUtama.kategori)?.label || artikelUtama.kategori}
                </span>
              )}
              <h3 style={{ fontWeight: 900, fontSize: 17, color: T.text, margin: '10px 0 8px', lineHeight: 1.4 }}>{artikelUtama.judul}</h3>
              <p style={{ fontWeight: 600, fontSize: 13, color: T.textSub, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {artikelUtama.ringkasan || artikelUtama.konten}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: T.textSub }}>{artikelUtama.penulis || 'Admin LombaIn'}</span>
                <span style={{ color: T.textMuted }}>•</span>
                <span style={{ fontWeight: 600, fontSize: 12, color: T.textMuted }}>
                  {artikelUtama.created_at ? new Date(artikelUtama.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Artikel Lainnya */}
        {!loading && artikelLainnya.length > 0 && (
          <>
            <h3 style={{ fontWeight: 900, fontSize: 15, color: T.text, marginBottom: 14 }}>Artikel Lainnya</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
              {artikelLainnya.map((artikel, i) => (
                <div key={artikel.id} className="artikel-card" onClick={() => handleCardClick(artikel.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, backgroundColor: T.card, borderRadius: 16,
                    border: `2px solid ${clickedCard === artikel.id ? '#4A2F9E' : T.cardBorder}`,
                    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(45,27,105,0.07)',
                    cursor: 'pointer', transition: 'all 0.2s', animationDelay: `${i * 0.06}s`,
                    transform: clickedCard === artikel.id ? 'scale(0.97)' : 'scale(1)' }}>
                  <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: T.thumbBg }}>
                    {artikel.foto ? (
                      <img src={`http://127.0.0.1:8000/storage/${artikel.foto}`} alt={artikel.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D1B69, #4A2F9E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {artikel.kategori && (
                      <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 10, backgroundColor: (badge[artikel.kategori] || { bg: T.thumbBg }).bg, color: (badge[artikel.kategori] || { color: '#4A2F9E' }).color }}>
                        {kategoriArtikel.find(k => k.id === artikel.kategori)?.label || artikel.kategori}
                      </span>
                    )}
                    <h4 style={{ fontWeight: 900, fontSize: 14, color: T.text, margin: '6px 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artikel.judul}</h4>
                    <p style={{ fontWeight: 600, fontSize: 12, color: T.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artikel.ringkasan || artikel.konten}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 11, color: T.textMuted }}>{artikel.penulis || 'Admin'}</span>
                      <span style={{ color: T.textMuted, fontSize: 10 }}>•</span>
                      <span style={{ fontWeight: 600, fontSize: 11, color: T.textMuted }}>
                        {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5" style={{ flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}