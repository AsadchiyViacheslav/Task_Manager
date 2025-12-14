import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import CustomCaptionLabel from "./CustomCaptionLabel";
import s from "./Calendar.module.css";

export default function Calendar({
  className,
  reverseYears,
  label,
  onChange,
  value,
}) {
  const [selected, setSelected] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today;
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);

  useEffect(() => {
    if (value) {
      const parts = value.split("-").map(Number);
      if (parts.length === 3) {
        const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(newDate.getTime()) && newDate >= minDate) {
          setSelected(newDate);
          setCurrentMonth(newDate);
        }
      }
    }
  }, [value]);

  const handleSelect = (day) => {
    if (day && day >= minDate) {
      setSelected(day);
      const formatted = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(day.getDate()).padStart(2, "0")}`;

      onChange?.(formatted);
    }
  };
  const modifiers = {
    past: { before: today },
  };

  return (
    <div className={`${s.container} ${className || ""}`}>
      {label && <p className={s.label}>{label}</p>}
      <div className={s.calendar}>
        <DayPicker
          locale={ru}
          mode="single"
          selected={selected}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onSelect={handleSelect}
          captionLayout="dropdown"
          showOutsideDays
          hideNavigation
          fromDate={minDate}
          toDate={maxDate}
          modifiers={modifiers}
          modifiersClassNames={{
            past: s.pastDay,
          }}
          classNames={{
            day:s.daySize,
            weeks: s.weeks,
            week: s.week,
            day_button: s.day,
            outside: s.outside,
            selected: s.selected,
            weekday: s.weekDay,
            month_grid: s.table,
            month: s.root,
            caption_label: s.dropdown,
            dropdowns: s.dropdowns,
          }}
          components={{
            MonthCaption: () => (
              <CustomCaptionLabel reverseYears={reverseYears} />
            ),
          }}
        />
      </div>
    </div>
  );
}
