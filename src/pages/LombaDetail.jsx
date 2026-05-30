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
        <div style={{ fontSize: 48, marginBottom: 16 }}></div>
        <p style={{ fontWeight: 700, color: T.textMuted }}>Lomba tidak ditemukan</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>Kembali</button>
      </div>
    </div>
  );

  const timelineList = parseTimeline(lomba.timeline);
  const persyaratanList = parsePersyaratan(lomba.persyaratan);

  return (
  <main
    style={{
      flex: 1,
      padding: '30px',
      backgroundColor: T.bg,
      minHeight: '100vh',
    }}
  >
    <div
      style={{
        backgroundColor: T.card,
        borderRadius: 24,
        padding: 32,
        width: '100%',
        minHeight: '80vh',
        boxShadow: isDark
          ? '0 2px 16px rgba(0,0,0,0.4)'
          : '0 2px 16px rgba(45,27,105,0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 32,
          height: '100%',
        }}
      >
        {/* Poster */}
        <div
          style={{
            width: 320,
            minHeight: 450,
            backgroundColor: '#F5A623',
            borderRadius: 24,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {lomba.foto_poster ? (
            <img
              src={`http://127.0.0.1:8000/storage/${lomba.foto_poster}`}
              alt={lomba.nama}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                color: '#2D1B69',
                fontWeight: 900,
                fontSize: 20,
              }}
            >
              Poster Lomba
            </div>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#2D1B69',
              marginBottom: 12,
              lineHeight: 1.1,
            }}
          >
            {lomba.nama}
          </h1>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {lomba.kategori && (
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: '#EEF2FF',
                  color: '#4A2F9E',
                  fontWeight: 700,
                }}
              >
                {lomba.kategori}
              </span>
            )}

            <span
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                background: lomba.gratis ? '#F5A623' : '#2D1B69',
                color: lomba.gratis ? '#2D1B69' : 'white',
                fontWeight: 700,
              }}
            >
              {lomba.gratis ? 'Gratis' : 'Berbayar'}
            </span>

            {lomba.target && (
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: '#E8F5E9',
                  color: '#27AE60',
                  fontWeight: 700,
                }}
              >
                {lomba.target}
              </span>
            )}

            <button
              onClick={toggleBookmark}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: bookmarked ? '#2D1B69' : '#EEF2FF',
                color: bookmarked ? 'white' : '#4A2F9E',
                fontWeight: 700,
              }}
            >
              {bookmarked ? 'Tersimpan' : 'Simpan'}
            </button>
          </div>

          <p
            style={{
              color: T.textSub,
              lineHeight: 1.8,
              textAlign: 'justify',
              marginBottom: 30,
            }}
          >
            {lomba.deskripsi}
          </p>
          <div
            style={{
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {lomba.penyelenggara && (
              <div>
                <strong>Penyelenggara:</strong> {lomba.penyelenggara}
              </div>
            )}

            {lomba.deadline && (
              <div>
                <strong>Deadline:</strong>{' '}
                {new Date(lomba.deadline).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 40,
              flex: 1,
            }}
          >
            {/* Persyaratan */}
            <div>
              <h2
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: '#2D1B69',
                  marginBottom: 16,
                }}
              >
                Persyaratan
              </h2>

              <ul
                style={{
                  paddingLeft: 22,
                  lineHeight: 1.9,
                  color: T.textSub,
                }}
              >
                {persyaratanList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div>
              <h2
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: '#2D1B69',
                  marginBottom: 16,
                }}
              >
                Timeline
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {timelineList.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        color: T.text,
                        fontWeight: 700,
                      }}
                    >
                      {item.kegiatan}
                    </span>

                    <span
                      style={{
                        color: '#2D1B69',
                        fontWeight: 700,
                      }}
                    >
                      {item.tanggal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {lomba.link_daftar && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 40,
              }}
            >
              <a
                href={lomba.link_daftar}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#F5A623',
                  color: '#2D1B69',
                  textDecoration: 'none',
                  padding: '18px 60px',
                  borderRadius: 14,
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                Daftar
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
);
}