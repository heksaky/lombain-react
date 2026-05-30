import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [notifikasi, setNotifikasi] = useState([]);
  const [belumDibaca, setBelumDibaca] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const T = {
    bg:           isDark ? '#0F0A1E' : '#F2F0FA',
    sidebar:      isDark ? '#1A0F3C' : '#2D1B69',
    header:       isDark ? '#1A0F3C' : 'white',
    headerShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(45,27,105,0.08)',
    text:         isDark ? '#E8E0FF' : '#1A0F3C',
    textSub:      isDark ? '#9985CC' : '#888',
    textMuted:    isDark ? '#6B5A99' : '#AAA',
    searchBg:     isDark ? '#2D1B69' : '#F2F0FA',
    searchBorder: isDark ? '#4A2F9E' : '#E0DCF0',
    searchText:   isDark ? '#E8E0FF' : '#1A0F3C',
    card:         isDark ? '#1E1340' : 'white',
    cardBorder:   isDark ? '#2D1B69' : '#E0DCF0',
    notifBg:      isDark ? '#1E1340' : 'white',
    notifBorder:  isDark ? '#2D1B69' : '#F0EEF8',
    notifUnread:  isDark ? '#2D1B69' : '#F5F3FF',
    notifHover:   isDark ? '#2D1B69' : '#F0EEF8',
    footerBg:     isDark ? '#0A0614' : '#2D1B69',
  };

  const tipeWarna = {
    lomba_baru: { border: '#27AE60', dot: '#27AE60' },
    deadline:   { border: '#E74C3C', dot: '#E74C3C' },
    pengumuman: { border: '#4A2F9E', dot: '#4A2F9E' },
    info:       { border: '#AAA',    dot: '#AAA'    },
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/notifikasi', {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => {
      setNotifikasi(d.data || []);
      setBelumDibaca(d.belum_dibaca || 0);
    }).catch(() => {});
  }, [location.pathname]); // refresh notif tiap pindah halaman

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const handleBacaSemua = () => {
    fetch('http://127.0.0.1:8000/api/notifikasi/baca-semua', {
      method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      setBelumDibaca(0);
      setNotifikasi(prev => prev.map(n => ({ ...n, dibaca: true })));
    }).catch(() => {});
  };

  const handleBacaNotif = (notif) => {
    fetch(`http://127.0.0.1:8000/api/notifikasi/${notif.id}/baca`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      setNotifikasi(prev => prev.map(n => n.id === notif.id ? { ...n, dibaca: true } : n));
      if (!notif.dibaca) setBelumDibaca(prev => Math.max(0, prev - 1));
    }).catch(() => {});
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItem = (icon, label, path) => {
    const active = isActive(path);
    return (
      <a key={path} onClick={() => navigate(path)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
          fontWeight: 800, fontSize: 14, borderRadius: 12, textDecoration: 'none', cursor: 'pointer',
          backgroundColor: active ? '#F5A623' : 'transparent',
          color: active ? '#2D1B69' : 'rgba(255,255,255,0.7)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}>
        {icon}{label}
      </a>
    );
  };

  return (
    <>
      <style>{`
        @keyframes themeSwirl {
          0%   { transform: scale(1) rotate(0deg); }
          50%  { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        .theme-toggle:hover .theme-icon { animation: themeSwirl 0.5s ease; }
        .nav-item-hover:hover { background-color: rgba(255,255,255,0.08) !important; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Nunito, sans-serif', backgroundColor: T.bg, transition: 'background-color 0.3s ease' }}>

        {showNotif && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotif(false)} />}

        {/* ══════════ SIDEBAR ══════════ */}
        <aside style={{
          width: 230, minWidth: 230, backgroundColor: T.sidebar,
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          transition: 'background-color 0.3s ease', zIndex: 30,
        }}>
          {/* Logo */}
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

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItem(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
              'Beranda', '/dashboard'
            )}
            {navItem(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
              'Bookmark', '/bookmark'
            )}
            {navItem(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              'Kalender', '/kalender'
            )}
            {navItem(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>,
              'Artikel', '/artikel'
            )}

            {/* Divider + Toggle Tema */}
            <div style={{ margin: '8px 0 4px', padding: '0 6px' }}>
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
              <button className="theme-toggle" onClick={toggleTheme}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '11px 14px', fontWeight: 800, fontSize: 14,
                  color: 'rgba(255,255,255,0.7)', borderRadius: 12,
                  background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span className="theme-icon" style={{ fontSize: 18, lineHeight: 1 }}>{isDark ? '☀️' : '🌙'}</span>
                {isDark ? 'Mode Terang' : 'Mode Gelap'}
              </button>
            </div>

            {user?.role === 'admin' && (
              <a onClick={() => navigate('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: '#F5A623', borderRadius: 12, textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                Admin Panel
              </a>
            )}
          </nav>

          {/* Profil & Logout */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 14 }}>
            <div onClick={() => navigate('/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', padding: 8, borderRadius: 12, transition: 'background 0.2s' }}
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
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '9px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </aside>

        {/* ══════════ KONTEN KANAN ══════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* HEADER */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 20,
            backgroundColor: T.header, padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: T.headerShadow, transition: 'all 0.3s ease',
          }}>
            {/* Search */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: T.searchBg, border: `2px solid ${T.searchBorder}`, borderRadius: 50, padding: '8px 16px', transition: 'all 0.3s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Cari..." readOnly onClick={() => navigate('/dashboard')}
                style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 13, color: T.searchText, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}/>
            </div>

            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Mode Terang' : 'Mode Gelap'}
              style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: isDark ? '#2D1B69' : '#F2F0FA', border: `2px solid ${isDark ? '#4A2F9E' : '#E0DCF0'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.3s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
            </button>

            {/* Bell */}
            <div style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
              <button onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); }}
                style={{ width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {belumDibaca > 0 && (
                  <span style={{ position: 'absolute', top: -2, right: -2, backgroundColor: '#E74C3C', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                    {belumDibaca}
                  </span>
                )}
              </button>

              {showNotif && (
                <div onClick={e => e.stopPropagation()}
                  style={{ position: 'absolute', top: 48, right: 0, width: 320, backgroundColor: T.notifBg, borderRadius: 16, boxShadow: '0 8px 32px rgba(45,27,105,0.25)', zIndex: 50, overflow: 'hidden', border: `1px solid ${T.cardBorder}` }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.notifBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 900, fontSize: 15, color: T.text }}>Notifikasi</span>
                      {belumDibaca > 0 && <span style={{ backgroundColor: '#E74C3C', color: 'white', borderRadius: 50, padding: '2px 8px', fontSize: 11, fontWeight: 900 }}>{belumDibaca} baru</span>}
                    </div>
                    <button onClick={handleBacaSemua} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#7B5DC8' }}>Baca Semua</button>
                  </div>
                  <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                    {notifikasi.length === 0 ? (
                      <div style={{ padding: 32, textAlign: 'center', color: T.textMuted, fontWeight: 700 }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>Tidak ada notifikasi
                      </div>
                    ) : notifikasi.map(notif => {
                      const warna = tipeWarna[notif.tipe] || tipeWarna.info;
                      return (
                        <div key={notif.id} onClick={() => handleBacaNotif(notif)}
                          style={{ padding: '12px 18px', borderBottom: `1px solid ${T.notifBorder}`, cursor: 'pointer', backgroundColor: notif.dibaca ? T.notifBg : T.notifUnread, borderLeft: `3px solid ${notif.dibaca ? 'transparent' : warna.border}`, transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = T.notifHover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = notif.dibaca ? T.notifBg : T.notifUnread}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ fontWeight: 800, fontSize: 13, color: T.text, flex: 1 }}>{notif.judul}</div>
                            {!notif.dibaca && <div style={{ width: 8, height: 8, backgroundColor: warna.dot, borderRadius: '50%', flexShrink: 0, marginTop: 4 }}/>}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: T.textSub, lineHeight: 1.5, marginTop: 4 }}>{notif.pesan}</div>
                          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginTop: 6 }}>
                            {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease' }}>
            {children}
          </div>

          <footer style={{ backgroundColor: T.footerBg, textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, transition: 'background 0.3s' }}>
            Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
          </footer>
        </div>
      </div>
    </>
  );
}