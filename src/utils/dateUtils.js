 const dateUtils = {
  timestampToTimeString(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  timeStringToTimestamp(timeString, baseDate) {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date(baseDate);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.getTime();
  },

  formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  },

  isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  },

  getDayName(date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  },

  isTaskOverdue(task) {
    if (task.completed) return false;

    const taskDate = new Date(task.date);
    const today = new Date();

    const taskDateOnly = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (taskDateOnly < todayOnly) return true;
    
    if (taskDateOnly.getTime() === todayOnly.getTime() && task.time) {
      const [taskHours, taskMinutes] = task.time.split(":").map(Number);
      const currentHours = today.getHours();
      const currentMinutes = today.getMinutes();

      return (
        currentHours > taskHours ||
        (currentHours === taskHours && currentMinutes > taskMinutes)
      );
    }
    
    return false;
  },

  getOverdueTime(task) {
    if (!this.isTaskOverdue(task)) return null;

    const taskDate = new Date(task.date);
    const now = new Date();

    if (task.time) {
      const [taskHours, taskMinutes] = task.time.split(":").map(Number);
      taskDate.setHours(taskHours, taskMinutes, 0, 0);
    } else {
      taskDate.setHours(23, 59, 59, 999);
    }

    const overdueMs = now - taskDate;
    const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor(
      (overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const overdueMinutes = Math.floor(
      (overdueMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (overdueDays > 0) {
      return `${overdueDays} day${overdueDays > 1 ? "s" : ""} ago`;
    } else if (overdueHours > 0) {
      return `${overdueHours} hour${overdueHours > 1 ? "s" : ""} ago`;
    } else {
      return `${overdueMinutes} minute${overdueMinutes > 1 ? "s" : ""} ago`;
    }
  }
};

export default dateUtils;