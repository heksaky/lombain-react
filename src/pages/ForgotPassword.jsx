import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = kode OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi kirim email (nanti bisa connect ke API)
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus ke input berikutnya
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Kode berhasil diverifikasi!');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8E6F0' }}>
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">

        {/* Boy Mascot */}
        <div className="hidden lg:block absolute left-16 bottom-16">
          <svg width="180" height="240" viewBox="0 0 100 140" fill="none">
            <rect x="30" y="60" width="40" height="50" rx="8" fill="#4A2F9E"/>
            <circle cx="50" cy="42" r="20" fill="#FDBCB4"/>
            <path d="M32 35 Q50 20 68 35 Q65 25 50 22 Q35 22 32 35Z" fill="#1A0F3C"/>
            <path d="M46 60 L50 72 L54 60 L52 65 L50 63 L48 65Z" fill="#F5A623"/>
            <path d="M30 65 Q15 50 12 38 L18 36 Q20 46 33 60Z" fill="#4A2F9E"/>
            <rect x="6" y="20" width="16" height="12" rx="2" fill="#F5A623"/>
            <rect x="9" y="32" width="3" height="5" fill="#D4880D"/>
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

        <div className="w-full max-w-md z-10">
          {/* Title */}
          <h1 className="text-5xl font-black text-center mb-8">
            <span style={{ color: '#2D1B69' }}>Lupa </span>
            <span style={{ color: '#F5A623' }}>Password</span>
          </h1>

          {/* Form Card */}
          <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#D4D0E8' }}>

            {/* Step 1 - Email */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-2">
                  <p className="font-black text-sm mb-1" style={{ color: '#2D1B69' }}>Pesan</p>
                  <p className="text-sm font-semibold mb-4" style={{ color: '#555' }}>
                    Masukan email anda dan tunggu kode etik dikirim
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2D1B69' }}>
                    Masukan Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none font-semibold text-sm"
                      style={{ backgroundColor: 'white', color: '#1A0F3C' }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Link to="/login" className="text-xs font-bold hover:underline" style={{ color: '#2D1B69' }}>
                    Sudah Memiliki Akun?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-black text-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#F5A623', color: '#2D1B69' }}
                >
                  {loading ? 'Mengirim...' : 'Kirim'}
                </button>
              </form>
            )}

            {/* Step 2 - OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-4" style={{ color: '#2D1B69' }}>
                    Masukan Kode
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-black rounded-xl outline-none border-2 transition-all"
                        style={{
                          backgroundColor: 'white',
                          color: '#2D1B69',
                          borderColor: digit ? '#2D1B69' : '#C8C0E0'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {message && (
                  <div className="mb-4 p-3 rounded-xl text-sm font-bold text-center"
                    style={{ backgroundColor: '#e0ffe0', color: '#27ae60' }}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full py-3 rounded-full font-black text-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#F5A623', color: '#2D1B69' }}
                >
                  {loading ? 'Memverifikasi...' : 'Kirim'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full mt-3 py-2 text-sm font-bold hover:underline"
                  style={{ color: '#2D1B69' }}
                >
                  ← Kembali
                </button>
              </form>
            )}
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
