import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const badgeWarna = {
  tips:      { bg: '#FFF3E0', color: '#F5A623' },
  motivasi:  { bg: '#F3E5F5', color: '#9C27B0' },
  panduan:   { bg: '#E8F5E9', color: '#27AE60' },
  berita:    { bg: '#E3F2FD', color: '#2196F3' },
};

const kategoriLabel = {
  tips: 'Tips & Trik',
  motivasi: 'Motivasi',
  panduan: 'Panduan',
  berita: 'Berita',
};

export default function ArtikelDetailPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [artikel, setArtikel] = useState(null);
  const [artikelTerkait, setArtikelTerkait] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifikasi, setNotifikasi] = useState([]);
  const [belumDibaca, setBelumDibaca] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  // Fetch notifikasi
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/notifikasi', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setNotifikasi(data.data || []);
        setBelumDibaca(data.belum_dibaca || 0);
      })
      .catch(() => {});
  }, []);

  // Fetch detail artikel
  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/artikels/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setArtikel(data.data || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch artikel terkait
  useEffect(() => {
    if (!artikel?.kategori) return;
    fetch(`http://127.0.0.1:8000/api/artikels?kategori=${artikel.kategori}&limit=3`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        const list = (data.data || []).filter(a => a.id !== Number(id));
        setArtikelTerkait(list.slice(0, 3));
      })
      .catch(() => {});
  }, [artikel, id]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleBacaSemua = () => {
    fetch('http://127.0.0.1:8000/api/notifikasi/baca-semua', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      setBelumDibaca(0);
      setNotifikasi(prev => prev.map(n => ({ ...n, dibaca: true })));
    }).catch(() => {});
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Nunito, sans-serif', backgroundColor: '#F2F0FA' }}>

      {showNotif && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotif(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 230, minWidth: 230,
        backgroundColor: '#2D1B69',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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

        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'Beranda', path: '/dashboard', icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/> },
            { label: 'Bookmark', path: '/bookmark', icon: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2.5" fill="none"/> },
            { label: 'Kalender', path: '/kalender', icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2.5"/></> },
          ].map(item => (
            <a key={item.path} onClick={() => navigate(item.path)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <svg width="18" height="18" viewBox="0 0 24 24">{item.icon}</svg>
              {item.label}
            </a>
          ))}

          {/* Artikel — Aktif */}
          <a onClick={() => navigate('/artikel')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Artikel
          </a>

          {user?.role === 'admin' && (
            <a onClick={() => navigate('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: '#F5A623', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              Admin Panel
            </a>
          )}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 14 }}>
          <div onClick={() => navigate('/profile')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 13, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '9px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── KONTEN KANAN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* HEADER */}
        <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(45,27,105,0.08)' }}>
          <button onClick={() => navigate('/artikel')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, fontWeight: 800, fontSize: 13, color: '#4A2F9E', cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Kembali
          </button>

          <div style={{ flex: 1 }} />

          {/* Bell */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            <button onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); }}
              style={{ width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {belumDibaca > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, backgroundColor: '#E74C3C', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                  {belumDibaca}
                </span>
              )}
            </button>
            {showNotif && (
              <div onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: 48, right: 0, width: 300, backgroundColor: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(45,27,105,0.18)', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EEF8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>Notifikasi</span>
                  <button onClick={handleBacaSemua} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4A2F9E' }}>Baca Semua</button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifikasi.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#AAA', fontWeight: 700 }}>Tidak ada notifikasi</div>
                  ) : notifikasi.slice(0, 5).map(notif => (
                    <div key={notif.id} style={{ padding: '12px 18px', borderBottom: '1px solid #F8F7FC', backgroundColor: notif.dibaca ? 'white' : '#F5F3FF' }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#2D1B69' }}>{notif.judul}</div>
                      <div style={{ fontWeight: 600, fontSize: 12, color: '#666', marginTop: 4 }}>{notif.pesan}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: 720, width: '100%' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', fontWeight: 700, color: '#AAA' }}>Memuat artikel... ⏳</div>
          )}

          {!loading && !artikel && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
              <p style={{ fontWeight: 700, color: '#AAA' }}>Artikel tidak ditemukan</p>
              <button onClick={() => navigate('/artikel')}
                style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', border: 'none', borderRadius: 50, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Kembali ke Artikel
              </button>
            </div>
          )}

          {!loading && artikel && (
            <>
              {/* Hero Gambar */}
              {artikel.foto && (
                <div style={{ width: '100%', height: 240, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
                  <img src={`http://127.0.0.1:8000/storage/${artikel.foto}`} alt={artikel.judul}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Badge Kategori */}
              {artikel.kategori && (
                <span style={{ padding: '4px 14px', borderRadius: 50, fontWeight: 900, fontSize: 12, backgroundColor: (badgeWarna[artikel.kategori] || { bg: '#EEF2FF' }).bg, color: (badgeWarna[artikel.kategori] || { color: '#4A2F9E' }).color }}>
                  {kategoriLabel[artikel.kategori] || artikel.kategori}
                </span>
              )}

              {/* Judul */}
              <h1 style={{ fontWeight: 900, fontSize: 24, color: '#1A0F3C', margin: '14px 0 10px', lineHeight: 1.35 }}>
                {artikel.judul}
              </h1>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: '2px solid #F0EEF8' }}>
                <div style={{ width: 32, height: 32, backgroundColor: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A2F9E" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#555' }}>{artikel.penulis || 'Admin LombaIn'}</span>
                <span style={{ color: '#DDD' }}>•</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#AAA' }}>
                  {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
              </div>

              {/* Konten Artikel */}
              <div style={{
                fontWeight: 600, fontSize: 14, color: '#333', lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
              }}>
                {artikel.konten}
              </div>

              {/* Share / Aksi */}
              <div style={{ marginTop: 32, padding: '20px', backgroundColor: '#EEF2FF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#2D1B69' }}>Bagikan artikel ini 🚀</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    style={{ padding: '8px 16px', backgroundColor: '#2D1B69', color: 'white', border: 'none', borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Salin Link
                  </button>
                </div>
              </div>

              {/* Artikel Terkait */}
              {artikelTerkait.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <h3 style={{ fontWeight: 900, fontSize: 16, color: '#1A0F3C', marginBottom: 14 }}>📚 Artikel Terkait</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {artikelTerkait.map(a => (
                      <div key={a.id}
                        onClick={() => navigate(`/artikel/${a.id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, backgroundColor: 'white', borderRadius: 14, cursor: 'pointer', boxShadow: '0 2px 10px rgba(45,27,105,0.06)', border: '2px solid transparent', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                        <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, backgroundColor: '#EEF2FF' }}>
                          {a.foto ? (
                            <img src={`http://127.0.0.1:8000/storage/${a.foto}`} alt={a.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D1B69, #4A2F9E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: 900, fontSize: 13, color: '#1A0F3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.judul}</h4>
                          <p style={{ fontWeight: 600, fontSize: 11, color: '#AAA', marginTop: 4 }}>
                            {a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
          Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
        </footer>
      </div>
    </div>
  );
}