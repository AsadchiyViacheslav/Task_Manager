import { useEffect, useState } from "react";
import { useUserStore } from "../../features/auth/model/useUserStore";
import { useTasksStore } from "../../features/tasks/model/useTasksStore";
import Menu from "../../shared/ui/Menu/Menu";
import Task from "../../shared/ui/Task/Task";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Arrow from "../../assets/icons/arrow.svg?react"
import s from "./Home.module.css";
import Chart from "./share/Chart";
import { data } from "./share/mock";
import Avatar from "./share/Avatar/Avatar";


export default function Home() {
  const avatar = useUserStore((state) => state.avatar);
  const tasks = useTasksStore((state) => state.tasks);
  const getAll = useTasksStore((state) => state.getAll);
  const setProgress = useTasksStore((state) => state.setProgress);
  const [slideCount,setSlideCount]=useState(2);
  const allTasks = 100
  const taskComplite = 45


  useEffect(() => {
    const calculateSlideCount = () => {
      const availableWidth = window.innerWidth - 684 - 64;
      const count = Math.floor((availableWidth) / (328 + 32)); 
      console.log(availableWidth,count)
      setSlideCount(count > 0 ? count : 1);
    };
    calculateSlideCount();
    window.addEventListener("resize", calculateSlideCount);
    return () => window.removeEventListener("resize", calculateSlideCount);
  }, []);
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
  console.log(slideCount)
  const firstTask = tasks[0];
  const otherTasks = tasks.slice(1);

  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: slideCount, spacing: 16 },
    loop: false,
  });

  const handlePrev = () => slider.current?.prev();
  const handleNext = () => slider.current?.next();

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
                        <p className={s.remained}>{allTasks-taskComplite}</p>
                        <div className={s.contentStats}>
                            <div className={s.percentCircle } style={{
                                background: `conic-gradient(#546FFF ${(taskComplite / allTasks) * 100 * 3.6}deg, #1A1E38 0deg)`,
                            }}>
                                <div className={s.innerCircle}>
                                    <p className={s.percent}>{taskComplite/allTasks*100} %</p>
                                </div>
                            </div>
                            <div className={s.allTasksContainer}>
                                <p className={s.allTasks}>{allTasks}</p>
                                <p className={s.allTasksSubText}>Задач</p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <Chart data={data}/>
            </div>
          <div className={s.sliderWrapper}>
            <div className={s.tasksTitle}>
                <h2>Текущие задачи</h2>
            <div className={s.arrowContainer}>
                <div className={s.arrow}>
                <Arrow onClick={handlePrev} className={`${s.arrow} ${s.leftArrow}`}/>
                </div>
                <div className={s.arrow}>
                <Arrow onClick={handleNext} className={s.arrow}/>
                </div>
            </div>
            </div>
            <div ref={sliderRef} className="keen-slider">
              {otherTasks.map((task) => (
                <div className={`keen-slider__slide ${s.slide}`} key={task.id}>
                  <Task {...task} setProgress={(value) => setProgress(task.id, value)} />
                </div>
              ))}
            </div>

            
          </div>
        </div>
        <div className={s.right}>
          <Avatar/>
          {firstTask && (
            <Task
              key={firstTask.id}
              {...firstTask}
              showSubtasks={true}
              className={s.current}
              setProgress={(value) => setProgress(firstTask.id, value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
