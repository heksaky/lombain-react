import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function LombaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [lomba, setLomba] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const T = {
    bg:        isDark ? '#0F0A1E' : '#F2F0FA',
    card:      isDark ? '#1E1340' : 'white',
    text:      isDark ? '#E8E0FF' : '#1A0F3C',
    textSub:   isDark ? '#9985CC' : '#555',
    textMuted: isDark ? '#6B5A99' : '#AAA',
    thumb:     isDark ? '#2D1B69' : '#EEF2FF',
    badge:     isDark ? '#2D1B69' : '#EEF2FF',
    badgeColor: isDark ? '#C0AEFF' : '#4A2F9E',
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/lombas/${id}`, { headers: { 'Accept': 'application/json' } })
      .then(res => res.json()).then(data => { setLomba(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.get('/bookmarks').then(res => { setBookmarked(res.data.data.map(l => l.id).includes(Number(id))); }).catch(() => {});
  }, [id]);

  const toggleBookmark = async () => {
    try { const res = await api.post(`/bookmarks/${id}`); setBookmarked(res.data.bookmarked); } catch {}
  };

  const parseTimeline = (t) => {
    if (!t) return [];
    return t.split('\n').map(line => { const p = line.split('|'); return { kegiatan: p[0]?.trim() || '', tanggal: p[1]?.trim() || '' }; }).filter(x => x.kegiatan);
  };

  const parsePersyaratan = (p) => p ? p.split('\n').filter(x => x.trim()) : [];

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, minHeight: '100%' }}>
      <div style={{ textAlign: 'center', color: T.textMuted, fontWeight: 700 }}>Memuat... ⏳</div>
    </div>
  );

  if (!lomba) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, minHeight: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ fontWeight: 700, color: T.textMuted }}>Lomba tidak ditemukan</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>Kembali</button>
      </div>
    </div>
  );

  const timelineList = parseTimeline(lomba.timeline);
  const persyaratanList = parsePersyaratan(lomba.persyaratan);

  return (
    <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '8px 16px', backgroundColor: isDark ? '#2D1B69' : '#E0DCF0', color: T.text, fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 50, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'background 0.2s' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        Kembali
      </button>

      <div style={{ backgroundColor: T.card, borderRadius: 24, padding: 28, boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(45,27,105,0.08)', transition: 'background 0.3s' }}>

        {/* Top section */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 170, minHeight: 200, flexShrink: 0, backgroundColor: lomba.warna || T.thumb, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {lomba.foto_poster ? (
              <img src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`} alt={lomba.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 200 }} />
            ) : (
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                <path d="M30 15 H70 V55 Q70 75 50 80 Q30 75 30 55 Z" fill={lomba.teks_warna || '#2D1B69'}/>
                <circle cx="50" cy="68" r="5" fill={lomba.warna || '#F5A623'}/>
                <rect x="44" y="73" width="12" height="10" rx="2" fill={lomba.warna || '#F5A623'}/>
              </svg>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontWeight: 900, fontSize: 24, color: isDark ? '#E8E0FF' : '#2D1B69', marginBottom: 12, lineHeight: 1.2 }}>{lomba.nama}</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {lomba.kategori && <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: T.badge, color: T.badgeColor }}>{lomba.kategori}</span>}
              <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: lomba.gratis ? '#F5A623' : '#2D1B69', color: lomba.gratis ? '#2D1B69' : 'white' }}>{lomba.gratis ? 'Gratis' : 'Berbayar'}</span>
              {lomba.target && <span style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: isDark ? '#0D2E14' : '#E8F5E9', color: '#27AE60' }}>{lomba.target}</span>}
              <button onClick={toggleBookmark} style={{ padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: bookmarked ? '#2D1B69' : (isDark ? '#2D1B69' : '#F2F0FA'), color: bookmarked ? 'white' : T.textMuted, border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                {bookmarked ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
            <p style={{ fontWeight: 600, fontSize: 13, color: T.textSub, lineHeight: 1.75, textAlign: 'justify' }}>{lomba.deskripsi}</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {lomba.penyelenggara && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A2F9E" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  <span style={{ fontWeight: 700, fontSize: 12, color: T.textSub }}><strong style={{ color: isDark ? '#C0AEFF' : '#2D1B69' }}>Penyelenggara:</strong> {lomba.penyelenggara}</span>
                </div>
              )}
              {lomba.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{ fontWeight: 700, fontSize: 12, color: T.textSub }}><strong style={{ color: '#E74C3C' }}>Deadline:</strong> {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {persyaratanList.length > 0 && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 900, fontSize: 20, color: isDark ? '#E8E0FF' : '#2D1B69', marginBottom: 14 }}>Persyaratan</h3>
              <p style={{ fontWeight: 600, fontSize: 13, color: T.textSub, lineHeight: 1.75, textAlign: 'justify' }}>{persyaratanList.join(' ')}</p>
            </div>
          )}
          {timelineList.length > 0 && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 900, fontSize: 20, color: isDark ? '#E8E0FF' : '#2D1B69', marginBottom: 14, textAlign: 'center' }}>Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {timelineList.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: T.text, flex: 1 }}>{t.kegiatan}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#C0AEFF' : '#2D1B69', flexShrink: 0, textAlign: 'right' }}>{t.tanggal}</span>
                  </div>
                ))}
              </div>
              {lomba.link_daftar && (
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <a href={lomba.link_daftar} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 48px', backgroundColor: '#F5A623', color: '#2D1B69', fontWeight: 900, fontSize: 18, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textDecoration: 'none', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' }}>Daftar</a>
                </div>
              )}
            </div>
          )}
          {timelineList.length === 0 && lomba.link_daftar && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <a href={lomba.link_daftar} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 48px', backgroundColor: '#F5A623', color: '#2D1B69', fontWeight: 900, fontSize: 18, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textDecoration: 'none', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' }}>Daftar</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}