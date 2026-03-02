'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function CalendarPage() {
    const { t, locale } = useLanguage();
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [calendarData, setCalendarData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dayDetails, setDayDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const fetchCalendarData = useCallback(async () => {
        try {
            const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
            if (res.ok) {
                setCalendarData(await res.json());
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        setLoading(true);
        fetchCalendarData();
    }, [fetchCalendarData]);

    const fetchDayDetails = async (date) => {
        if (selectedDate === date) {
            setSelectedDate(null);
            setDayDetails(null);
            return;
        }
        try {
            const res = await fetch(`/api/calendar?date=${date}`);
            if (res.ok) {
                const data = await res.json();
                setDayDetails(data);
                setSelectedDate(date);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        // Don't go into the future
        if (direction > 0) {
            const today = new Date();
            if (newDate.getFullYear() > today.getFullYear() ||
                (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() > today.getMonth())) {
                return;
            }
        }
        setCurrentDate(newDate);
        setSelectedDate(null);
        setDayDetails(null);
    };

    const getMonthLabel = () => {
        if (locale === 'zh-TW') {
            return `${year}年${month}月`;
        }
        return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    // Build calendar grid
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const calendarMap = {};
    calendarData.forEach((d) => {
        calendarMap[d.date] = d;
    });

    const getDayStatus = (dateStr) => {
        const data = calendarMap[dateStr];
        if (!data) return 'none';
        const total = parseInt(data.total_items) || 1;
        const completed = parseInt(data.completed) || 0;
        if (completed >= total) return 'complete';
        if (completed > 0) return 'partial';
        return 'none';
    };

    const weekDays = locale === 'zh-TW'
        ? ['日', '一', '二', '三', '四', '五', '六']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarCells = [];
    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarCells.push({ type: 'empty', key: `e-${i}` });
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isFuture = new Date(dateStr + 'T00:00:00') > today;
        const status = getDayStatus(dateStr);
        calendarCells.push({ type: 'day', day, dateStr, isToday, isFuture, status, key: `d-${day}` });
    }

    const itemTypeIcon = (type) => type === 'medication' ? '💉' : '💊';

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <LanguageSwitcher />

            <div className="page-header">
                <h1 className="page-title">{t('calendar.title')}</h1>
            </div>

            {/* Month Navigation */}
            <div className="date-nav">
                <button className="date-nav-btn" onClick={() => navigateMonth(-1)}>←</button>
                <span className="date-display">{getMonthLabel()}</span>
                <button className="date-nav-btn" onClick={() => navigateMonth(1)}>→</button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid glass-card">
                <div className="calendar-weekdays">
                    {weekDays.map((d) => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {calendarCells.map((cell) => {
                        if (cell.type === 'empty') {
                            return <div key={cell.key} className="calendar-cell empty"></div>;
                        }
                        return (
                            <div
                                key={cell.key}
                                className={`calendar-cell
                                    ${cell.isToday ? 'today' : ''}
                                    ${cell.isFuture ? 'future' : ''}
                                    ${selectedDate === cell.dateStr ? 'selected' : ''}
                                    ${cell.status}`
                                }
                                onClick={() => !cell.isFuture && fetchDayDetails(cell.dateStr)}
                            >
                                <span className="calendar-day-number">{cell.day}</span>
                                {cell.status !== 'none' && (
                                    <span className={`calendar-dot ${cell.status}`}></span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="calendar-legend">
                <span className="legend-item"><span className="legend-dot complete"></span> {t('calendar.complete')}</span>
                <span className="legend-item"><span className="legend-dot partial"></span> {t('calendar.partial')}</span>
                <span className="legend-item"><span className="legend-dot none-dot"></span> {t('calendar.noRecord')}</span>
            </div>

            {/* Day Details */}
            {selectedDate && dayDetails && (
                <div className="calendar-detail glass-card slide-in">
                    <h3 className="calendar-detail-title">
                        {locale === 'zh-TW'
                            ? `${parseInt(selectedDate.split('-')[1])}月${parseInt(selectedDate.split('-')[2])}日`
                            : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }
                    </h3>
                    {dayDetails.length === 0 ? (
                        <p className="calendar-detail-empty">{t('calendar.noRecordDay')}</p>
                    ) : (
                        dayDetails.map((item) => (
                            <div key={item.id} className="calendar-detail-item">
                                <span className="calendar-detail-name">
                                    {itemTypeIcon(item.item_type)} {item.supplement_name || item.item_name}
                                    {item.dosage && ` (${item.dosage})`}
                                </span>
                                <span className="calendar-detail-time">
                                    {new Date(item.checked_at).toLocaleTimeString(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
