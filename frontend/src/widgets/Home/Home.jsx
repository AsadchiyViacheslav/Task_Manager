import { useEffect, useState } from "react";
import { useUserStore } from "../../features/auth/model/useUserStore";
import { useTasksStore } from "../../features/tasks/model/useTasksStore";
import Menu from "../../shared/ui/Menu/Menu";
import Task from "../../shared/ui/Task/Task";
import Arrow from "../../assets/icons/arrow.svg?react";
import s from "./Home.module.css";
import Chart from "./share/Chart";
import Avatar from "./share/Avatar/Avatar";

export default function Home() {
  const avatar = useUserStore((state) => state.avatar);
  const tasks = useTasksStore((state) => state.tasks);
  const getAll = useTasksStore((state) => state.getAll);
  const {completedStats,getCompletedStats} = useTasksStore()
  const allTasks = tasks.length;
  const taskComplite = tasks.filter(task => task.progress === 100).length;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await getAll();
      } catch (e) {
        console.error("Ошибка при загрузке задач:", e);
      }
    };
    fetchTasks();
  }, [getAll]);

  useEffect(() => {
    const fetchCompletedStats = async () => {
      try {
        await getCompletedStats();
      } catch (e) {
        console.error("Ошибка при загрузке статистики выполненных задач:", e);
      }
    };

    fetchCompletedStats();
  }, [getCompletedStats]);

  const firstTask = tasks[0];
  const otherTasks = tasks.slice(1);
  const [offset, setOffset] = useState(0);
  const slideWidth = 328;
  const spacing = 16;

  function containerWidth() {
    const el = document.querySelector(`.${s.sliderContainer}`);
    return el ? el.clientWidth : 0;
  }

  const handlePrev = () => {
    setOffset((prev) => Math.min(prev + slideWidth + spacing, 0));
  };

  const handleNext = () => {
    const max = -(otherTasks.length * (slideWidth + spacing ) - containerWidth());
    setOffset((prev) => Math.max(prev - (slideWidth + spacing), max));
  };
  console.log(firstTask)
  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div className={s.container}>
        <div className={s.left}>
          <h1 className={s.title}>Добро пожаловать!</h1>

          <div className={s.info}>
            <div className={s.statsContainer}>
              <div className={s.stats}>
                <p className={s.titleStats}>Выполненные задачи</p>
                <p className={s.remained}>{taskComplite}</p>

                <div className={s.contentStats}>
                  <div
                    className={s.percentCircle}
                    style={{
                      background: `conic-gradient(#546FFF ${
                        (taskComplite / allTasks) * 100 * 3.6
                      }deg, #1A1E38 0deg)`,
                    }}
                  >
                    <div className={s.innerCircle}>
                      <p className={s.percent}>{Math.floor(taskComplite / allTasks* 100) } %</p>
                    </div>
                  </div>

                  <div className={s.allTasksContainer}>
                    <p className={s.allTasks}>{allTasks}</p>
                    <p className={s.allTasksSubText}>Задач</p>
                  </div>
                </div>
              </div>
            </div>

            <Chart data={completedStats} />
          </div>

          <div className={s.sliderWrapper}>
            <div className={s.tasksTitle}>
              <h2>Текущие задачи</h2>
              <div className={s.arrowContainer}>
                <div className={s.arrow}>
                  <Arrow onClick={handlePrev} className={`${s.arrow} ${s.leftArrow}`} />
                </div>
                <div className={s.arrow}>
                  <Arrow onClick={handleNext} className={s.arrow} />
                </div>
              </div>
            </div>

            <div className={s.sliderContainer}>
              <div
                className={s.sliderContent}
                style={{ transform: `translateX(${offset}px)` }}
              >
                {otherTasks.map((task, id) => (
                  <div className={s.slide} key={id}>
                    <Task
                      className={s.task}
                      {...task}
                      setProgress={(value) => setProgress(task.id, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={s.right}>
          <Avatar />
          {firstTask && (
            <Task
              key={0}
              {...firstTask}
              showSubTasks={true}
              className={s.current}
              setProgress={(value) => setProgress(firstTask.id, value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
