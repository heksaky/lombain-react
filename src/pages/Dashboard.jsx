import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const kategoriList = [
  { id: 'semua', label: 'Semua' },
  { id: 'seni', label: 'Seni' },
  { id: 'teknologi', label: 'Teknologi' },
  { id: 'olahraga', label: 'Olahraga' },
  { id: 'sains', label: 'Sains' },
  { id: 'bisnis', label: 'Bisnis' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKategori, setActiveKategori] = useState('semua');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [lombaData, setLombaData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks user dari API
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

  // Fetch bookmarks
  useEffect(() => {
    api.get('/bookmarks')
      .then(res => {
        const ids = res.data.data.map(l => l.id);
        setBookmarks(ids);
      })
      .catch(() => {});
  }, []);

  // Fetch lomba dari API
  // Fetch lomba
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lombas', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        setLombaData(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Toggle bookmark ke API
  const toggleBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/bookmarks/${id}`);
      if (res.data.bookmarked) {
        setBookmarks(prev => [...prev, id]);
      } else {
        setBookmarks(prev => prev.filter(b => b !== id));
      }
    } catch {}
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

  const handleBacaNotif = (notif) => {
    fetch(`http://127.0.0.1:8000/api/notifikasi/${notif.id}/baca`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      setNotifikasi(prev => prev.map(n => n.id === notif.id ? { ...n, dibaca: true } : n));
      if (!notif.dibaca) setBelumDibaca(prev => Math.max(0, prev - 1));
    }).catch(() => {});
  };

  const filtered = lombaData.filter(l => {
    const matchKat = activeKategori === 'semua' || l.kategori === activeKategori;
    const matchSearch = l.nama.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

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
  const tipeWarna = {
    lomba_baru: { border: '#27AE60', dot: '#27AE60' },
    deadline:   { border: '#E74C3C', dot: '#E74C3C' },
    pengumuman: { border: '#4A2F9E', dot: '#4A2F9E' },
    info:       { border: '#AAA',    dot: '#AAA'    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Nunito, sans-serif', backgroundColor: '#F2F0FA' }}>

      {/* OVERLAY NOTIFIKASI */}
      {showNotif && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotif(false)} />
      )}

      {/* ── SIDEBAR PERMANEN ── */}
      <aside style={{
        width: 230,
        minWidth: 230,
        backgroundColor: '#2D1B69',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
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

        {/* Sidebar Nav */}
        <nav style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontWeight: 800, fontSize: 15, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, margin: '0 8px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Beranda
          </a>
          <a onClick={() => { navigate('/bookmark'); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Bookmark
          </a>
          <a onClick={() => { navigate('/kalender'); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Kalender
          </a>

        </nav>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <div
            onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="#"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Beranda
          </a>
          <a onClick={() => navigate('/bookmark')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Bookmark
          </a>
          <a onClick={() => navigate('/kalender')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Kalender
          </a>
          <a onClick={() => navigate('/artikel')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
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

        {/* Footer Profil & Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 14 }}>
          <div onClick={() => navigate('/profile')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 14, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, padding: '8px 16px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Ayo cari Lomba mu" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: '#1A0F3C', outline: 'none', fontFamily: 'inherit' }}/>
        </div>

        <button style={{ position: 'relative', width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{ position: 'absolute', width: 8, height: 8, backgroundColor: '#F5A623', borderRadius: '50%', top: 6, right: 7, border: '2px solid #2D1B69' }}/>
        </button>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '16px 16px 20px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

        {/* Banner */}
        <div style={{ background: 'linear-gradient(120deg, #2D1B69 60%, #4A2F9E 100%)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: 20, marginBottom: 6 }}>
              Halo, <span style={{ color: '#F5A623' }}>{user?.name}!</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 12, maxWidth: 200, lineHeight: 1.5 }}>
              "Setiap hari adalah kesempatan untuk belajar dan menjadi versi terbaik dari dirimu sendiri."
            </p>
          </div>
          <svg width="90" height="110" viewBox="0 0 100 130" fill="none" style={{ flexShrink: 0 }}>
            <rect x="30" y="58" width="40" height="45" rx="8" fill="#7B5DC8"/>
            <circle cx="50" cy="40" r="19" fill="#FDBCB4"/>
            <path d="M30 63 Q16 50 13 38 L19 36 Q21 46 33 58Z" fill="#7B5DC8"/>
            <rect x="6" y="18" width="16" height="12" rx="2" fill="#F5A623"/>
            <rect x="34" y="101" width="12" height="20" rx="4" fill="#5C4A8A"/>
            <rect x="54" y="101" width="12" height="20" rx="4" fill="#5C4A8A"/>
            <path d="M44 44 Q50 50 56 44" stroke="#C47B6A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="44" cy="38" r="2.5" fill="#2D1B69"/>
            <circle cx="56" cy="38" r="2.5" fill="#2D1B69"/>
            <circle cx="45" cy="37" r="1" fill="white"/>
            <circle cx="57" cy="37" r="1" fill="white"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: 'flex-end', marginLeft: 8 }}>
            <div style={{ width: 8, height: 8, backgroundColor: '#F5A623', borderRadius: '50%' }}/>
            <div style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}/>
            <div style={{ width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}/>
          </div>
        </div>

        {/* Categories */}
        <p style={{ fontWeight: 800, fontSize: 11, color: '#4A2F9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Kategori</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, scrollbarWidth: 'none' }}>
          {kategoriList.map(k => (
            <button key={k.id} onClick={() => setActiveKategori(k.id)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 50, fontWeight: 800, fontSize: 13,
                backgroundColor: activeKategori === k.id ? '#2D1B69' : 'white',
                color: activeKategori === k.id ? 'white' : '#555',
                border: `2px solid ${activeKategori === k.id ? '#2D1B69' : '#E0DCF0'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {k.label}
            </button>
          ))}
        </div>

        {/* Lomba List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 900, fontSize: 16 }}>🔥 Terbaru</h3>
          <a href="#" style={{ fontWeight: 800, fontSize: 13, color: '#4A2F9E', textDecoration: 'none' }}>Selengkapnya ›</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: '#AAA' }}>
              Memuat lomba... ⏳
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: '#AAA' }}>
              Tidak ada lomba ditemukan 😕
            </div>
          )}
          {!loading && filtered.map(lomba => (
            <div key={lomba.id}
              onClick={() => navigate(`/lomba/${lomba.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'white', borderRadius: 16, border: '2px solid transparent', boxShadow: '0 2px 12px rgba(45,27,105,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
              <div style={{ width: 60, height: 60, backgroundColor: lomba.warna || '#EEF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontWeight: 900, fontSize: 14, marginBottom: 4, color: '#1A0F3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lomba.nama}</h4>
                <p style={{ fontWeight: 600, fontSize: 12, color: '#555', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lomba.deskripsi}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button onClick={(e) => toggleBookmark(e, lomba.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: bookmarks.includes(lomba.id) ? '#2D1B69' : '#7B5DC8' }}>
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

      <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
        Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
      </footer>
    </div>
  );
}
      {/* ── KONTEN KANAN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* HEADER */}
        <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(45,27,105,0.08)' }}>
          {/* Search */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, padding: '8px 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Cari lomba..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 13, color: '#1A0F3C', outline: 'none', fontFamily: 'inherit' }}/>
          </div>

          {/* Bell Notifikasi */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            <button onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); }}
              style={{ width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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

            {/* Panel Notifikasi */}
            {showNotif && (
              <div onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: 48, right: 0, width: 320, backgroundColor: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(45,27,105,0.18)', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EEF8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>Notifikasi</span>
                    {belumDibaca > 0 && (
                      <span style={{ backgroundColor: '#E74C3C', color: 'white', borderRadius: 50, padding: '2px 8px', fontSize: 11, fontWeight: 900 }}>
                        {belumDibaca} baru
                      </span>
                    )}
                  </div>
                  <button onClick={handleBacaSemua}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4A2F9E' }}>
                    Baca Semua
                  </button>
                </div>
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifikasi.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: '#AAA', fontWeight: 700 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                      Tidak ada notifikasi
                    </div>
                  ) : notifikasi.map(notif => {
                    const warna = tipeWarna[notif.tipe] || tipeWarna.info;
                    return (
                      <div key={notif.id}
                        onClick={() => handleBacaNotif(notif)}
                        style={{ padding: '12px 18px', borderBottom: '1px solid #F8F7FC', cursor: 'pointer', backgroundColor: notif.dibaca ? 'white' : '#F5F3FF', borderLeft: `3px solid ${notif.dibaca ? 'transparent' : warna.border}`, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F0EEF8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = notif.dibaca ? 'white' : '#F5F3FF'}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: '#2D1B69', flex: 1 }}>{notif.judul}</div>
                          {!notif.dibaca && <div style={{ width: 8, height: 8, backgroundColor: warna.dot, borderRadius: '50%', flexShrink: 0, marginTop: 4 }}/>}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: '#666', lineHeight: 1.5, marginTop: 4 }}>{notif.pesan}</div>
                        <div style={{ fontSize: 11, color: '#AAA', fontWeight: 600, marginTop: 6 }}>
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

        {/* MAIN */}
        <main style={{ flex: 1, padding: '20px 24px', maxWidth: 720, width: '100%' }}>

          {/* Banner */}
          <div style={{ background: 'linear-gradient(120deg, #2D1B69 60%, #4A2F9E 100%)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, overflow: 'hidden' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white', fontWeight: 900, fontSize: 20, marginBottom: 6 }}>
                Halo, <span style={{ color: '#F5A623' }}>{user?.name}!</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 12, maxWidth: 220, lineHeight: 1.5 }}>
                "Setiap hari adalah kesempatan untuk belajar dan menjadi versi terbaik dari dirimu sendiri."
              </p>
            </div>
            <svg width="90" height="110" viewBox="0 0 100 130" fill="none" style={{ flexShrink: 0 }}>
              <rect x="30" y="58" width="40" height="45" rx="8" fill="#7B5DC8"/>
              <circle cx="50" cy="40" r="19" fill="#FDBCB4"/>
              <path d="M30 63 Q16 50 13 38 L19 36 Q21 46 33 58Z" fill="#7B5DC8"/>
              <rect x="6" y="18" width="16" height="12" rx="2" fill="#F5A623"/>
              <rect x="34" y="101" width="12" height="20" rx="4" fill="#5C4A8A"/>
              <rect x="54" y="101" width="12" height="20" rx="4" fill="#5C4A8A"/>
              <path d="M44 44 Q50 50 56 44" stroke="#C47B6A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="44" cy="38" r="2.5" fill="#2D1B69"/>
              <circle cx="56" cy="38" r="2.5" fill="#2D1B69"/>
              <circle cx="45" cy="37" r="1" fill="white"/>
              <circle cx="57" cy="37" r="1" fill="white"/>
            </svg>
          </div>

          {/* Kategori */}
          <p style={{ fontWeight: 800, fontSize: 11, color: '#4A2F9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Kategori</p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, scrollbarWidth: 'none' }}>
            {kategoriList.map(k => (
              <button key={k.id} onClick={() => setActiveKategori(k.id)}
                style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 50, fontWeight: 800, fontSize: 13, backgroundColor: activeKategori === k.id ? '#2D1B69' : 'white', color: activeKategori === k.id ? 'white' : '#555', border: `2px solid ${activeKategori === k.id ? '#2D1B69' : '#E0DCF0'}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                {k.label}
              </button>
            ))}
          </div>

          {/* Lomba List */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 900, fontSize: 16 }}>🔥 Terbaru</h3>
            <a href="#" style={{ fontWeight: 800, fontSize: 13, color: '#4A2F9E', textDecoration: 'none' }}>Selengkapnya ›</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: '#AAA' }}>Memuat lomba... ⏳</div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', fontWeight: 700, color: '#AAA' }}>Tidak ada lomba ditemukan 😕</div>
            )}
            {!loading && filtered.map(lomba => (
              <div key={lomba.id}
                onClick={() => navigate(`/lomba/${lomba.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'white', borderRadius: 16, border: '2px solid transparent', boxShadow: '0 2px 12px rgba(45,27,105,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                <div style={{ width: 60, height: 60, backgroundColor: lomba.warna || '#EEF2FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {lomba.foto_poster ? (
                    <img src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`} alt={lomba.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={lomba.teks_warna || '#4A2F9E'} strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 900, fontSize: 14, marginBottom: 4, color: '#1A0F3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lomba.nama}</h4>
                  <p style={{ fontWeight: 600, fontSize: 12, color: '#555', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lomba.deskripsi}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={(e) => toggleBookmark(e, lomba.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: bookmarks.includes(lomba.id) ? '#2D1B69' : '#7B5DC8' }}>
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

        <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
          Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
        </footer>
      </div>
    </div>
  );
}
