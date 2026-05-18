import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Bookmark() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedLombas, setBookmarkedLombas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks')
      .then(res => {
        setBookmarkedLombas(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const removeBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      await api.post(`/bookmarks/${id}`);
      setBookmarkedLombas(prev => prev.filter(l => l.id !== id));
    } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 20 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 30,
        width: 220, backgroundColor: '#2D1B69',
        borderRadius: '0 24px 24px 0',
        display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.32s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Sidebar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#2D1B69"/>
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px' }}>
            <span style={{ color: 'white' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a onClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Beranda
          </a>
          {/* Bookmark aktif */}
          <a style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontWeight: 800, fontSize: 15, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, margin: '0 8px', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Bookmark
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Kalender
          </a>
          {user?.role === 'admin' && (
            <a onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: '#F5A623', textDecoration: 'none', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              Admin Panel
            </a>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <div
            onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(45,27,105,0.08)' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#2D1B69', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#F5A623"/></svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px', lineHeight: 1 }}>
            <span style={{ color: '#2D1B69' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
        </button>

        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: '#F2F0FA', cursor: 'pointer', padding: '8px 14px', borderRadius: 50, fontFamily: 'inherit', fontWeight: 800, fontSize: 13, color: '#2D1B69' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          Kembali
        </button>

        <div style={{ flex: 1 }} />

        <button style={{ position: 'relative', width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{ position: 'absolute', width: 8, height: 8, backgroundColor: '#F5A623', borderRadius: '50%', top: 6, right: 7, border: '2px solid #2D1B69' }}/>
        </button>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '20px 16px 28px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5A623"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 18, color: '#1A0F3C', margin: 0 }}>Bookmark Saya</h2>
            <p style={{ fontWeight: 600, fontSize: 12, color: '#888', margin: 0 }}>
              {loading ? 'Memuat...' : `${bookmarkedLombas.length} lomba tersimpan`}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: '#AAA' }}>
            Memuat bookmark... ⏳
          </div>
        )}

        {/* Empty state */}
        {!loading && bookmarkedLombas.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            backgroundColor: 'white', borderRadius: 20,
            boxShadow: '0 2px 12px rgba(45,27,105,0.07)'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4BBE8" strokeWidth="1.5" style={{ marginBottom: 16 }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <h3 style={{ fontWeight: 900, fontSize: 16, color: '#2D1B69', marginBottom: 8 }}>
              Belum Ada Bookmark
            </h3>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#AAA', marginBottom: 20, lineHeight: 1.6 }}>
              Simpan lomba favoritmu agar mudah ditemukan kembali
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cari Lomba Sekarang
            </button>
          </div>
        )}

        {/* Bookmark list */}
        {!loading && bookmarkedLombas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookmarkedLombas.map(lomba => (
              <div key={lomba.id}
                onClick={() => navigate(`/lomba/${lomba.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 16, backgroundColor: 'white', borderRadius: 16,
                  border: '2px solid transparent',
                  boxShadow: '0 2px 12px rgba(45,27,105,0.07)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>

                {/* Icon/Thumbnail */}
                <div style={{
                  width: 60, height: 60,
                  backgroundColor: lomba.warna || '#EEF2FF',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {lomba.foto_poster ? (
                    <img src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`} alt={lomba.nama}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={lomba.teks_warna || '#4A2F9E'} strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 900, fontSize: 14, marginBottom: 4, color: '#1A0F3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lomba.nama}
                  </h4>
                  <p style={{ fontWeight: 600, fontSize: 12, color: '#555', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {lomba.deskripsi}
                  </p>
                  {lomba.kategori && (
                    <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 50, fontWeight: 800, fontSize: 10, backgroundColor: '#F2F0FA', color: '#4A2F9E', textTransform: 'capitalize' }}>
                      {lomba.kategori}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {/* Remove bookmark */}
                  <button onClick={(e) => removeBookmark(e, lomba.id)}
                    title="Hapus bookmark"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#2D1B69' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E53935'}
                    onMouseLeave={e => e.currentTarget.style.color = '#2D1B69'}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                  <span style={{
                    padding: '4px 10px', borderRadius: 50, fontWeight: 900, fontSize: 11,
                    backgroundColor: lomba.gratis ? '#F5A623' : '#2D1B69',
                    color: lomba.gratis ? '#2D1B69' : 'white'
                  }}>
                    {lomba.gratis ? 'Gratis' : 'Berbayar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
        Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
      </footer>
    </div>
  );
}
