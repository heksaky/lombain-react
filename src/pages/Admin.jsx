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

const emptyForm = {
  nama: '', deskripsi: '', kategori: 'sains',
  warna: '#EEF2FF', teks_warna: '#4A2F9E', gratis: true,
  penyelenggara: '', deadline: '', link_daftar: '', target: 'SMA',
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [lombas, setLombas]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [posterFile, setPosterFile]   = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch lomba dari API publik (sama yang muncul di dashboard)
  const fetchLombas = () => {
    setLoading(true);
    fetch(`${BASE}/api/lombas`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => { setLombas(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchLombas(); }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleWarna = (warna, teks) => setForm(prev => ({ ...prev, warna, teks_warna: teks }));

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const openTambah = () => {
    setEditId(null);
    setForm(emptyForm);
    setPosterFile(null);
    setPosterPreview(null);
    setSuccessMsg(''); setErrorMsg('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (lomba) => {
    setEditId(lomba.id);
    setForm({
      nama:          lomba.nama,
      deskripsi:     lomba.deskripsi,
      kategori:      lomba.kategori,
      warna:         lomba.warna || '#EEF2FF',
      teks_warna:    lomba.teks_warna || '#4A2F9E',
      gratis:        lomba.gratis,
      penyelenggara: lomba.penyelenggara || '',
      deadline:      lomba.deadline ? lomba.deadline.substring(0, 10) : '',
      link_daftar:   lomba.link_daftar || '',
      target:        lomba.target || 'SMA',
    });
    setPosterFile(null);
    setPosterPreview(lomba.foto_poster ? `${BASE}/storage/${lomba.foto_poster}` : null);
    setSuccessMsg(''); setErrorMsg('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(''); setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('nama',          form.nama);
      fd.append('deskripsi',     form.deskripsi);
      fd.append('kategori',      form.kategori);
      fd.append('warna',         form.warna);
      fd.append('teks_warna',    form.teks_warna);
      fd.append('gratis',        form.gratis ? '1' : '0');
      fd.append('penyelenggara', form.penyelenggara);
      fd.append('deadline',      form.deadline);
      fd.append('link_daftar',   form.link_daftar);
      fd.append('target',        form.target);
      if (posterFile) fd.append('foto_poster', posterFile);

      if (editId) {
        fd.append('_method', 'PUT');
        await api.post(`/admin/lombas/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccessMsg('Lomba berhasil diupdate! ✅');
      } else {
        await api.post('/admin/lombas', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccessMsg('Lomba berhasil ditambahkan! ✅');
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      setPosterFile(null);
      setPosterPreview(null);
      fetchLombas();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setErrorMsg(errors ? Object.values(errors)[0][0] : (err.response?.data?.message || 'Terjadi kesalahan'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/lombas/${id}`);
      setDeleteConfirm(null);
      setSuccessMsg('Lomba berhasil dihapus! ✅');
      fetchLombas();
    } catch {
      setErrorMsg('Gagal menghapus lomba');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#2D1B69', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
        {/* Kiri: Logo */}
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

        {/* Kanan: Info admin + Logout */}
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

        {/* Notifikasi */}
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

        {/* FORM TAMBAH/EDIT */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(45,27,105,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>
                {editId ? '✏️ Edit Lomba' : '➕ Tambah Lomba Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', fontSize: 22 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Nama */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Nama Lomba *</label>
                  <input name="nama" value={form.nama} onChange={handleChange} required
                    placeholder="Contoh: Olimpiade Sains Nasional" style={inp}/>
                </div>

                {/* Deskripsi */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Deskripsi *</label>
                  <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} required
                    placeholder="Deskripsi lomba..." rows={3}
                    style={{ ...inp, resize: 'vertical' }}/>
                </div>

                {/* Kategori */}
                <div>
                  <label style={lbl}>Kategori *</label>
                  <select name="kategori" value={form.kategori} onChange={handleChange} style={inp}>
                    {kategoriOptions.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                  </select>
                </div>

                {/* Target */}
                <div>
                  <label style={lbl}>Target Peserta</label>
                  <select name="target" value={form.target} onChange={handleChange} style={inp}>
                    {targetOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Penyelenggara */}
                <div>
                  <label style={lbl}>Penyelenggara</label>
                  <input name="penyelenggara" value={form.penyelenggara} onChange={handleChange}
                    placeholder="Contoh: Kemendikbud" style={inp}/>
                </div>

                {/* Deadline */}
                <div>
                  <label style={lbl}>Deadline</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={inp}/>
                </div>

                {/* Link Daftar */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Link Pendaftaran</label>
                  <input name="link_daftar" value={form.link_daftar} onChange={handleChange}
                    placeholder="https://..." style={inp}/>
                </div>

                {/* Foto Poster */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Foto Poster Lomba</label>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 110, height: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: form.warna, border: '2px dashed #E0DCF0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {posterPreview
                        ? <img src={posterPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, borderRadius: 10, cursor: 'pointer', border: '2px solid #E0DCF0', fontFamily: 'inherit' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        {posterPreview ? 'Ganti Foto' : 'Upload Foto'}
                        <input type="file" accept="image/*" onChange={handlePosterChange} style={{ display: 'none' }}/>
                      </label>
                      <p style={{ fontSize: 11, color: '#AAA', fontWeight: 600, marginTop: 8 }}>
                        JPG, PNG, WEBP. Maks 2MB.
                        {posterPreview && (
                          <button type="button" onClick={() => { setPosterFile(null); setPosterPreview(null); }}
                            style={{ marginLeft: 10, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'inherit' }}>
                            ✕ Hapus foto
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gratis / Berbayar */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={lbl}>Biaya:</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[true, false].map(v => (
                      <button key={String(v)} type="button"
                        onClick={() => setForm(prev => ({ ...prev, gratis: v }))}
                        style={{ padding: '8px 20px', borderRadius: 50, fontWeight: 800, fontSize: 13, border: '2px solid', borderColor: form.gratis === v ? '#2D1B69' : '#E0DCF0', backgroundColor: form.gratis === v ? '#2D1B69' : 'white', color: form.gratis === v ? 'white' : '#555', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {v ? 'Gratis' : 'Berbayar'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Warna Kartu */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Warna Kartu</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {warnaOptions.map(w => (
                      <button key={w.warna} type="button" onClick={() => handleWarna(w.warna, w.teks)}
                        style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: w.warna, border: form.warna === w.warna ? '3px solid #2D1B69' : '2px solid #E0DCF0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: w.teks }}>
                        {form.warna === w.warna ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: '14px', backgroundColor: '#F5A623', color: '#2D1B69', fontWeight: 900, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Menyimpan...' : editId ? '💾 Update Lomba' : '➕ Tambah Lomba'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                  style={{ padding: '14px 24px', backgroundColor: 'white', color: '#555', fontWeight: 800, fontSize: 15, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* HEADER DAFTAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D1B69' }}>
            📋 Daftar Lomba ({lombas.length})
          </h2>
          {!showForm && (
            <button onClick={openTambah}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Lomba
            </button>
          )}
        </div>

        {/* DAFTAR LOMBA */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>Memuat data... ⏳</div>
        ) : lombas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#AAA', fontWeight: 700 }}>Belum ada lomba. Tambahkan yang pertama!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lombas.map(lomba => (
              <div key={lomba.id} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(45,27,105,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Foto / placeholder */}
                <div style={{ width: 60, height: 60, backgroundColor: lomba.warna || '#EEF2FF', borderRadius: 12, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {lomba.foto_poster
                    ? <img src={`${BASE}/storage/${lomba.foto_poster}`} alt={lomba.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={lomba.teks_warna || '#4A2F9E'} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 900, fontSize: 14, color: '#1A0F3C', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lomba.nama}</h4>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#EEF2FF', color: '#4A2F9E' }}>{lomba.kategori}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: lomba.gratis ? '#FFF5E6' : '#F8F8F8', color: lomba.gratis ? '#E67E22' : '#888' }}>
                      {lomba.gratis ? 'Gratis' : 'Berbayar'}
                    </span>
                    {lomba.target && <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#E8F5E9', color: '#27AE60' }}>{lomba.target}</span>}
                    {lomba.deadline && <span style={{ padding: '2px 8px', borderRadius: 50, fontWeight: 800, fontSize: 11, backgroundColor: '#FFE8E8', color: '#C0392B' }}>⏰ {new Date(lomba.deadline).toLocaleDateString('id-ID')}</span>}
                  </div>
                </div>

                {/* Aksi */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(lomba)}
                    style={{ padding: '8px 14px', backgroundColor: '#EEF2FF', color: '#4A2F9E', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(lomba.id)}
                    style={{ padding: '8px 14px', backgroundColor: '#FFE8E8', color: '#C0392B', fontWeight: 800, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL HAPUS */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontWeight: 900, fontSize: 18, color: '#1A0F3C', marginBottom: 8 }}>Hapus Lomba?</h3>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#888', marginBottom: 24 }}>
                Data lomba ini akan dihapus permanen dan tidak bisa dikembalikan.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setDeleteConfirm(null)}
                  style={{ flex: 1, padding: '12px', backgroundColor: 'white', color: '#555', fontWeight: 800, border: '2px solid #E0DCF0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#C0392B', color: 'white', fontWeight: 800, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Hapus
                </button>
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
