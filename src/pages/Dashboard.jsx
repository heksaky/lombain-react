import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import ilustrasiKiri from '../assets/wanita.png';
import ilustrasiKanan from '../assets/priaa.png';

const kategoriList = [
  { id: 'semua', label: 'Semua' },
  { id: 'seni', label: 'Seni' },
  { id: 'teknologi', label: 'Teknologi' },
  { id: 'olahraga', label: 'Olahraga' },
  { id: 'sains', label: 'Sains' },
  { id: 'bisnis', label: 'Bisnis' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  const [activeKategori, setActiveKategori] = useState('semua');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [lombaData, setLombaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedCard, setClickedCard] = useState(null);

  const T = {
    bg:                isDark ? '#0F0A1E' : '#F2F0FA',
    card:              isDark ? '#1E1340' : 'white',
    cardBorder:        isDark ? '#2D1B69' : '#E0DCF0',
    text:              isDark ? '#E8E0FF' : '#1A0F3C',
    textSub:           isDark ? '#9985CC' : '#888',
    textMuted:         isDark ? '#6B5A99' : '#AAA',
    btnInactive:       isDark ? '#2D1B69' : 'white',
    btnInactiveColor:  isDark ? '#C0AEFF' : '#555',
    btnInactiveBorder: isDark ? '#4A2F9E' : '#E0DCF0',
  };

  useEffect(() => {
    api.get('/bookmarks').then(res => setBookmarks(res.data.data.map(l => l.id))).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lombas', { headers: { 'Accept': 'application/json' } })
      .then(r => r.json()).then(d => { setLombaData(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/bookmarks/${id}`);
      if (res.data.bookmarked) setBookmarks(prev => [...prev, id]);
      else setBookmarks(prev => prev.filter(b => b !== id));
    } catch {}
  };

  const handleCardClick = (id) => {
    setClickedCard(id);
    setTimeout(() => { setClickedCard(null); navigate(`/lomba/${id}`); }, 150);
  };

  const filtered = lombaData.filter(l => {
    const matchKat = activeKategori === 'semua' || l.kategori === activeKategori;
    const q = searchParams.get('q') || '';
    const matchSearch = l.nama.toLowerCase().includes(q.toLowerCase());
    return matchKat && matchSearch;
  });

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lomba-card { animation: fadeInUp 0.35s ease both; }
        .lomba-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(45,27,105,0.16) !important; }
        .bookmark-btn:active { transform: scale(0.8); }
        .kategori-btn { transition: all 0.2s cubic-bezier(.34,1.56,.64,1); }
        .kategori-btn:active { transform: scale(0.93); }
      `}</style>

      <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(120deg, #2D1B69 60%, #4A2F9E 100%)',
          borderRadius: 20,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 20,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 160,
        }}>
          <div style={{ flex: 1, zIndex: 2 }}>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              Halo, <span style={{ color: '#F5A623' }}>{user?.name}!</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 13, maxWidth: 380, lineHeight: 1.6 }}>
              "Setiap hari adalah kesempatan untuk belajar dan menjadi versi terbaik dari dirimu sendiri."
            </p>
          </div>

          {/* Ilustrasi Wanita */}
          <img
            src={ilustrasiKiri}
            alt="Ilustrasi Wanita"
            style={{ position: 'absolute', right: 180, bottom: 0, height: 122, width: 'auto', objectFit: 'contain', zIndex: 1 }}
          />

          {/* Ilustrasi Pria */}
          <img
            src={ilustrasiKanan}
            alt="Ilustrasi Pria"
            style={{ position: 'absolute', right: 32, bottom: 0, height: 155, width: 'auto', objectFit: 'contain', zIndex: 1 }}
          />
        </div>

        {/* Kategori */}
        <p style={{ fontWeight: 800, fontSize: 11, color: '#4A2F9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Kategori</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, scrollbarWidth: 'none' }}>
          {kategoriList.map(k => (
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

        {/* Lomba list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 900, fontSize: 16, color: T.text }}> Terbaru</h3>
          <a href="#" style={{ fontWeight: 800, fontSize: 13, color: '#7B5DC8', textDecoration: 'none' }}>Selengkapnya ›</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: T.textMuted }}>Memuat lomba... ⏳</div>}
          {!loading && filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: T.textMuted }}>Tidak ada lomba ditemukan 😕</div>}
          {!loading && filtered.map((lomba, i) => (
            <div key={lomba.id}
              className="lomba-card"
              onClick={() => handleCardClick(lomba.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                backgroundColor: T.card, borderRadius: 16,
                border: `2px solid ${clickedCard === lomba.id ? '#4A2F9E' : T.cardBorder}`,
                boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(45,27,105,0.07)',
                cursor: 'pointer', transition: 'all 0.2s',
                animationDelay: `${i * 0.06}s`,
                transform: clickedCard === lomba.id ? 'scale(0.97)' : 'scale(1)',
              }}>
              <div style={{ width: 60, height: 60, backgroundColor: lomba.warna || (isDark ? '#2D1B69' : '#EEF2FF'), borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {lomba.foto_poster ? (
                  <img src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`} alt={lomba.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={lomba.teks_warna || '#4A2F9E'} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontWeight: 900, fontSize: 14, marginBottom: 4, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lomba.nama}</h4>
                <p style={{ fontWeight: 600, fontSize: 12, color: T.textSub, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lomba.deskripsi}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button className="bookmark-btn" onClick={(e) => toggleBookmark(e, lomba.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: bookmarks.includes(lomba.id) ? '#F5A623' : T.textMuted, transition: 'all 0.2s' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={bookmarks.includes(lomba.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <span style={{ padding: '4px 10px', borderRadius: 50, fontWeight: 900, fontSize: 11, backgroundColor: lomba.gratis ? '#F5A623' : '#2D1B69', color: lomba.gratis ? '#2D1B69' : 'white' }}>
                  {lomba.gratis ? 'Gratis' : 'Berbayar'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
