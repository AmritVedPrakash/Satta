import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, RefreshCw, Calendar } from 'lucide-react';
import Loader from '../components/common/Loader';

// Game columns matching Android Charts.java exactly
const GAME_COLS = [
  { key: 'Disawar',      short: 'DS' },
  { key: 'Delhi Bazaar', short: 'DB' },
  { key: 'Shree Ganesh', short: 'SG' },
  { key: 'Faridabad',    short: 'FBD' },
  { key: 'Ghaziabad',    short: 'GBD' },
  { key: 'Gali',         short: 'GL'  },
];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const Charts = () => {
  const navigate = useNavigate();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear]  = useState(now.getFullYear());
  const [rows, setRows]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const loadChart = async (monthIdx) => {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${String(monthIdx + 1).padStart(2, '0')}-01`;
      const data = await api.get('/Home.asmx/GetAllChartResults', { params: { startDate } });
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setRows([]);
        return;
      }

      // Build a map: day -> { DS, DB, SG, FBD, GBD, GL }
      const map = {};

      parsed.forEach((item) => {
        let dateStr = item.Date || '';
        if (dateStr.includes(' ')) dateStr = dateStr.split(' ')[0];
        const d = new Date(dateStr);
        if (isNaN(d)) return;
        // Filter only selected month
        if (d.getMonth() !== monthIdx) return;

        const day = d.getDate(); // numeric day 1-31
        if (!map[day]) {
          map[day] = { date: day, DS: '', DB: '', SG: '', FBD: '', GBD: '', GL: '' };
        }

        const gname = item.Gamename || item.GameName || '';
        const result = item.Result || item.Results || '**';

        if (gname === 'Disawar')      map[day].DS  = result;
        else if (gname === 'Delhi Bazaar') map[day].DB  = result;
        else if (gname === 'Shree Ganesh') map[day].SG  = result;
        else if (gname === 'Faridabad')    map[day].FBD = result;
        else if (gname === 'Ghaziabad')    map[day].GBD = result;
        else if (gname === 'Gali')         map[day].GL  = result;
      });

      // Fill all days of month (including future/empty ones)
      const daysInMonth = new Date(selectedYear, monthIdx + 1, 0).getDate();
      const allRows = [];
      for (let day = 1; day <= daysInMonth; day++) {
        allRows.push(map[day] || { date: day, DS: '', DB: '', SG: '', FBD: '', GBD: '', GL: '' });
      }

      setRows(allRows);
    } catch (err) {
      console.error('Chart fetch error:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '14px 12px', minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)', margin: 0 }}>
              Chart
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly Results Record</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadChart(selectedMonth)}
          style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Month Selector Bar — matches Android "October | OK" */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
          background: 'white',
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        <Calendar size={18} color="#64748b" />
        <div
          style={{ flex: 1, fontSize: '1rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}
          onClick={() => setShowMonthPicker(!showMonthPicker)}
        >
          {MONTHS[selectedMonth]}
        </div>
        <button
          type="button"
          onClick={() => {
            setShowMonthPicker(false);
            loadChart(selectedMonth);
          }}
          style={{
            background: '#1e3a5f',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '6px 20px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          OK
        </button>

        {/* Month Dropdown */}
        {showMonthPicker && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              zIndex: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              maxHeight: 260,
              overflowY: 'auto',
            }}
          >
            {MONTHS.map((m, i) => (
              <div
                key={m}
                onClick={() => {
                  setSelectedMonth(i);
                  setShowMonthPicker(false);
                }}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontWeight: selectedMonth === i ? 700 : 400,
                  color: selectedMonth === i ? '#1e3a5f' : '#334155',
                  background: selectedMonth === i ? '#f0f4ff' : 'white',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Table */}
      {loading ? (
        <Loader message="Loading chart data..." />
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: '0.9rem' }}>
          No chart records found for {MONTHS[selectedMonth]}.
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              {/* Header: Date | DS | DB | SG | FBD | GBD | GL */}
              <thead>
                <tr style={{ background: '#1a3a2a', color: 'white' }}>
                  <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 800, minWidth: 44 }}>Date</th>
                  {GAME_COLS.map((col) => (
                    <th
                      key={col.key}
                      style={{ padding: '11px 8px', textAlign: 'center', fontWeight: 800, minWidth: 44 }}
                    >
                      {col.short}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, idx) => {
                  const isToday =
                    row.date === now.getDate() &&
                    selectedMonth === now.getMonth();
                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isToday ? '#f0fdf4' : idx % 2 === 0 ? 'white' : '#fafafa',
                      }}
                    >
                      <td
                        style={{
                          padding: '9px 10px',
                          textAlign: 'center',
                          fontWeight: 800,
                          color: '#334155',
                          fontSize: '0.9rem',
                        }}
                      >
                        {row.date}
                      </td>
                      {GAME_COLS.map((col) => {
                        const val = row[col.short] || '';
                        const isEmpty = !val || val === '';
                        return (
                          <td
                            key={col.key}
                            style={{
                              padding: '9px 8px',
                              textAlign: 'center',
                              fontWeight: 700,
                              color: isEmpty ? '#cbd5e1' : '#1a3a2a',
                              fontSize: '0.9rem',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {isEmpty ? '--' : val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Column Legend */}
          <div
            style={{
              padding: '10px 14px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 16px',
            }}
          >
            {GAME_COLS.map((col) => (
              <span key={col.key} style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                <strong style={{ color: '#1a3a2a' }}>{col.short}</strong> = {col.key}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
