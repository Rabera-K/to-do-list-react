import { useState, useEffect, useRef } from "react";
import dateUtils from "../../utils/dateUtils";

function CalendarMini({ selectedDate, onDateSelect }) {
  const [days, setDays] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    generateCalendarDays();
  }, [selectedDate]);

  useEffect(() => {
    if (calendarRef.current) {
      scrollToCurrentDate();
    }
  }, [days]);

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDayOfWeek =
      firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

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

  const scrollToCurrentDate = () => {
    if (!calendarRef.current) return;

    const today = new Date();
    const dayElements = calendarRef.current.querySelectorAll(".day");

    for (let i = 0; i < dayElements.length; i++) {
      const day = dayElements[i];
      const dayNumber = parseInt(day.querySelector(".day-number").textContent);
      const isOtherMonth = day.classList.contains("other-month");

      if (dayNumber === today.getDate() && !isOtherMonth) {
        const scrollLeft =
          day.offsetLeft -
          calendarRef.current.offsetWidth / 2 +
          day.offsetWidth / 2;
        calendarRef.current.scrollLeft = scrollLeft;
        break;
      }
    }
  };

  const enableHorizontalScroll = (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      calendarRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="calendar-container">
      <div
        className="calendar-days"
        id="calendar-days"
        ref={calendarRef}
        onWheel={enableHorizontalScroll}
      >
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${day.isOtherMonth ? "other-month" : ""} 
              ${dateUtils.isSameDay(day.date, selectedDate) ? "selected" : ""}`}
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
export default CalendarMini;
