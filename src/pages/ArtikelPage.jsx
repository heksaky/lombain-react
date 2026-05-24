import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const kategoriArtikel = [
  { id: 'semua', label: 'Semua' },
  { id: 'tips', label: 'Tips & Trik' },
  { id: 'motivasi', label: 'Motivasi' },
  { id: 'panduan', label: 'Panduan' },
  { id: 'berita', label: 'Berita' },
];

export default function ArtikelPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeKategori, setActiveKategori] = useState('semua');
  const [search, setSearch] = useState('');
  const [artikelData, setArtikelData] = useState([]);
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

  // Fetch artikel
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/artikels', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setArtikelData(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  const filtered = artikelData.filter(a => {
    const matchKat = activeKategori === 'semua' || a.kategori === activeKategori;
    const matchSearch = a.judul?.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  const artikelUtama = filtered[0];
  const artikelLainnya = filtered.slice(1);

  const tipeWarna = {
    lomba_baru: { border: '#27AE60', dot: '#27AE60' },
    deadline:   { border: '#E74C3C', dot: '#E74C3C' },
    pengumuman: { border: '#4A2F9E', dot: '#4A2F9E' },
    info:       { border: '#AAA',    dot: '#AAA'    },
  };

  const badgeWarna = {
    tips:      { bg: '#FFF3E0', color: '#F5A623' },
    motivasi:  { bg: '#F3E5F5', color: '#9C27B0' },
    panduan:   { bg: '#E8F5E9', color: '#27AE60' },
    berita:    { bg: '#E3F2FD', color: '#2196F3' },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Nunito, sans-serif', backgroundColor: '#F2F0FA' }}>

      {showNotif && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotif(false)} />
      )}

      {/* ── SIDEBAR ── */}
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

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
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

          {/* Artikel — AKTIF */}
          <a
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', fontWeight: 800, fontSize: 14, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
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
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, padding: '8px 16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 13, color: '#1A0F3C', outline: 'none', fontFamily: 'inherit' }}/>
          </div>

          {/* Bell */}
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

            {showNotif && (
              <div onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: 48, right: 0, width: 320, backgroundColor: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(45,27,105,0.18)', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EEF8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>Notifikasi</span>
                    {belumDibaca > 0 && (
                      <span style={{ backgroundColor: '#E74C3C', color: 'white', borderRadius: 50, padding: '2px 8px', fontSize: 11, fontWeight: 900 }}>{belumDibaca} baru</span>
                    )}
                  </div>
                  <button onClick={handleBacaSemua} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4A2F9E' }}>Baca Semua</button>
                </div>
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifikasi.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: '#AAA', fontWeight: 700 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>Tidak ada notifikasi
                    </div>
                  ) : notifikasi.map(notif => {
                    const warna = tipeWarna[notif.tipe] || tipeWarna.info;
                    return (
                      <div key={notif.id}
                        style={{ padding: '12px 18px', borderBottom: '1px solid #F8F7FC', backgroundColor: notif.dibaca ? 'white' : '#F5F3FF', borderLeft: `3px solid ${notif.dibaca ? 'transparent' : warna.border}` }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: '#2D1B69' }}>{notif.judul}</div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: '#666', marginTop: 4 }}>{notif.pesan}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '24px', maxWidth: 760, width: '100%' }}>

          {/* Page Title */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: '#1A0F3C', marginBottom: 4 }}>📰 Artikel</h2>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#888' }}>Tips, panduan, dan inspirasi untuk para pejuang lomba</p>
          </div>

          {/* Kategori */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' }}>
            {kategoriArtikel.map(k => (
              <button key={k.id} onClick={() => setActiveKategori(k.id)}
                style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 50, fontWeight: 800, fontSize: 13, backgroundColor: activeKategori === k.id ? '#2D1B69' : 'white', color: activeKategori === k.id ? 'white' : '#555', border: `2px solid ${activeKategori === k.id ? '#2D1B69' : '#E0DCF0'}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {k.label}
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: '#AAA' }}>Memuat artikel... ⏳</div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', fontWeight: 700, color: '#AAA' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              Tidak ada artikel ditemukan
            </div>
          )}

          {/* Artikel Utama (Featured) */}
          {!loading && artikelUtama && (
            <div
              onClick={() => navigate(`/artikel/${artikelUtama.id}`)}
              style={{ backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 20, cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,27,105,0.1)', border: '2px solid transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
              {/* Gambar featured */}
              <div style={{ width: '100%', height: 180, backgroundColor: '#EEF2FF', overflow: 'hidden', position: 'relative' }}>
                {artikelUtama.foto ? (
                  <img src={`http://127.0.0.1:8000/storage/${artikelUtama.foto}`} alt={artikelUtama.judul}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D1B69 0%, #4A2F9E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                )}
                <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 50, fontWeight: 900, fontSize: 11, backgroundColor: (badgeWarna[artikelUtama.kategori] || { bg: '#EEF2FF' }).bg, color: (badgeWarna[artikelUtama.kategori] || { color: '#4A2F9E' }).color }}>
                  ✨ Featured
                </span>
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                {artikelUtama.kategori && (
                  <span style={{ padding: '3px 10px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: (badgeWarna[artikelUtama.kategori] || { bg: '#EEF2FF' }).bg, color: (badgeWarna[artikelUtama.kategori] || { color: '#4A2F9E' }).color }}>
                    {kategoriArtikel.find(k => k.id === artikelUtama.kategori)?.label || artikelUtama.kategori}
                  </span>
                )}
                <h3 style={{ fontWeight: 900, fontSize: 17, color: '#1A0F3C', margin: '10px 0 8px', lineHeight: 1.4 }}>{artikelUtama.judul}</h3>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#666', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {artikelUtama.ringkasan || artikelUtama.konten}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <div style={{ width: 28, height: 28, backgroundColor: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A2F9E" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#888' }}>{artikelUtama.penulis || 'Admin LombaIn'}</span>
                  <span style={{ fontWeight: 600, fontSize: 12, color: '#CCC' }}>•</span>
                  <span style={{ fontWeight: 600, fontSize: 12, color: '#AAA' }}>
                    {artikelUtama.created_at ? new Date(artikelUtama.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Artikel Lainnya */}
          {!loading && artikelLainnya.length > 0 && (
            <>
              <h3 style={{ fontWeight: 900, fontSize: 15, color: '#1A0F3C', marginBottom: 14 }}>Artikel Lainnya</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
                {artikelLainnya.map(artikel => (
                  <div key={artikel.id}
                    onClick={() => navigate(`/artikel/${artikel.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, backgroundColor: 'white', borderRadius: 16, border: '2px solid transparent', boxShadow: '0 2px 12px rgba(45,27,105,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#4A2F9E'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                    {/* Thumbnail */}
                    <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: '#EEF2FF' }}>
                      {artikel.foto ? (
                        <img src={`http://127.0.0.1:8000/storage/${artikel.foto}`} alt={artikel.judul}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D1B69, #4A2F9E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {artikel.kategori && (
                        <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 10, backgroundColor: (badgeWarna[artikel.kategori] || { bg: '#EEF2FF' }).bg, color: (badgeWarna[artikel.kategori] || { color: '#4A2F9E' }).color }}>
                          {kategoriArtikel.find(k => k.id === artikel.kategori)?.label || artikel.kategori}
                        </span>
                      )}
                      <h4 style={{ fontWeight: 900, fontSize: 14, color: '#1A0F3C', margin: '6px 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {artikel.judul}
                      </h4>
                      <p style={{ fontWeight: 600, fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {artikel.ringkasan || artikel.konten}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 11, color: '#AAA' }}>{artikel.penulis || 'Admin'}</span>
                        <span style={{ color: '#DDD', fontSize: 10 }}>•</span>
                        <span style={{ fontWeight: 600, fontSize: 11, color: '#CCC' }}>
                          {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                        </span>
                      </div>
                    </div>

                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))}
              </div>
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