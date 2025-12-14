import { useNavigate, useParams } from "react-router-dom";
import { useTasksStore } from "../../features/tasks/model/useTasksStore"
import { useEffect, useState } from "react";
import s from "./Task.module.css"
import Menu from "../../shared/ui/Menu/Menu";
import Header from "../../shared/ui/Header/Header";
import { timeToString } from "../../shared/lib/timeToString";
import Time from "../../assets/icons/time.svg?react"
import Check from "../../assets/icons/check.svg?react"
import { useSubTasksApi } from "../../features/subTask/apiSubtasks";
import * as Slider from "@radix-ui/react-slider";
import Button from "../../shared/ui/Button/Button";
import Gallery from "../../assets/icons/gallery.svg?react"

export default function CurrentTask() {
    const { id } = useParams();
    const { getById, loading ,update} = useTasksStore();
    const deleteTask = useTasksStore((state)=> state.deleteTask)
    const [task, setTask] = useState(null);
    const [value, setValue] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false);
    const nav = useNavigate()
    

    useEffect(() => {
        async function fetchTask() {
        const data = await getById(Number(id));
        setTask(data);
        setValue(data.progress??0)
        }
        fetchTask();
    }, [getById, id]);
    console.log(task)
    
    if(!task) return
    const timeString = timeToString(task.deadline)
    const handelCheck = async (st) => {
        const completed = !st.completed;
        const updated = task.subTasks.map(sub =>
            sub.id === st.id ? { ...sub, completed: completed } : sub
        );

        setTask(prev => ({ ...prev, subTasks: updated }));
        try {
            console.log(task.id, st.id, {
                completed: complite,
                description: st.description,
            })
            const response = await useSubTasksApi.update(task.id, st.id, {
                completed: complite,
                description: st.description,
            });
            console.log(response)
        } catch (e) {
            console.error(e);
        }
    };

  
  const onChangeProgress = (value) => {
    setValue(value)
  }
  const onDelete = async () => {
    try{
        await deleteTask(task.id)
        nav("/")
    }catch(e){
        console.error(e)
    }
  }
  const handleFinishChange = async () => {
        console.log(id,{progress:value})
        try {
            await update(id,{progress:value})
        } catch (e) {
            console.log("Error updating progress", e);
        }
    };
  const path = `/task/edit/${task.id}`
  return(
    <div className={s.page}>
          <Menu />
          {showConfirm && (
            <div className={s.overlay}>
                <div className={s.popup}>
                    <p>Вы точно хотите удалить задачу?</p>
                    <div className={s.popupBtns}>
                        <Button className={s.buttonDelete} onClick={onDelete}>Удалить</Button>
                        <Button onClick={() => setShowConfirm(false)}>Отмена</Button>
                    </div>
                </div>
            </div>
          )}
          <div className={s.content}>
            <Header title={"Детали задачи"} />
            <div className={s.container}>
                <div className={s.leftGroup}>
                    <div className={s.imgContainer}>
                        {task.photoPath?<img className={s.img} src={task.photoPath}/>:<div className={s.noImg}><Gallery/></div>}
                    </div>
                    <div className={s.descriptionTask}>
                        <div className={s.elContainer}>
                            <h2 className={s.title}>{task.title}</h2>
                            <div className={s.timeContainer}>
                                <Time />
                                <p className={s.text}>{timeString}</p>
                            </div>
                        </div>
                        <div className={s.elContainer}>
                            <h2 className={s.title}>Описание</h2>
                            <p>{task.description}</p>
                        </div>
                        <div className={s.elContainer}>
                            <h2 className={s.title}>Детали задачи</h2>
                            {task.subTasks && task.subTasks.length > 0 ? (
                                <div className={s.subtasksList}>
                                    {task.subTasks.map((st, i) => (
                                        <div key={i} className={s.subtaskItem}>
                                            <div onClick={()=>{handelCheck(st)}} className={`${s.chekBox} ${st.completed?s.complite:""}`}><Check className={st.complite?s.visible:""}/></div>
                                            <div className={s.subtaskText}>{st.description}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={s.noSubtasks}>Подзадач нет</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className={s.rightGroup}>
                    <h2 className={s.title}>{task.title}</h2>
                    <div className={`${s.progressContainer}`}>
                        <div className={s.progressText}>
                            <p className={s.text}>Прогресс</p>
                            <p className={`${s.text} ${s.progress}`}>{value} %</p>
                        </div>
                        <Slider.Root
                            className={s.root}
                            value={[value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(v) => onChangeProgress(v[0])}
                            onPointerUp={() => handleFinishChange()}
                        >
                            <Slider.Track className={s.track}>
                                <Slider.Range className={s.range} />
                            </Slider.Track>
                            <Slider.Thumb className={s.thumb} />
                        </Slider.Root>
                    </div>
                    <Button onClick={()=>{setShowConfirm(true)}} className={s.buttonDelete}>Удалить</Button>
                    <Button onClick={()=>{nav(path)}} >Изменить</Button>
                </div> 
            </div>   
          </div>
        </div>
      );
}
