import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Arrow from "../../../assets/icons/arrow.svg?react";
import s from "./Chart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Chart({ data }) {
  const [period, setPeriod] = useState("week");
  const [open, setOpen] = useState(false);
  const [hovered,setHovered]=useState(false);

  const handleSelect = (value) => {
    setPeriod(value);
    setOpen(false);
  };

  const periodText = {
    week: "Неделя",
    month: "Месяц",
    year: "Год",
  };

  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (period === "week") {
      return sorted.slice(-7).map((item) => ({
        ...item,
        label: new Date(item.date).toLocaleDateString("ru-RU", { weekday: "short" }),
      }));
    }

    if (period === "month") {
        const lastDate = new Date(sorted[sorted.length - 1].date);

        const monthData = sorted.filter(
            (d) => new Date(d.date).getMonth() === lastDate.getMonth()
        );
        const intervals = 6;
        const intervalLength = Math.ceil(monthData.length / intervals);

        return Array.from({ length: intervals }, (_, i) => {
            const slice = monthData.slice(i * intervalLength, (i + 1) * intervalLength);

            if (slice.length === 0) return null;

            const sum = slice.reduce((acc, curr) => acc + curr.completed, 0);

            return {
            date: slice[0].date,
            completed: sum,
            label: new Date(slice[0].date).getDate(), 
            };
        }).filter(Boolean);
        }

    if (period === "year") {
      const yearData = sorted.filter(
        (d) =>
          new Date(d.date).getFullYear() === new Date(sorted[sorted.length - 1].date).getFullYear()
      );
      const months = [0, 2, 4, 6, 8, 10];
      return months.map((m) => {
        const slice = yearData.filter(
          (d) => new Date(d.date).getMonth() === m || new Date(d.date).getMonth() === m + 1
        );
        const sum = slice.reduce((acc, curr) => acc + curr.completed, 0);
        return {
          date: slice[0]?.date || new Date(2025, m, 1),
          completed: sum,
          label: new Date(2025, m, 1).toLocaleDateString("ru-RU", { month: "short" }),
        };
      });
    }

    return [];
  }, [data, period]);

  const chartData = {
    labels: groupedData.map((item) => item.label),
    datasets: [
      {
        label: "Выполненные задачи",
        data: groupedData.map((item) => item.completed),
        fill: false,
        borderColor: "#546FFF",
        backgroundColor: "#546FFF",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className={s.chart}>
      <div className={s.header}>
        <p className={s.title}>Активность</p>
        <div className={s.dropDownWrapper}>
          <div className={s.dropDown} onMouseEnter={()=>{setHovered(true)}} onMouseLeave={()=>{setHovered(false)}} onClick={() => setOpen(!open)}>
            <p className={s.dropDownCurrent}>{periodText[period]}</p>
            <Arrow className={`${s.arrow} ${hovered?s.hover:""} ${open?s.active:""}`} />
          </div>
          {open && (
            <div className={s.dropDownMenu}>
              <div className={s.elContainer} onClick={() => handleSelect("week")}><p className={s.el}>Неделя</p></div>
              <div className={s.elContainer} onClick={() => handleSelect("month")}><p className={s.el}>Месяц</p></div>
              <div className={s.elContainer} onClick={() => handleSelect("year")}><p className={s.el}>Год</p></div>
            </div>
          )}
        </div>
      </div>

      <div className={s.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
