import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function Kalender() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [lombas, setLombas] = useState([]);
  const [monthScrollOffset, setMonthScrollOffset] = useState(0);

  // Fetch lomba data from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lombas', {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setLombas(data.data || []))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Build calendar grid
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  // Build grid cells: nulls for empty, numbers for days
  const gridCells = [];
  for (let i = 0; i < firstDay; i++) gridCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridCells.push(d);

  // Get events for a day (match by deadline or tanggal_mulai in lomba data)
  const getEventsForDay = (day) => {
    if (!day) return [];
    return lombas.filter(l => {
      const deadline = l.deadline ? new Date(l.deadline) : null;
      const mulai = l.tanggal_mulai ? new Date(l.tanggal_mulai) : null;
      const checkDate = (d) =>
        d &&
        d.getDate() === day &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear;
      return checkDate(deadline) || checkDate(mulai);
    });
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // Visible months in sidebar (3 at a time)
  const visibleMonths = [];
  for (let i = 0; i < 3; i++) {
    const idx = (monthScrollOffset + i) % 12;
    visibleMonths.push(idx);
  }
  const canScrollDown = monthScrollOffset + 3 < 12;
  const canScrollUp = monthScrollOffset > 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F2F0FA', fontFamily: 'Nunito, sans-serif' }}>

      {/* OVERLAY */}
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
          {/* Kalender aktif */}
          <a style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontWeight: 800, fontSize: 15, backgroundColor: '#F5A623', color: '#2D1B69', borderRadius: 12, margin: '0 8px', textDecoration: 'none', cursor: 'default' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Kalender
          </a>
          {user?.role === 'admin' && (
            <a onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15, color: '#F5A623', textDecoration: 'none', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              Admin Panel
            </a>
          )}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <div
            onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: 8, borderRadius: 12 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: 36, height: 36, backgroundColor: '#F5A623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 15, color: '#2D1B69' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.name}</p>
              <p style={{ fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 14, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(45,27,105,0.08)' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#2D1B69', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 17L5.5 21L7.5 13.5L2 9H9L12 2Z" fill="#F5A623"/></svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-1px', lineHeight: 1 }}>
            <span style={{ color: '#2D1B69' }}>Lomba</span>
            <span style={{ color: '#F5A623' }}>In</span>
          </span>
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#F2F0FA', border: '2px solid #E0DCF0', borderRadius: 50, padding: '8px 16px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Ayo cari Lomba mu"
            style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: '#1A0F3C', outline: 'none', fontFamily: 'inherit' }}/>
        </div>

        <button style={{ position: 'relative', width: 40, height: 40, backgroundColor: '#2D1B69', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{ position: 'absolute', width: 8, height: 8, backgroundColor: '#F5A623', borderRadius: '50%', top: 6, right: 7, border: '2px solid #2D1B69' }}/>
        </button>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '20px 16px 28px' }}>
        {/* Outer card */}
        <div style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, boxShadow: '0 2px 16px rgba(45,27,105,0.08)', display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 400 }}>

          {/* LEFT: Month selector sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: '#E0DCF0', borderRadius: 16, padding: '12px 8px', minWidth: 90, flexShrink: 0 }}>

            {/* Scroll up */}
            {canScrollUp && (
              <button onClick={() => setMonthScrollOffset(o => Math.max(0, o - 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D1B69', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
            )}

            {visibleMonths.map((mIdx) => {
              const isActive = mIdx === selectedMonth;
              return (
                <button key={mIdx}
                  onClick={() => setSelectedMonth(mIdx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    width: '100%', padding: '10px 12px',
                    borderRadius: 12, border: 'none', cursor: 'pointer',
                    backgroundColor: isActive ? '#F5A623' : 'transparent',
                    color: isActive ? '#2D1B69' : '#555',
                    fontWeight: 900, fontSize: 15, fontFamily: 'Nunito, sans-serif',
                    transition: 'all 0.18s',
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {MONTH_SHORT[mIdx]}
                </button>
              );
            })}

            {/* Scroll down */}
            {canScrollDown && (
              <button onClick={() => setMonthScrollOffset(o => Math.min(9, o + 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D1B69', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            )}
          </div>

          {/* CENTER: Calendar grid */}
          <div style={{ flex: 1, backgroundColor: '#2D1B69', borderRadius: 20, padding: '16px 12px' }}>
            {/* Month label */}
            <div style={{ textAlign: 'center', color: 'white', fontWeight: 900, fontSize: 15, marginBottom: 12 }}>
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {DAY_NAMES.map(d => (
                <div key={d} style={{ textAlign: 'center', fontWeight: 800, fontSize: 11, color: 'rgba(255,255,255,0.55)', padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {gridCells.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} />;
                const events = getEventsForDay(day);
                const hasEvent = events.length > 0;
                const isSelected = selectedDate === day;
                const isToday = day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

                return (
                  <button key={day}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: 13,
                      position: 'relative',
                      backgroundColor:
                        isSelected ? '#F5A623'
                        : hasEvent ? '#F5A623'
                        : '#E0DCF0',
                      color:
                        isSelected ? '#2D1B69'
                        : hasEvent ? '#2D1B69'
                        : '#1A0F3C',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end',
                      padding: '5px 6px',
                      fontFamily: 'Nunito, sans-serif',
                      outline: isToday ? '2px solid #F5A623' : 'none',
                      outlineOffset: 1,
                      transition: 'all 0.15s',
                    }}>
                    {day}
                    {hasEvent && !isSelected && (
                      <span style={{
                        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                        width: 5, height: 5, borderRadius: '50%', backgroundColor: '#2D1B69'
                      }}/>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Event detail card */}
          <div style={{ width: 160, flexShrink: 0 }}>
            {selectedDate && selectedEvents.length > 0 ? (
              <div style={{ backgroundColor: '#F5A623', borderRadius: 16, padding: 14, minHeight: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#2D1B69"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{ fontWeight: 900, fontSize: 13, color: '#2D1B69' }}>
                    {selectedDate} {MONTH_NAMES[selectedMonth]}
                  </span>
                </div>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{ marginBottom: 10 }}>
                    <p style={{ fontWeight: 900, fontSize: 13, color: '#1A0F3C', margin: '0 0 2px' }}>{ev.nama}</p>
                    <p style={{ fontWeight: 600, fontSize: 11, color: '#3A2060', margin: '0 0 2px' }}>{ev.kategori}</p>
                    {ev.deadline && (
                      <p style={{ fontWeight: 600, fontSize: 11, color: '#3A2060', margin: '0 0 2px' }}>
                        {new Date(ev.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    {ev.kontak && (
                      <p style={{ fontWeight: 600, fontSize: 11, color: '#3A2060', margin: 0 }}>{ev.kontak}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div style={{ backgroundColor: '#F5A623', borderRadius: 16, padding: 14, minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p style={{ fontWeight: 800, fontSize: 12, color: '#2D1B69', textAlign: 'center', margin: 0 }}>
                  {selectedDate} {MONTH_NAMES[selectedMonth]}
                </p>
                <p style={{ fontWeight: 600, fontSize: 11, color: '#2D1B69', textAlign: 'center', margin: 0 }}>Tidak ada lomba</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#F5A623', borderRadius: 16, padding: 14, minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p style={{ fontWeight: 800, fontSize: 12, color: '#2D1B69', textAlign: 'center', margin: 0 }}>Pilih tanggal</p>
                <p style={{ fontWeight: 600, fontSize: 11, color: '#2D1B69', textAlign: 'center', margin: 0 }}>untuk melihat info lomba</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer style={{ backgroundColor: '#2D1B69', textAlign: 'center', padding: '14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>
        Powered by <span style={{ color: '#F5A623' }}>LombaIn</span>
      </footer>
    </div>
  );
}
