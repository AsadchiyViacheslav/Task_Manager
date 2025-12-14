import Header from "../../shared/ui/Header/Header";
import Menu from "../../shared/ui/Menu/Menu";
import { useTasksStore } from "../../features/tasks/model/useTasksStore";
import Task from "../../shared/ui/Task/Task";
import { useEffect, useState, useRef } from "react";
import s from "./TaskList.module.css";
import Arrow from "../../assets/icons/arrow.svg?react"
import Add from "../../assets/icons/add.svg?react"
import { useNavigate } from "react-router-dom";

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks, getAll } = useTasksStore();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const getHoursLeft = (deadline) => {
  const [year, month, day] = deadline.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  // console.log((date.getTime() - Date.now()) / (1000 * 60 * 60))
  return (date.getTime() - Date.now()) / (1000 * 60 * 60);
};


  const urgentTasks = tasks
    .filter((t) => getHoursLeft(t.deadline) <= 24)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const oldTasks = tasks
    .filter((t) => getHoursLeft(t.deadline) > 24)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const [offsetUrgent, setOffsetUrgent] = useState(0);
  const urgentContainerRef = useRef(null);
  const slideWidth = 328;
  const spacing = 16;

  const handlePrevUrgent = () => {
    setOffsetUrgent((prev) => Math.min(prev + slideWidth + spacing, 0));
  };

  const handleNextUrgent = () => {
    const totalWidth = urgentTasks.length * (slideWidth + spacing) - spacing;
    const containerWidth = urgentContainerRef.current?.clientWidth || 0;
    console.log(containerWidth)
    if (totalWidth <= containerWidth) return;
    const maxOffset = -(urgentTasks.length * (slideWidth + spacing)-containerWidth - 328);
    console.log(maxOffset)
    setOffsetUrgent((prev) => Math.max(prev - (slideWidth + spacing), maxOffset));
  };

  const [offsetOld, setOffsetOld] = useState(0);
  const oldContainerRef = useRef(null);

  const handlePrevOld = () => {
    setOffsetOld((prev) => Math.min(prev + slideWidth + spacing, 0));
  };

  const handleNextOld = () => {
    const totalWidth = oldTasks.length * (slideWidth + spacing) - spacing;
    const containerWidth = oldContainerRef.current?.clientWidth || 0;
    console.log(containerWidth,totalWidth)
    const maxOffset = -(oldTasks.length * (slideWidth + spacing) - containerWidth + 275);
    console.log(maxOffset)
    if (totalWidth <= containerWidth) return;
    setOffsetOld((prev) => Math.max(prev - (slideWidth + spacing), maxOffset));
  };
  // console.log(urgentTasks,oldTasks)
  return (
    <div className={s.page}>
      <Menu />
      <div className={s.content}>
        <Header title={"Все задачи"} />
        
        <div className={s.sliderWrapper}>
            <div className={s.subTitle}>
                <h2 className={s.titleSlider}>Истекает срок</h2>
                <div className={s.arrowContainer}>
                    <div className={s.arrow}>
                        <Arrow onClick={handlePrevUrgent} className={`${s.arrow} ${s.leftArrow}`} />
                    </div>
                    <div className={s.arrow}>
                        <Arrow onClick={handleNextUrgent} className={s.arrow} />
                    </div>
                </div>
            </div>
            <div className={s.sliderContainer} ref={urgentContainerRef}>
            <div
                className={s.sliderContent}
                style={{ transform: `translateX(${offsetUrgent}px)` }}
            >
                {urgentTasks.map((t,id) => (
                <div className={s.slide} key={id}>
                    <Task {...t} />
                </div>
                ))}
            </div>
            </div>
        </div>

        
        <div style={{paddingTop:0}} className={s.sliderWrapper}>
            <div className={s.subTitle}>
                <h2 className={s.titleSlider}>Новые задачи</h2>
                <div className={s.arrowContainer}>
                    <div className={s.arrow}>
                        <Arrow onClick={handlePrevOld} className={`${s.arrow} ${s.leftArrow}`} />
                    </div>
                    <div className={s.arrow}>
                        <Arrow onClick={handleNextOld} className={s.arrow} />
                    </div>
                </div>
            </div>
          <div className={s.sliderContainer} ref={oldContainerRef}>
            <div
              className={s.sliderContent}
              style={{ transform: `translateX(${offsetOld}px)` }}
            >
            <div onClick={()=>{navigate("/tasks/create")}} className={`${s.slide} ${s.newTask}`} key="new-task">
                <Add className={s.add}/>
                <Task className={s.task} animatedSkeleton={false} skeleton={true}/>
            </div>
            {oldTasks.map((t,id) => (
            <div className={s.slide} key={-id}>
                <Task {...t} />
            </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
