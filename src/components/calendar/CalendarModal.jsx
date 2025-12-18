import {useState, useEffect} from 'react';
import dateUtils from '../../utils/dateUtils';

function CalendarModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onDateSelect 
}) {
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(selectedDate));

  useEffect(() => {
    if (isOpen) {
      setCalendarViewDate(new Date(selectedDate));
    }
  }, [isOpen, selectedDate]);

  const generateCalendar = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const today = new Date();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();

    const calendarDays = [];

    // Adding weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
      calendarDays.push({ type: 'header', content: day });
    });

    // Adding previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonthLastDay - i);
      calendarDays.push({ 
        date: day, 
        isOtherMonth: true,
        isToday: dateUtils.isSameDay(day, today),
        isSelected: dateUtils.isSameDay(day, selectedDate)
      });
    }

    // Adding current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      calendarDays.push({ 
        date: day, 
        isOtherMonth: false,
        isToday: dateUtils.isSameDay(day, today),
        isSelected: dateUtils.isSameDay(day, selectedDate)
      });
    }

    // Adding next month days??
    const totalCells = 42;
    const daysToAdd = totalCells - calendarDays.length;
    for (let i = 1; i <= daysToAdd; i++) {
      const day = new Date(year, month + 1, i);
      calendarDays.push({ 
        date: day, 
        isOtherMonth: true,
        isToday: dateUtils.isSameDay(day, today),
        isSelected: dateUtils.isSameDay(day, selectedDate)
      });
    }

    return {
      monthName: `${monthNames[month]} ${year}`,
      days: calendarDays
    };
  };

  const handleDateSelect = (date) => {
    onDateSelect(date);
    onClose();
  };

  const changeMonth = (direction) => {
    const newDate = new Date(calendarViewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarViewDate(newDate);
  };

  const changeYear = (direction) => {
    const newDate = new Date(calendarViewDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setCalendarViewDate(newDate);
  };

  const { monthName, days } = generateCalendar();

  if (!isOpen) return null;

  return (
    <div className="modal calendar-modal" id="calendar-modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="calendar-header">
          <button className="calendar-modal-btn" onClick={() => changeYear(-1)}>
            &lt;&lt;
          </button>
          <button className="calendar-modal-btn" onClick={() => changeMonth(-1)}>
            &lt;
          </button>
          <div className="calendar-month">{monthName}</div>
          <button className="calendar-modal-btn" onClick={() => changeMonth(1)}>
            &gt;
          </button>
          <button className="calendar-modal-btn" onClick={() => changeYear(1)}>
            &gt;&gt;
          </button>
        </div>
        
        <div className="calendar-grid" id="calendar-grid">
          {days.map((day, index) => {
            if (day.type === 'header') {
              return (
                <div key={`header-${index}`} className="calendar-weekday">
                  {day.content}
                </div>
              );
            }

            return (
              <div
                key={`day-${index}`}
                className={`calendar-day 
                  ${day.isOtherMonth ? 'other-month' : ''}
                  ${day.isToday ? 'today' : ''}
                  ${day.isSelected ? 'selected' : ''}`}
                onClick={() => handleDateSelect(day.date)}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default CalendarModal;
