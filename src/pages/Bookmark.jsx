import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Bookmark() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [bookmarkedLombas, setBookmarkedLombas] = useState([]);
  const [loading, setLoading] = useState(true);

  const T = {
    bg:         isDark ? '#0F0A1E' : '#F2F0FA',
    card:       isDark ? '#1E1340' : 'white',
    cardBorder: isDark ? '#2D1B69' : '#E0DCF0',
    cardHover:  isDark ? '#4A2F9E' : '#4A2F9E',
    text:       isDark ? '#E8E0FF' : '#1A0F3C',
    textSub:    isDark ? '#9985CC' : '#555',
    textMuted:  isDark ? '#6B5A99' : '#AAA',
    emptyBg:    isDark ? '#1E1340' : 'white',
    badge:      isDark ? '#2D1B69' : '#F2F0FA',
    badgeColor: isDark ? '#C0AEFF' : '#4A2F9E',
  };

  useEffect(() => {
    api.get('/bookmarks')
      .then(res => { setBookmarkedLombas(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const removeBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      await api.post(`/bookmarks/${id}`);
      setBookmarkedLombas(prev => prev.filter(l => l.id !== id));
    } catch {}
  };

  return (
    <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5A623"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 18, color: T.text, margin: 0 }}>Bookmark Saya</h2>
          <p style={{ fontWeight: 600, fontSize: 12, color: T.textMuted, margin: 0 }}>
            {loading ? 'Memuat...' : `${bookmarkedLombas.length} lomba tersimpan`}
          </p>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: T.textMuted }}>Memuat bookmark... ⏳</div>}

      {!loading && bookmarkedLombas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: T.emptyBg, borderRadius: 20, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(45,27,105,0.07)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#4A2F9E' : '#C4BBE8'} strokeWidth="1.5" style={{ marginBottom: 16 }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <h3 style={{ fontWeight: 900, fontSize: 16, color: isDark ? '#E8E0FF' : '#2D1B69', marginBottom: 8 }}>Belum Ada Bookmark</h3>
          <p style={{ fontWeight: 600, fontSize: 13, color: T.textMuted, marginBottom: 20, lineHeight: 1.6 }}>Simpan lomba favoritmu agar mudah ditemukan kembali</p>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 50, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Cari Lomba Sekarang
          </button>
        </div>
      )}

      {!loading && bookmarkedLombas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookmarkedLombas.map(lomba => (
            <div key={lomba.id} onClick={() => navigate(`/lomba/${lomba.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                backgroundColor: T.card, borderRadius: 16,
                border: `2px solid ${T.cardBorder}`,
                boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(45,27,105,0.07)',
                cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.cardHover}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.cardBorder}>
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
                <p style={{ fontWeight: 600, fontSize: 12, color: T.textSub, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{lomba.deskripsi}</p>
                {lomba.kategori && (
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 50, fontWeight: 800, fontSize: 10, backgroundColor: T.badge, color: T.badgeColor, textTransform: 'capitalize' }}>
                    {lomba.kategori}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button onClick={(e) => removeBookmark(e, lomba.id)} title="Hapus bookmark"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#2D1B69', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E53935'}
                  onMouseLeave={e => e.currentTarget.style.color = '#2D1B69'}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
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
      )}
    </main>
  );
}