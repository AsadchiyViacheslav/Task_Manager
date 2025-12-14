import { useState } from "react";
import { useDayPicker } from "react-day-picker";
import s from "./Calendar.module.css";
import Chevron from "../../../assets/icons/chevron.svg?react";

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];


export default function CustomCaptionLabel({
  startYear,
  endYear,
  reverseYears = true
}) {
  const { months, goToMonth } = useDayPicker();
  const current = months?.[0];
  if (!current) return null;

  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const currentMonth = current.date.getMonth();
  const currentYear = current.date.getFullYear();

  const now = new Date().getFullYear();

  const computedStartYear = startYear ?? now - 100;
  const computedEndYear = endYear ?? now;

  let years = Array.from(
    { length: computedEndYear - computedStartYear + 1 },
    (_, i) => computedStartYear + i
  );

  if (reverseYears) {
    years = years.reverse();
  }

  const handleMonthSelect = (month) => {
    goToMonth(new Date(currentYear, month, 1));
    setMonthOpen(false);
  };

  const handleYearSelect = (year) => {
    goToMonth(new Date(year, currentMonth, 1));
    setYearOpen(false);
  };

  return (
    <div className={s.captionWrapper}>
      <div className={s.dropdowns}>
        <div onClick={() => setMonthOpen(!monthOpen)} className={s.dropdown}>
          <p className={s.monthLabel}>{monthNames[currentMonth]}</p>
          <Chevron className={s.chevron} />
          {monthOpen && (
            <div className={s.options}>
              <div className={s.optionsInner}>
                {monthNames.map((m, i) => (
                  <div key={i} className={s.option} onClick={() => handleMonthSelect(i)}>
                    <p>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div onClick={() => setYearOpen(!yearOpen)} className={s.dropdown}>
          <p className={s.yearLabel}>{currentYear}</p>
          <Chevron className={s.chevron} />
          {yearOpen && (
            <div className={s.options}>
              <div className={s.optionsInner}>
                {years.map((y) => (
                  <div key={y} className={s.option} onClick={() => handleYearSelect(y)}>
                    <p>{y}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
