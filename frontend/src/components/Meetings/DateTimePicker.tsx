import React, { useState, useRef, useEffect } from 'react';
import './DateTimePicker.css';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDateTime?: string;
  required?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDateTime,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(
    value ? new Date(value).getHours() : 9
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? new Date(value).getMinutes() : 0
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${year} at ${hours}:${minutes}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      selectedHour,
      selectedMinute
    );
    setSelectedDate(newDate);
  };

  const handleTimeConfirm = () => {
    if (!selectedDate) return;

    const finalDate = new Date(selectedDate);
    finalDate.setHours(selectedHour);
    finalDate.setMinutes(selectedMinute);

    const year = finalDate.getFullYear();
    const month = String(finalDate.getMonth() + 1).padStart(2, '0');
    const day = String(finalDate.getDate()).padStart(2, '0');
    const hours = String(finalDate.getHours()).padStart(2, '0');
    const minutes = String(finalDate.getMinutes()).padStart(2, '0');

    const formattedValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (day: number) => {
    if (!minDateTime) return false;

    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const minDate = new Date(minDateTime);
    minDate.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < minDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="datetime-picker-wrapper" ref={pickerRef}>
      <div className="datetime-input-container" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          value={formatDisplayValue()}
          placeholder="Select date and time"
          readOnly
          required={required}
          className="datetime-display-input"
        />
        <svg
          className="datetime-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      {isOpen && (
        <div className="datetime-picker-dropdown">
          <div className="calendar-section">
            <div className="calendar-header">
              <button type="button" onClick={handlePrevMonth} className="nav-btn">
                ‹
              </button>
              <div className="current-month">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <button type="button" onClick={handleNextMonth} className="nav-btn">
                ›
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekday-header">Sun</div>
              <div className="weekday-header">Mon</div>
              <div className="weekday-header">Tue</div>
              <div className="weekday-header">Wed</div>
              <div className="weekday-header">Thu</div>
              <div className="weekday-header">Fri</div>
              <div className="weekday-header">Sat</div>

              {days.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day === null ? 'empty' : ''} ${
                    day && isToday(day) ? 'today' : ''
                  } ${day && isSelected(day) ? 'selected' : ''} ${
                    day && isDateDisabled(day) ? 'disabled' : ''
                  }`}
                  onClick={() => day && !isDateDisabled(day) && handleDateSelect(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="time-section">
            <div className="time-label">Select Time</div>
            <div className="time-inputs">
              <div className="time-input-group">
                <label>Hour</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="time-select"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <span className="time-separator">:</span>
              <div className="time-input-group">
                <label>Minute</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                  className="time-select"
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="picker-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="picker-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTimeConfirm}
              className="picker-confirm-btn"
              disabled={!selectedDate}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
