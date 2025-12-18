import { useState, useEffect } from 'react';
import dateUtils  from '../../utils/dateUtils';

export default function CalendarMini({ selectedDate, onDateSelect }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [selectedDate]);

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const calendarDays = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonthLastDay - i);
      calendarDays.push({ date: day, isOtherMonth: true });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      calendarDays.push({ date: day, isOtherMonth: false });
    }
    
    // Next month days
    const totalCells = 42;
    const daysToAdd = totalCells - calendarDays.length;
    for (let i = 1; i <= daysToAdd; i++) {
      const day = new Date(year, month + 1, i);
      calendarDays.push({ date: day, isOtherMonth: true });
    }
    
    setDays(calendarDays);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-days" id="calendar-days">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${day.isOtherMonth ? 'other-month' : ''} ${dateUtils.isSameDay(day.date, selectedDate) ? 'selected' : ''}`}
            onClick={() => onDateSelect(day.date)}
          >
            <span className="day-name">{dateUtils.getDayName(day.date)}</span>
            <span className="day-number">{day.date.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}