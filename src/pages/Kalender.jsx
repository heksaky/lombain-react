import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const DAY_NAMES = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

export default function Kalender() {
  const { isDark } = useTheme();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [lombas, setLombas] = useState([]);
  const [monthScrollOffset, setMonthScrollOffset] = useState(0);

  const T = {
    bg:       isDark ? '#0F0A1E' : '#F2F0FA',
    card:     isDark ? '#1E1340' : 'white',
    sidebar:  isDark ? '#2D1B69' : '#E0DCF0',
    sideBtn:  isDark ? '#1A0F3C' : 'transparent',
    sideBtnColor: isDark ? '#E8E0FF' : '#555',
    text:     isDark ? '#E8E0FF' : '#1A0F3C',
    textMuted: isDark ? '#6B5A99' : '#AAA',
    dayBg:    isDark ? '#C0AEFF' : '#E0DCF0',
    dayColor: isDark ? '#0F0A1E' : '#1A0F3C',
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lombas', { headers: { 'Accept': 'application/json' } })
      .then(res => res.json()).then(data => setLombas(data.data || [])).catch(() => {});
  }, []);

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDay(selectedMonth, selectedYear);

  const gridCells = [];
  for (let i = 0; i < firstDay; i++) gridCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridCells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    return lombas.filter(l => {
      const check = (d) => d && d.getDate() === day && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      return check(l.deadline ? new Date(l.deadline) : null) || check(l.tanggal_mulai ? new Date(l.tanggal_mulai) : null);
    });
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];
  const visibleMonths = [];
  for (let i = 0; i < 3; i++) visibleMonths.push((monthScrollOffset + i) % 12);

  return (
    <main style={{ flex: 1, padding: '20px 24px', backgroundColor: T.bg, transition: 'background 0.3s', minHeight: '100%' }}>
      <div style={{ backgroundColor: T.card, borderRadius: 24, padding: 20, boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(45,27,105,0.08)', display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 400, transition: 'background 0.3s' }}>

        {/* Month selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: T.sidebar, borderRadius: 16, padding: '12px 8px', minWidth: 90, flexShrink: 0, transition: 'background 0.3s' }}>
          {monthScrollOffset > 0 && (
            <button onClick={() => setMonthScrollOffset(o => Math.max(0, o - 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#C0AEFF' : '#2D1B69', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
          )}
          {visibleMonths.map(mIdx => {
            const isActive = mIdx === selectedMonth;
            return (
              <button key={mIdx} onClick={() => setSelectedMonth(mIdx)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', backgroundColor: isActive ? '#F5A623' : T.sideBtn, color: isActive ? '#2D1B69' : T.sideBtnColor, fontWeight: 900, fontSize: 15, fontFamily: 'Nunito, sans-serif', transition: 'all 0.18s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {MONTH_SHORT[mIdx]}
              </button>
            );
          })}
          {monthScrollOffset + 3 < 12 && (
            <button onClick={() => setMonthScrollOffset(o => Math.min(9, o + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#C0AEFF' : '#2D1B69', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          )}
        </div>

        {/* Calendar grid */}
        <div style={{ flex: 1, backgroundColor: '#2D1B69', borderRadius: 20, padding: '16px 12px' }}>
          <div style={{ textAlign: 'center', color: 'white', fontWeight: 900, fontSize: 15, marginBottom: 12 }}>
            {MONTH_NAMES[selectedMonth]} {selectedYear}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {DAY_NAMES.map(d => <div key={d} style={{ textAlign: 'center', fontWeight: 800, fontSize: 11, color: 'rgba(255,255,255,0.55)', padding: '4px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {gridCells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const events = getEventsForDay(day);
              const hasEvent = events.length > 0;
              const isSelected = selectedDate === day;
              const isToday = day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
              return (
                <button key={day} onClick={() => setSelectedDate(isSelected ? null : day)}
                  style={{ aspectRatio: '1', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 13, position: 'relative', fontFamily: 'Nunito, sans-serif',
                    backgroundColor: isSelected || hasEvent ? '#F5A623' : T.dayBg,
                    color: isSelected || hasEvent ? '#2D1B69' : T.dayColor,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '5px 6px',
                    outline: isToday ? '2px solid #F5A623' : 'none', outlineOffset: 1, transition: 'all 0.15s' }}>
                  {day}
                  {hasEvent && !isSelected && <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#2D1B69' }}/>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event detail */}
        <div style={{ width: 160, flexShrink: 0 }}>
          {selectedDate && selectedEvents.length > 0 ? (
            <div style={{ backgroundColor: '#F5A623', borderRadius: 16, padding: 14, minHeight: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2D1B69"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span style={{ fontWeight: 900, fontSize: 13, color: '#2D1B69' }}>{selectedDate} {MONTH_NAMES[selectedMonth]}</span>
              </div>
              {selectedEvents.map(ev => (
                <div key={ev.id} style={{ marginBottom: 10 }}>
                  <p style={{ fontWeight: 900, fontSize: 13, color: '#1A0F3C', margin: '0 0 2px' }}>{ev.nama}</p>
                  <p style={{ fontWeight: 600, fontSize: 11, color: '#3A2060', margin: '0 0 2px' }}>{ev.kategori}</p>
                  {ev.deadline && <p style={{ fontWeight: 600, fontSize: 11, color: '#3A2060', margin: 0 }}>{new Date(ev.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#F5A623', borderRadius: 16, padding: 14, minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p style={{ fontWeight: 800, fontSize: 12, color: '#2D1B69', textAlign: 'center', margin: 0 }}>{selectedDate ? `${selectedDate} ${MONTH_NAMES[selectedMonth]}` : 'Pilih tanggal'}</p>
              <p style={{ fontWeight: 600, fontSize: 11, color: '#2D1B69', textAlign: 'center', margin: 0 }}>{selectedDate ? 'Tidak ada lomba' : 'untuk melihat info lomba'}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}