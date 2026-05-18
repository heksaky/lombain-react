import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LombaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lomba, setLomba] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/lombas/${id}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setLomba(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch bookmark status
  useEffect(() => {
    api.get('/bookmarks')
      .then(res => {
        const ids = res.data.data.map(l => l.id);
        setBookmarked(ids.includes(Number(id)));
      })
      .catch(() => {});
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const res = await api.post(`/bookmarks/${id}`);
      setBookmarked(res.data.bookmarked);
    } catch {}
  };

  // Parse timeline: "Kegiatan|Tanggal\nKegiatan|Tanggal"
  const parseTimeline = (timeline) => {
    if (!timeline) return [];
    return timeline.split('\n').map(line => {
      const parts = line.split('|');
      return { kegiatan: parts[0]?.trim() || '', tanggal: parts[1]?.trim() || '' };
    }).filter(t => t.kegiatan);
  };

  // Parse persyaratan: "1. ...\n2. ..."
  const parsePersyaratan = (persyaratan) => {
    if (!persyaratan) return [];
    return persyaratan.split('\n').filter(p => p.trim());
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#AAA', fontWeight: 700 }}>Memuat... ⏳</div>
      </div>
    );
  }

  if (!lomba) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <p style={{ fontWeight: 700, color: '#AAA' }}>Lomba tidak ditemukan</p>
          <button onClick={() => navigate('/dashboard')}
            style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const timelineList    = parseTimeline(lomba.timeline);
  const persyaratanList = parsePersyaratan(lomba.persyaratan);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>

      {/* OVERLAY sidebar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#2D1B69"/></svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px' }}>
            <span style={{ color: 'white' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a onClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Beranda
          </a>
          <a onClick={() => { navigate('/bookmark'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Bookmark
          </a>
          <a onClick={() => { navigate('/kalender'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Kalender
          </a>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <div onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>U</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Profil</p>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(45,27,105,0.08)' }}>
        {/* Logo — klik buka sidebar */}
        <button onClick={() => setSidebarOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#2D1B69', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#F5A623"/></svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px', lineHeight: 1 }}>
            <span style={{ color: '#2D1B69' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
        </button>

        {/* Search bar */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, padding: '8px 16px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Ayo cari Lomba mu"
            style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: '#1A0F3C', outline: 'none', fontFamily: 'inherit' }}/>
        </div>

        {/* Bell */}
        <button style={{ position: 'relative', width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{ position: 'absolute', width: 8, height: 8, backgroundColor: '#F5A623', borderRadius: '50%', top: 6, right: 7, border: '2px solid #2D1B69' }}/>
        </button>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '20px 16px 32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

        {/* Big card */}
        <div style={{ backgroundColor: 'white', borderRadius: 24, padding: 28, boxShadow: '0 2px 16px rgba(45,27,105,0.08)' }}>

          {/* ── TOP SECTION: thumbnail | judul + deskripsi ── */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>

            {/* Thumbnail kiri */}
            <div style={{
              width: 170, minHeight: 200, flexShrink: 0,
              backgroundColor: lomba.warna || '#EEF2FF',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {lomba.foto_poster ? (
                <img src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`} alt={lomba.nama}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 200 }} />
              ) : (
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                  <path d="M30 15 H70 V55 Q70 75 50 80 Q30 75 30 55 Z" fill={lomba.teks_warna || '#2D1B69'}/>
                  <path d="M30 22 Q15 22 15 38 Q15 52 30 50" stroke={lomba.teks_warna || '#2D1B69'} strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <path d="M70 22 Q85 22 85 38 Q85 52 70 50" stroke={lomba.teks_warna || '#2D1B69'} strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <rect x="44" y="80" width="12" height="10" fill={lomba.teks_warna || '#2D1B69'}/>
                  <rect x="35" y="88" width="30" height="6" rx="3" fill={lomba.teks_warna || '#2D1B69'}/>
                  <circle cx="50" cy="68" r="5" fill={lomba.warna || '#F5A623'}/>
                  <rect x="44" y="73" width="12" height="10" rx="2" fill={lomba.warna || '#F5A623'}/>
                  <circle cx="28" cy="74" r="4.5" fill={lomba.warna || '#F5A623'}/>
                  <rect x="23" y="78" width="10" height="9" rx="2" fill={lomba.warna || '#F5A623'}/>
                  <circle cx="72" cy="74" r="4.5" fill={lomba.warna || '#F5A623'}/>
                  <rect x="67" y="78" width="10" height="9" rx="2" fill={lomba.warna || '#F5A623'}/>
                </svg>
              )}
            </div>

            {/* Kanan: judul + deskripsi */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontWeight: 900, fontSize: 24, color: '#2D1B69', marginBottom: 12, lineHeight: 1.2 }}>
                {lomba.nama}
              </h2>

              {/* Badge row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {lomba.kategori && (
                  <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#EEF2FF', color: '#4A2F9E' }}>
                    {lomba.kategori}
                  </span>
                )}
                <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: lomba.gratis ? '#F5A623' : '#2D1B69', color: lomba.gratis ? '#2D1B69' : 'white' }}>
                  {lomba.gratis ? 'Gratis' : 'Berbayar'}
                </span>
                {lomba.target && (
                  <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#E8F5E9', color: '#27AE60' }}>
                    {lomba.target}
                  </span>
                )}
                {/* Bookmark badge */}
                <button onClick={toggleBookmark}
                  style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: bookmarked ? '#2D1B69' : '#F2F0FA', color: bookmarked ? 'white' : '#888', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  {bookmarked ? 'Tersimpan' : 'Simpan'}
                </button>
              </div>

              {/* Deskripsi */}
              <p style={{ fontWeight: 600, fontSize: 13, color: '#555', lineHeight: 1.75, textAlign: 'justify' }}>
                {lomba.deskripsi}
              </p>

              {/* Penyelenggara & Deadline */}
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lomba.penyelenggara && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A2F9E" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#555' }}>
                      <strong style={{ color: '#2D1B69' }}>Penyelenggara:</strong> {lomba.penyelenggara}
                    </span>
                  </div>
                )}
                {lomba.deadline && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#555' }}>
                      <strong style={{ color: '#E74C3C' }}>Deadline:</strong> {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── BOTTOM SECTION: persyaratan kiri | timeline kanan ── */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Persyaratan — kiri bawah */}
            {persyaratanList.length > 0 && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 900, fontSize: 20, color: '#2D1B69', marginBottom: 14 }}>Persyaratan</h3>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#555', lineHeight: 1.75, textAlign: 'justify' }}>
                  {persyaratanList.join(' ')}
                </p>
              </div>
            )}

            {/* Timeline — kanan bawah */}
            {timelineList.length > 0 && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 900, fontSize: 20, color: '#2D1B69', marginBottom: 14, textAlign: 'center' }}>Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {timelineList.map((t, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#333', flex: 1 }}>{t.kegiatan}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#2D1B69', flexShrink: 0, textAlign: 'right' }}>{t.tanggal}</span>
                    </div>
                  ))}
                </div>

                {/* Tombol Daftar */}
                {lomba.link_daftar && (
                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <a href={lomba.link_daftar} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-block', padding: '14px 48px',
                        backgroundColor: '#F5A623', color: '#2D1B69',
                        fontWeight: 900, fontSize: 18,
                        border: 'none', borderRadius: 14,
                        cursor: 'pointer', fontFamily: 'inherit',
                        textAlign: 'center', textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(245,166,35,0.35)',
                      }}>
                      Daftar
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Jika tidak ada timeline tapi ada link daftar */}
            {timelineList.length === 0 && lomba.link_daftar && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <a href={lomba.link_daftar} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', padding: '14px 48px',
                    backgroundColor: '#F5A623', color: '#2D1B69',
                    fontWeight: 900, fontSize: 18,
                    border: 'none', borderRadius: 14,
                    cursor: 'pointer', fontFamily: 'inherit',
                    textAlign: 'center', textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(245,166,35,0.35)',
                  }}>
                  Daftar
                </a>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
        Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
      </footer>
    </div>
  );
}
