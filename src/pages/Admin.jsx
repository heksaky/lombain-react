import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BASE = 'http://127.0.0.1:8000';

const kategoriOptions = ['sains', 'seni', 'teknologi', 'olahraga', 'bisnis'];
const targetOptions   = ['SMA', 'Mahasiswa', 'Umum'];
const warnaOptions    = [
  { warna: '#EEEEFF', teks: '#E74C3C', label: 'Merah' },
  { warna: '#FFF5E6', teks: '#E67E22', label: 'Oranye' },
  { warna: '#E8F5E9', teks: '#27AE60', label: 'Hijau' },
  { warna: '#EEF2FF', teks: '#4A2F9E', label: 'Ungu' },
  { warna: '#FFF9E6', teks: '#D4880D', label: 'Kuning' },
  { warna: '#FFE8E8', teks: '#C0392B', label: 'Merah Muda' },
];
const kategoriArtikelOptions = ['tips', 'motivasi', 'panduan', 'berita'];

const emptyFormLomba = {
  nama: '', deskripsi: '', kategori: 'sains',
  warna: '#EEF2FF', teks_warna: '#4A2F9E', gratis: true,
  penyelenggara: '', deadline: '', link_daftar: '', target: 'SMA',
};

const emptyFormArtikel = {
  judul: '', ringkasan: '', konten: '', kategori: 'tips', penulis: '',
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab aktif: 'lomba' atau 'artikel'
  const [activeTab, setActiveTab] = useState('lomba');

  // ── STATE LOMBA ──
  const [lombas, setLombas]               = useState([]);
  const [loadingLomba, setLoadingLomba]   = useState(true);
  const [showFormLomba, setShowFormLomba] = useState(false);
  const [editIdLomba, setEditIdLomba]     = useState(null);
  const [formLomba, setFormLomba]         = useState(emptyFormLomba);
  const [posterFile, setPosterFile]       = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [savingLomba, setSavingLomba]     = useState(false);
  const [deleteConfirmLomba, setDeleteConfirmLomba] = useState(null);

  // ── STATE ARTIKEL ──
  const [artikels, setArtikels]               = useState([]);
  const [loadingArtikel, setLoadingArtikel]   = useState(true);
  const [showFormArtikel, setShowFormArtikel] = useState(false);
  const [editIdArtikel, setEditIdArtikel]     = useState(null);
  const [formArtikel, setFormArtikel]         = useState(emptyFormArtikel);
  const [fotoArtikelFile, setFotoArtikelFile] = useState(null);
  const [fotoArtikelPreview, setFotoArtikelPreview] = useState(null);
  const [savingArtikel, setSavingArtikel]     = useState(false);
  const [deleteConfirmArtikel, setDeleteConfirmArtikel] = useState(null);

  // ── NOTIFIKASI ──
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');

  const showSuccess = (msg) => { setSuccessMsg(msg); setErrorMsg(''); setTimeout(() => setSuccessMsg(''), 3000); };
  const showError   = (msg) => { setErrorMsg(msg); setSuccessMsg(''); };

  // ── FETCH LOMBA ──
  const fetchLombas = () => {
    setLoadingLomba(true);
    fetch(`${BASE}/api/lombas`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => { setLombas(data.data || []); setLoadingLomba(false); })
      .catch(() => setLoadingLomba(false));
  };

  // ── FETCH ARTIKEL ──
  const fetchArtikels = () => {
    setLoadingArtikel(true);
    fetch(`${BASE}/api/artikels`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(r => r.json())
      .then(data => { setArtikels(data.data || []); setLoadingArtikel(false); })
      .catch(() => setLoadingArtikel(false));
  };

  useEffect(() => { fetchLombas(); fetchArtikels(); }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  // ══════════════════════════════════
  // HANDLER LOMBA
  // ══════════════════════════════════
  const handleChangeLomba = (e) => {
    const { name, value, type, checked } = e.target;
    setFormLomba(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleWarna = (warna, teks) => setFormLomba(prev => ({ ...prev, warna, teks_warna: teks }));
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };
  const openTambahLomba = () => {
    setEditIdLomba(null); setFormLomba(emptyFormLomba);
    setPosterFile(null); setPosterPreview(null);
    setShowFormLomba(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openEditLomba = (lomba) => {
    setEditIdLomba(lomba.id);
    setFormLomba({
      nama: lomba.nama, deskripsi: lomba.deskripsi, kategori: lomba.kategori,
      warna: lomba.warna || '#EEF2FF', teks_warna: lomba.teks_warna || '#4A2F9E',
      gratis: lomba.gratis, penyelenggara: lomba.penyelenggara || '',
      deadline: lomba.deadline ? lomba.deadline.substring(0, 10) : '',
      link_daftar: lomba.link_daftar || '', target: lomba.target || 'SMA',
    });
    setPosterFile(null);
    setPosterPreview(lomba.foto_poster ? `${BASE}/storage/${lomba.foto_poster}` : null);
    setShowFormLomba(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSubmitLomba = async (e) => {
    e.preventDefault(); setSavingLomba(true);
    try {
      const fd = new FormData();
      Object.entries(formLomba).forEach(([k, v]) => {
        if (k === 'gratis') fd.append(k, v ? '1' : '0');
        else fd.append(k, v);
      });
      if (posterFile) fd.append('foto_poster', posterFile);
      if (editIdLomba) {
        fd.append('_method', 'PUT');
        await api.post(`/admin/lombas/${editIdLomba}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Lomba berhasil diupdate! ✅');
      } else {
        await api.post('/admin/lombas', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Lomba berhasil ditambahkan! ✅');
      }
      setShowFormLomba(false); setEditIdLomba(null); setFormLomba(emptyFormLomba);
      setPosterFile(null); setPosterPreview(null); fetchLombas();
    } catch (err) {
      const errors = err.response?.data?.errors;
      showError(errors ? Object.values(errors)[0][0] : (err.response?.data?.message || 'Terjadi kesalahan'));
    } finally { setSavingLomba(false); }
  };
  const handleDeleteLomba = async (id) => {
    try {
      await api.delete(`/admin/lombas/${id}`);
      setDeleteConfirmLomba(null); showSuccess('Lomba berhasil dihapus! ✅'); fetchLombas();
    } catch { showError('Gagal menghapus lomba'); }
  };

  // ══════════════════════════════════
  // HANDLER ARTIKEL
  // ══════════════════════════════════
  const handleChangeArtikel = (e) => {
    const { name, value } = e.target;
    setFormArtikel(prev => ({ ...prev, [name]: value }));
  };
  const handleFotoArtikelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoArtikelFile(file);
    setFotoArtikelPreview(URL.createObjectURL(file));
  };
  const openTambahArtikel = () => {
    setEditIdArtikel(null); setFormArtikel(emptyFormArtikel);
    setFotoArtikelFile(null); setFotoArtikelPreview(null);
    setShowFormArtikel(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openEditArtikel = (artikel) => {
    setEditIdArtikel(artikel.id);
    setFormArtikel({
      judul: artikel.judul || '', ringkasan: artikel.ringkasan || '',
      konten: artikel.konten || '', kategori: artikel.kategori || 'tips',
      penulis: artikel.penulis || '',
    });
    setFotoArtikelFile(null);
    setFotoArtikelPreview(artikel.foto ? `${BASE}/storage/${artikel.foto}` : null);
    setShowFormArtikel(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSubmitArtikel = async (e) => {
    e.preventDefault(); setSavingArtikel(true);
    try {
      const fd = new FormData();
      Object.entries(formArtikel).forEach(([k, v]) => fd.append(k, v));
      if (fotoArtikelFile) fd.append('foto', fotoArtikelFile);
      if (editIdArtikel) {
        fd.append('_method', 'PUT');
        await api.post(`/artikels/${editIdArtikel}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Artikel berhasil diupdate! ✅');
      } else {
        await api.post('/artikels', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Artikel berhasil ditambahkan! ✅');
      }
      setShowFormArtikel(false); setEditIdArtikel(null); setFormArtikel(emptyFormArtikel);
      setFotoArtikelFile(null); setFotoArtikelPreview(null); fetchArtikels();
    } catch (err) {
      const errors = err.response?.data?.errors;
      showError(errors ? Object.values(errors)[0][0] : (err.response?.data?.message || 'Terjadi kesalahan'));
    } finally { setSavingArtikel(false); }
  };
  const handleDeleteArtikel = async (id) => {
    try {
      await api.delete(`/artikels/${id}`);
      setDeleteConfirmArtikel(null); showSuccess('Artikel berhasil dihapus! ✅'); fetchArtikels();
    } catch { showError('Gagal menghapus artikel'); }
  };

  const badgeWarna = {
    tips:     { bg: '#FFF3E0', color: '#F5A623' },
    motivasi: { bg: '#F3E5F5', color: '#9C27B0' },
    panduan:  { bg: '#E8F5E9', color: '#27AE60' },
    berita:   { bg: '#E3F2FD', color: '#2196F3' },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#2D1B69', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#2D1B69"/>
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px' }}>
            <span style={{ color: 'white' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginLeft: 4 }}>/ Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>{user?.name}</span>
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>

        {/* NOTIFIKASI */}
        {successMsg && (
          <div style={{ backgroundColor: '#e0ffe0', color: '#27ae60', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontWeight: 700, fontSize: 14 }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ backgroundColor: '#ffe0e0', color: '#c0392b', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontWeight: 700, fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, backgroundColor: 'white', borderRadius: 16, padding: 6, boxShadow: '0 2px 12px rgba(45,27,105,0.07)', width: 'fit-content' }}>
          <button onClick={() => { setActiveTab('lomba'); setShowFormLomba(false); setShowFormArtikel(false); }}
            style={{ padding: '10px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: activeTab === 'lomba' ? '#2D1B69' : 'transparent', color: activeTab === 'lomba' ? 'white' : '#888', transition: 'all 0.2s' }}>
            🏆 Kelola Lomba
          </button>
          <button onClick={() => { setActiveTab('artikel'); setShowFormLomba(false); setShowFormArtikel(false); }}
            style={{ padding: '10px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: activeTab === 'artikel' ? '#2D1B69' : 'transparent', color: activeTab === 'artikel' ? 'white' : '#888', transition: 'all 0.2s' }}>
            📰 Kelola Artikel
          </button>
        </div>

        {/* ══════════════════════════════════ */}
        {/* TAB LOMBA */}
        {/* ══════════════════════════════════ */}
        {activeTab === 'lomba' && (
          <>
            {/* FORM LOMBA */}
            {showFormLomba && (
              <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(45,27,105,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>
                    {editIdLomba ? '✏️ Edit Lomba' : '➕ Tambah Lomba Baru'}
                  </h2>
                  <button onClick={() => { setShowFormLomba(false); setEditIdLomba(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', fontSize: 22 }}>✕</button>
                </div>
                <form onSubmit={handleSubmitLomba}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Nama Lomba *</label>
                      <input name="nama" value={formLomba.nama} onChange={handleChangeLomba} required placeholder="Contoh: Olimpiade Sains Nasional" style={inp}/>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Deskripsi *</label>
                      <textarea name="deskripsi" value={formLomba.deskripsi} onChange={handleChangeLomba} required placeholder="Deskripsi lomba..." rows={3} style={{ ...inp, resize: 'vertical' }}/>
                    </div>
                    <div>
                      <label style={lbl}>Kategori *</label>
                      <select name="kategori" value={formLomba.kategori} onChange={handleChangeLomba} style={inp}>
                        {kategoriOptions.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Target Peserta</label>
                      <select name="target" value={formLomba.target} onChange={handleChangeLomba} style={inp}>
                        {targetOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Penyelenggara</label>
                      <input name="penyelenggara" value={formLomba.penyelenggara} onChange={handleChangeLomba} placeholder="Contoh: Kemendikbud" style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Deadline</label>
                      <input name="deadline" type="date" value={formLomba.deadline} onChange={handleChangeLomba} style={inp}/>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Link Pendaftaran</label>
                      <input name="link_daftar" value={formLomba.link_daftar} onChange={handleChangeLomba} placeholder="https://..." style={inp}/>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Foto Poster Lomba</label>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ width: 110, height: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: formLomba.warna, border: '2px dashed #E0DCF0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {posterPreview ? <img src={posterPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                        </div>
                        <div>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, borderRadius: 10, cursor: 'pointer', border: '2px solid #E0DCF0', fontFamily: 'inherit' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            {posterPreview ? 'Ganti Foto' : 'Upload Foto'}
                            <input type="file" accept="image/*" onChange={handlePosterChange} style={{ display: 'none' }}/>
                          </label>
                          <p style={{ fontSize: 11, color: '#AAA', fontWeight: 600, marginTop: 8 }}>
                            JPG, PNG, WEBP. Maks 2MB.
                            {posterPreview && <button type="button" onClick={() => { setPosterFile(null); setPosterPreview(null); }} style={{ marginLeft: 10, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'inherit' }}>✕ Hapus foto</button>}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <label style={lbl}>Biaya:</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[true, false].map(v => (
                          <button key={String(v)} type="button" onClick={() => setFormLomba(prev => ({ ...prev, gratis: v }))}
                            style={{ padding: '8px 20px', borderRadius: 50, fontWeight: 800, fontSize: 13, border: '2px solid', borderColor: formLomba.gratis === v ? '#2D1B69' : '#E0DCF0', backgroundColor: formLomba.gratis === v ? '#2D1B69' : 'white', color: formLomba.gratis === v ? 'white' : '#555', cursor: 'pointer', fontFamily: 'inherit' }}>
                            {v ? 'Gratis' : 'Berbayar'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Warna Kartu</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {warnaOptions.map(w => (
                          <button key={w.warna} type="button" onClick={() => handleWarna(w.warna, w.teks)}
                            style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: w.warna, border: formLomba.warna === w.warna ? '3px solid #2D1B69' : '2px solid #E0DCF0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: w.teks }}>
                            {formLomba.warna === w.warna ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button type="submit" disabled={savingLomba}
                      style={{ flex: 1, padding: '14px', backgroundColor: '#F5A623', color: '#2D1B69', fontWeight: 900, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', opacity: savingLomba ? 0.7 : 1 }}>
                      {savingLomba ? 'Menyimpan...' : editIdLomba ? '💾 Update Lomba' : '➕ Tambah Lomba'}
                    </button>
                    <button type="button" onClick={() => { setShowFormLomba(false); setEditIdLomba(null); }}
                      style={{ padding: '14px 24px', backgroundColor: 'white', color: '#555', fontWeight: 800, fontSize: 15, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* HEADER DAFTAR LOMBA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>📋 Daftar Lomba ({lombas.length})</h2>
              {!showFormLomba && (
                <button onClick={openTambahLomba}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Tambah Lomba
                </button>
              )}
            </div>

            {/* DAFTAR LOMBA */}
            {loadingLomba ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>Memuat data... ⏳</div>
            ) : lombas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>Belum ada lomba.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lombas.map(lomba => (
                  <div key={lomba.id} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(45,27,105,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 60, height: 60, backgroundColor: lomba.warna || '#EEF2FF', borderRadius: 12, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {lomba.foto_poster ? <img src={`${BASE}/storage/${lomba.foto_poster}`} alt={lomba.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={lomba.teks_warna || '#4A2F9E'} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 900, fontSize: 14, color: '#1A0F3C', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lomba.nama}</h4>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#EEF2FF', color: '#4A2F9E' }}>{lomba.kategori}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: lomba.gratis ? '#FFF5E6' : '#F8F8F8', color: lomba.gratis ? '#E67E22' : '#888' }}>{lomba.gratis ? 'Gratis' : 'Berbayar'}</span>
                        {lomba.deadline && <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#FFE8E8', color: '#C0392B' }}>⏰ {new Date(lomba.deadline).toLocaleDateString('id-ID')}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => openEditLomba(lomba)} style={{ padding: '8px 14px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️ Edit</button>
                      <button onClick={() => setDeleteConfirmLomba(lomba.id)} style={{ padding: '8px 14px', backgroundColor: '#FFE8E8', color: '#C0392B', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════ */}
        {/* TAB ARTIKEL */}
        {/* ══════════════════════════════════ */}
        {activeTab === 'artikel' && (
          <>
            {/* FORM ARTIKEL */}
            {showFormArtikel && (
              <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(45,27,105,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>
                    {editIdArtikel ? '✏️ Edit Artikel' : '➕ Tambah Artikel Baru'}
                  </h2>
                  <button onClick={() => { setShowFormArtikel(false); setEditIdArtikel(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', fontSize: 22 }}>✕</button>
                </div>
                <form onSubmit={handleSubmitArtikel}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                    {/* Judul */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Judul Artikel *</label>
                      <input name="judul" value={formArtikel.judul} onChange={handleChangeArtikel} required placeholder="Contoh: 5 Tips Menang Lomba Esai" style={inp}/>
                    </div>

                    {/* Kategori & Penulis */}
                    <div>
                      <label style={lbl}>Kategori *</label>
                      <select name="kategori" value={formArtikel.kategori} onChange={handleChangeArtikel} style={inp}>
                        {kategoriArtikelOptions.map(k => (
                          <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Penulis</label>
                      <input name="penulis" value={formArtikel.penulis} onChange={handleChangeArtikel} placeholder="Nama penulis" style={inp}/>
                    </div>

                    {/* Ringkasan */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Ringkasan</label>
                      <textarea name="ringkasan" value={formArtikel.ringkasan} onChange={handleChangeArtikel} placeholder="Ringkasan singkat artikel..." rows={2} style={{ ...inp, resize: 'vertical' }}/>
                    </div>

                    {/* Konten */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Konten Artikel *</label>
                      <textarea name="konten" value={formArtikel.konten} onChange={handleChangeArtikel} required placeholder="Isi artikel lengkap di sini..." rows={8} style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}/>
                    </div>

                    {/* Foto */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={lbl}>Foto Cover Artikel</label>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ width: 110, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: '#EEF2FF', border: '2px dashed #E0DCF0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {fotoArtikelPreview
                            ? <img src={fotoArtikelPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          }
                        </div>
                        <div>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, borderRadius: 10, cursor: 'pointer', border: '2px solid #E0DCF0', fontFamily: 'inherit' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            {fotoArtikelPreview ? 'Ganti Foto' : 'Upload Foto'}
                            <input type="file" accept="image/*" onChange={handleFotoArtikelChange} style={{ display: 'none' }}/>
                          </label>
                          <p style={{ fontSize: 11, color: '#AAA', fontWeight: 600, marginTop: 8 }}>
                            JPG, PNG, WEBP. Maks 2MB.
                            {fotoArtikelPreview && (
                              <button type="button" onClick={() => { setFotoArtikelFile(null); setFotoArtikelPreview(null); }}
                                style={{ marginLeft: 10, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'inherit' }}>
                                ✕ Hapus foto
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button type="submit" disabled={savingArtikel}
                      style={{ flex: 1, padding: '14px', backgroundColor: '#F5A623', color: '#2D1B69', fontWeight: 900, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', opacity: savingArtikel ? 0.7 : 1 }}>
                      {savingArtikel ? 'Menyimpan...' : editIdArtikel ? '💾 Update Artikel' : '➕ Tambah Artikel'}
                    </button>
                    <button type="button" onClick={() => { setShowFormArtikel(false); setEditIdArtikel(null); }}
                      style={{ padding: '14px 24px', backgroundColor: 'white', color: '#555', fontWeight: 800, fontSize: 15, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* HEADER DAFTAR ARTIKEL */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>📰 Daftar Artikel ({artikels.length})</h2>
              {!showFormArtikel && (
                <button onClick={openTambahArtikel}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Tambah Artikel
                </button>
              )}
            </div>

            {/* DAFTAR ARTIKEL */}
            {loadingArtikel ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>Memuat data... ⏳</div>
            ) : artikels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                Belum ada artikel. Tambahkan yang pertama!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {artikels.map(artikel => (
                  <div key={artikel.id} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(45,27,105,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Thumbnail */}
                    <div style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0, overflow: 'hidden', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {artikel.foto
                        ? <img src={`${BASE}/storage/${artikel.foto}`} alt={artikel.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A2F9E" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      }
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 900, fontSize: 14, color: '#1A0F3C', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artikel.judul}</h4>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {artikel.kategori && (
                          <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: (badgeWarna[artikel.kategori] || { bg: '#EEF2FF' }).bg, color: (badgeWarna[artikel.kategori] || { color: '#4A2F9E' }).color }}>
                            {artikel.kategori}
                          </span>
                        )}
                        {artikel.penulis && <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#F8F8F8', color: '#888' }}>✍️ {artikel.penulis}</span>}
                        <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#F0EEF8', color: '#666' }}>
                          {artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    </div>
                    {/* Aksi */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => openEditArtikel(artikel)} style={{ padding: '8px 14px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️ Edit</button>
                      <button onClick={() => setDeleteConfirmArtikel(artikel.id)} style={{ padding: '8px 14px', backgroundColor: '#FFE8E8', color: '#C0392B', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MODAL HAPUS LOMBA */}
        {deleteConfirmLomba && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontWeight: 900, fontSize: 18, color: '#1A0F3C', marginBottom: 8 }}>Hapus Lomba?</h3>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#888', marginBottom: 24 }}>Data lomba ini akan dihapus permanen.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setDeleteConfirmLomba(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'white', color: '#555', fontWeight: 800, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
                <button onClick={() => handleDeleteLomba(deleteConfirmLomba)} style={{ flex: 1, padding: '12px', backgroundColor: '#C0392B', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Hapus</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL HAPUS ARTIKEL */}
        {deleteConfirmArtikel && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontWeight: 900, fontSize: 18, color: '#1A0F3C', marginBottom: 8 }}>Hapus Artikel?</h3>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#888', marginBottom: 24 }}>Artikel ini akan dihapus permanen.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setDeleteConfirmArtikel(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'white', color: '#555', fontWeight: 800, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
                <button onClick={() => handleDeleteArtikel(deleteConfirmArtikel)} style={{ flex: 1, padding: '12px', backgroundColor: '#C0392B', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Hapus</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

const lbl = { display: 'block', fontWeight: 800, fontSize: 13, color: '#2D1B69', marginBottom: 6 };
const inp = { width: '100%', padding: '10px 14px', border: '2px solid #E0DCF0', borderRadius: 10, fontWeight: 600, fontSize: 14, color: '#1A0F3C', outline: 'none', fontFamily: 'Nunito, sans-serif', backgroundColor: 'white', boxSizing: 'border-box' };