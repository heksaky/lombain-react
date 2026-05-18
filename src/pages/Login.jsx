import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data?.user?.isLocalAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8E6F0' }}>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">

        {/* Boy Mascot */}
        <div className="hidden lg:block absolute left-16 bottom-16">
          <svg width="180" height="240" viewBox="0 0 100 140" fill="none">
            <rect x="30" y="60" width="40" height="50" rx="8" fill="#4A2F9E"/>
            <circle cx="50" cy="42" r="20" fill="#FDBCB4"/>
            <path d="M32 35 Q50 20 68 35 Q65 25 50 22 Q35 22 32 35Z" fill="#1A0F3C"/>
            <path d="M46 60 L50 72 L54 60 L52 65 L50 63 L48 65Z" fill="#F5A623"/>
            <path d="M42 60 L50 68 L58 60 L54 60 L50 65 L46 60Z" fill="#F0EEF8"/>
            <path d="M30 65 Q15 50 12 38 L18 36 Q20 46 33 60Z" fill="#4A2F9E"/>
            <path d="M70 65 Q82 72 84 80 L78 82 Q77 74 67 68Z" fill="#4A2F9E"/>
            <rect x="6" y="20" width="16" height="12" rx="2" fill="#F5A623"/>
            <rect x="9" y="32" width="3" height="5" fill="#D4880D"/>
            <rect x="6" y="37" width="9" height="2" rx="1" fill="#D4880D"/>
            <path d="M6 22 Q3 26 6 30" stroke="#D4880D" strokeWidth="1.5" fill="none"/>
            <path d="M22 22 Q25 26 22 30" stroke="#D4880D" strokeWidth="1.5" fill="none"/>
            <rect x="34" y="108" width="12" height="22" rx="4" fill="#5C4A8A"/>
            <rect x="54" y="108" width="12" height="22" rx="4" fill="#5C4A8A"/>
            <rect x="32" y="127" width="16" height="7" rx="3" fill="#1A0F3C"/>
            <rect x="52" y="127" width="16" height="7" rx="3" fill="#1A0F3C"/>
            <path d="M44 46 Q50 52 56 46" stroke="#C47B6A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="44" cy="40" r="2.5" fill="#2D1B69"/>
            <circle cx="56" cy="40" r="2.5" fill="#2D1B69"/>
            <circle cx="45" cy="39" r="1" fill="white"/>
            <circle cx="57" cy="39" r="1" fill="white"/>
          </svg>
        </div>

        {/* Girl Mascot */}
        <div className="hidden lg:block absolute right-16 bottom-16">
          <svg width="180" height="240" viewBox="0 0 100 140" fill="none">
            <path d="M30 95 Q30 120 34 130 L66 130 Q70 120 70 95Z" fill="#9B8BB8"/>
            <rect x="30" y="60" width="40" height="38" rx="8" fill="#4A2F9E"/>
            <circle cx="50" cy="42" r="20" fill="#FDBCB4"/>
            <path d="M30 40 Q32 22 50 20 Q68 22 70 40 Q68 28 50 26 Q32 28 30 40Z" fill="#1A0F3C"/>
            <rect x="30" y="35" width="6" height="30" rx="3" fill="#1A0F3C"/>
            <rect x="64" y="35" width="6" height="30" rx="3" fill="#1A0F3C"/>
            <path d="M42 60 L50 68 L58 60 L54 60 L50 65 L46 60Z" fill="#F0EEF8"/>
            <path d="M70 68 Q85 65 87 75 L80 78 Q79 72 68 73Z" fill="#4A2F9E"/>
            <rect x="80" y="55" width="16" height="22" rx="3" fill="#7B5DC8"/>
            <rect x="82" y="57" width="12" height="18" rx="2" fill="#C8E6FA"/>
            <path d="M30 68 Q18 75 17 85 L23 87 Q24 79 33 74Z" fill="#4A2F9E"/>
            <rect x="34" y="128" width="12" height="8" rx="2" fill="white"/>
            <rect x="54" y="128" width="12" height="8" rx="2" fill="white"/>
            <rect x="32" y="133" width="16" height="6" rx="3" fill="#1A0F3C"/>
            <rect x="52" y="133" width="16" height="6" rx="3" fill="#1A0F3C"/>
            <path d="M44 46 Q50 52 56 46" stroke="#C47B6A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="44" cy="40" r="2.5" fill="#2D1B69"/>
            <circle cx="56" cy="40" r="2.5" fill="#2D1B69"/>
            <circle cx="45" cy="39" r="1" fill="white"/>
            <circle cx="57" cy="39" r="1" fill="white"/>
          </svg>
        </div>

        {/* Card */}
        <div className="w-full max-w-md z-10">
          {/* Title */}
          <h1 className="text-5xl font-black text-center mb-8" style={{ color: '#2D1B69' }}>
            Login
          </h1>

          {/* Form Card */}
          <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#D4D0E8' }}>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm font-bold text-center"
                style={{ backgroundColor: '#ffe0e0', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" style={{ color: '#2D1B69' }}>
                  Masukan Email / Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email atau Username"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none font-semibold text-sm"
                    style={{ backgroundColor: 'white', color: '#1A0F3C' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="block text-sm font-bold mb-2" style={{ color: '#2D1B69' }}>
                  Masukan Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none font-semibold text-sm"
                    style={{ backgroundColor: 'white', color: '#1A0F3C' }}
                  />
                </div>
              </div>

              {/* Lupa Password */}
              <div className="mb-6">
                <Link to="/forgot-password"
                  className="text-xs font-bold hover:underline"
                  style={{ color: '#2D1B69' }}>
                  Lupa Password
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-black text-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: '#F5A623', color: '#2D1B69' }}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-xs font-semibold mt-4" style={{ color: '#555' }}>
              Belum punya akun?{' '}
              <Link to="/register" className="font-black hover:underline" style={{ color: '#2D1B69' }}>
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm font-semibold" style={{ backgroundColor: '#2D1B69', color: 'rgba(255,255,255,0.6)' }}>
        Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
      </footer>
    </div>
  );
}
