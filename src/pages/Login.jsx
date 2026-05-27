import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ilustrasiKiri from '../assets/pria.png';
import ilustrasiKanan from '../assets/waita.png';

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

        {/* Boy Illustration */}
        <div className="hidden lg:block absolute left-45 bottom-16">
          <img
           src={ilustrasiKiri}
           alt="Ilustrasi Pria"
           className="w-80 h-auto object-contain"
          />
        </div>

        {/* Girl Illustration */}
        <div className="hidden lg:block absolute right-40 top-20">
          <img
            src={ilustrasiKanan}
            alt="Ilustrasi Wanita"
            className="w-80 h-auto object-contain"
            />
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
