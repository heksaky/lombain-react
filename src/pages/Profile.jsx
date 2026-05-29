import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const jenjangList = [
  { value: '', label: 'Pilih Kelas' },
  { value: 'SMA Kelas 10', label: 'Kelas 10' },
  { value: 'SMA Kelas 11', label: 'Kelas 11' },
  { value: 'SMA Kelas 12', label: 'Kelas 12' },
  { value: 'Mahasiswa', label: 'Mahasiswa' },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);

  const T = {
    bg:        isDark ? '#0F0A1E' : '#F2F0FA',
    card:      isDark ? '#1E1340' : 'white',
    leftPanel: isDark ? '#2D1B69' : '#E0DCF0',
    text:      isDark ? '#E8E0FF' : '#1A0F3C',
    textMuted: isDark ? '#9985CC' : '#888',
    fieldBg:   isDark ? '#1A0F3C' : '#2D1B69',
    modalBg:   isDark ? '#1E1340' : 'white',
    inputBorder: isDark ? '#4A2F9E' : '#E0DCF0',
    inputText:   isDark ? '#E8E0FF' : '#1A0F3C',
  };

  const [photoPreview, setPhotoPreview] = useState(user?.photo_url || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', jenis_kelamin: user?.jenis_kelamin || '', tanggal_lahir: user?.tanggal_lahir || '', no_hp: user?.no_hp || '', jenjang: user?.jenjang || '' });
  const [passForm, setPassForm] = useState({ password_lama: '', password: '', password_confirmation: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successPass, setSuccessPass] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async () => {
    setLoadingProfile(true); setSuccessMsg(''); setErrorMsg('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (photoFile) formData.append('photo', photoFile);
      const res = await api.post('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
      setSuccessMsg('Profil berhasil diupdate! ✅');
    } catch {
      try {
        const res = await api.put('/profile', form);
        localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
        setSuccessMsg('Profil berhasil diupdate! ✅');
      } catch (err) { setErrorMsg(err.response?.data?.message || 'Gagal update profil'); }
    } finally { setLoadingProfile(false); }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.password !== passForm.password_confirmation) { setErrorPass('Password baru dan konfirmasi tidak sama!'); return; }
    setLoadingPass(true); setSuccessPass(''); setErrorPass('');
    try {
      await api.put('/profile/password', passForm);
      setSuccessPass('Password berhasil diubah! ✅');
      setPassForm({ password_lama: '', password: '', password_confirmation: '' });
    } catch (err) { setErrorPass(err.response?.data?.message || 'Gagal ganti password'); }
    finally { setLoadingPass(false); }
  };

  const profileFields = [
    { label: 'Nama', key: 'name', type: 'text', placeholder: user?.name || 'Nama Pengguna' },
    { label: 'Bio', key: 'bio', type: 'text', placeholder: 'Tambahkan Bio' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin', type: 'select', options: ['', 'Laki-laki', 'Perempuan'], placeholder: 'Pilih jenis kelamin' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date', placeholder: '' },
    { label: 'No. Handphone', key: 'no_hp', type: 'text', placeholder: 'No. Handphone' },
    { label: 'Email', key: 'email', type: 'email', placeholder: user?.email || '', readOnly: true, value: user?.email || '' },
  ];

  return (
    <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>

      {/* Settings button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, position: 'relative' }}>
        <button onClick={() => setShowSettings(s => !s)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, color: T.text }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
          Pengaturan
        </button>
        {showSettings && (
          <div style={{ position: 'absolute', right: 0, top: 36, backgroundColor: T.modalBg, borderRadius: 14, boxShadow: '0 8px 32px rgba(45,27,105,0.2)', padding: 8, zIndex: 100, minWidth: 180, border: `1px solid ${T.inputBorder}` }}>
            <button onClick={() => { setShowPassModal(true); setShowSettings(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: T.text, borderRadius: 10 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#2D1B69' : '#F2F0FA'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Ganti Password
            </button>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: '#E74C3C', borderRadius: 10 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#2D0000' : '#FFF0F0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar
            </button>
          </div>
        )}
      </div>

      {successMsg && <div style={{ backgroundColor: '#e0ffe0', color: '#27ae60', borderRadius: 12, padding: '10px 16px', marginBottom: 14, fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{successMsg}</div>}
      {errorMsg && <div style={{ backgroundColor: '#ffe0e0', color: '#c0392b', borderRadius: 12, padding: '10px 16px', marginBottom: 14, fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>}

      {/* Profile card */}
      <div style={{ backgroundColor: T.card, borderRadius: 24, boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(45,27,105,0.08)', display: 'flex', overflow: 'hidden', minHeight: 460, transition: 'background 0.3s' }}>

        {/* Left panel */}
        <div style={{ width: 200, flexShrink: 0, backgroundColor: T.leftPanel, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 24px', transition: 'background 0.3s' }}>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 20px rgba(45,27,105,0.2)' }}>
              {photoPreview ? (
                <img src={photoPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <svg width="70" height="70" viewBox="0 0 24 24" fill="#2D1B69"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              )}
            </div>
            <button onClick={() => fileInputRef.current.click()}
              style={{ position: 'absolute', bottom: 4, right: 4, width: 30, height: 30, borderRadius: '50%', backgroundColor: '#2D1B69', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange}/>
          </div>

          <div style={{ backgroundColor: '#F5A623', borderRadius: 12, padding: '8px 14px', marginBottom: 10, width: '100%', textAlign: 'center' }}>
            <p style={{ fontWeight: 900, fontSize: 13, color: '#2D1B69', margin: 0 }}>Halo, {user?.name?.split(' ')[0] || 'Nama Pengguna'}!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: isDark ? '#E8E0FF' : '#2D1B69' }}>{form.jenjang || 'Kelas ?'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#E8E0FF' : '#2D1B69'} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div style={{ width: '80%', height: 1, backgroundColor: isDark ? '#4A2F9E' : '#C4BBE8', marginBottom: 20 }}/>

          <button onClick={handleProfileSubmit} disabled={loadingProfile}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, backgroundColor: '#F5A623', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14, color: '#2D1B69', opacity: loadingProfile ? 0.7 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {loadingProfile ? 'Menyimpan...' : 'Edit profil'}
          </button>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profileFields.map(field => {
            const isReadOnly = field.readOnly;
            const currentValue = field.readOnly ? field.value : form[field.key];
            return (
              <div key={field.key} style={{ display: 'flex', alignItems: 'center', backgroundColor: T.fieldBg, borderRadius: 12, overflow: 'hidden', minHeight: 48 }}>
                <div style={{ padding: '12px 16px', minWidth: 130, flexShrink: 0, fontWeight: 900, fontSize: 14, color: 'white' }}>{field.label}</div>
                <div style={{ flex: 1, backgroundColor: T.fieldBg, padding: '0 16px 0 0' }}>
                  {field.type === 'select' ? (
                    <select value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: form[field.key] ? 'white' : 'rgba(255,255,255,0.45)', outline: 'none', cursor: 'pointer', padding: '12px 0' }}>
                      {field.options.map(opt => <option key={opt} value={opt} style={{ color: '#1A0F3C', backgroundColor: 'white' }}>{opt || field.placeholder}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={currentValue} readOnly={isReadOnly} placeholder={field.placeholder}
                      onChange={isReadOnly ? undefined : e => setForm({ ...form, [field.key]: e.target.value })}
                      style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: currentValue ? 'white' : 'rgba(255,255,255,0.45)', outline: 'none', padding: '12px 0', cursor: isReadOnly ? 'default' : 'text', colorScheme: 'dark' }}/>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Password modal */}
      {showPassModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowPassModal(false); }}>
          <div style={{ backgroundColor: T.modalBg, borderRadius: 24, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 16px 48px rgba(45,27,105,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 900, fontSize: 18, color: isDark ? '#E8E0FF' : '#2D1B69', margin: 0 }}>Ganti Password</h3>
              <button onClick={() => setShowPassModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {successPass && <div style={{ backgroundColor: '#e0ffe0', color: '#27ae60', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{successPass}</div>}
            {errorPass && <div style={{ backgroundColor: '#ffe0e0', color: '#c0392b', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontWeight: 700, fontSize: 13, textAlign: 'center' }}>{errorPass}</div>}
            <form onSubmit={handlePassSubmit}>
              {[{ key: 'password_lama', label: 'Password Lama', placeholder: 'Masukkan password lama' }, { key: 'password', label: 'Password Baru', placeholder: 'Masukkan password baru' }, { key: 'password_confirmation', label: 'Konfirmasi Password', placeholder: 'Ulangi password baru' }].map(field => (
                <div key={field.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: 12, color: isDark ? '#C0AEFF' : '#2D1B69', marginBottom: 6 }}>{field.label}</label>
                  <input type="password" placeholder={field.placeholder} value={passForm[field.key]} onChange={e => setPassForm({ ...passForm, [field.key]: e.target.value })} required
                    style={{ width: '100%', padding: '11px 14px', border: `2px solid ${T.inputBorder}`, borderRadius: 12, fontWeight: 600, fontSize: 14, color: T.inputText, outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box', backgroundColor: isDark ? '#2D1B69' : 'white' }}/>
                </div>
              ))}
              <button type="submit" disabled={loadingPass} style={{ width: '100%', padding: '13px', backgroundColor: '#2D1B69', color: 'white', fontWeight: 900, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', marginTop: 4, opacity: loadingPass ? 0.7 : 1 }}>
                {loadingPass ? 'Menyimpan...' : 'Ganti Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}