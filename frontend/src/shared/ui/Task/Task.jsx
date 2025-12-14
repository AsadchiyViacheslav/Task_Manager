import s from "./Task.module.css";
import Time from "../../../assets/icons/time.svg?react";
import Photo from "../../../assets/icons/gallery.svg?react"
import * as Slider from "@radix-ui/react-slider";

import { useState } from "react";
import { timeToString } from "../../lib/timeToString";
import { useNavigate } from "react-router-dom";
import { useTasksStore } from "../../../features/tasks/model/useTasksStore";

export default function Task({
    id,
    img,
    title,
    subtitle,
    progress = 0,
    setProgress,
    deadline,
    subTasks = [],
    showSubTasks = false,
    className = "",
    imgClass = "",
    titleContainerClass = "",
    progressContainerClass = "",
    timeContainerClass = "",
    skeleton = false,
    animatedSkeleton = true,
}) {
    // console.log(id)
    // console.log(subTasks,showSubTasks)
    const nav = useNavigate();
    const [value, setValue] = useState(progress)
    const skeletonClass = animatedSkeleton ? s.skeletonAnimated : s.skeleton
    const [loaded, setLoaded] = useState(false);
    const {update}=useTasksStore() 

    const onChangeProgress = (value) => {
        setValue(value)
        // setProgress && setProgress(value)
    }

    const timeString = timeToString(deadline);
    const path = `/task/${id}`
    const handleFinishChange = async () => {
        try {
            await update(id,{progress:value})
        } catch (e) {
            console.log("Error updating progress", e);
        }
    };

    // console.log(img)
    return (
        <div onClick={()=>{nav(path)}} className={`${s.container} ${className}`}>
            {skeleton ? (
                <>
                    <div className={`${s.galleryWrapper} ${s.imgSkeleton} ${skeletonClass}`} >
                        <Photo className={s.galleryIcon} />
                    </div>
                    <div className={`${s.titleContainer} ${titleContainerClass}`}>
                        <div className={`${s.lineSkeleton} ${skeletonClass}`} />
                        <div className={`${s.lineSkeletonSmall} ${skeletonClass}`} />
                    </div>

                    <div className={`${s.progressContainer} ${progressContainerClass}`}>
                        <div className={s.progressTitle}>
                        <div className={`${s.titleProgress} ${skeletonClass}`} />
                        <div className={`${s.circleSkeleton} ${skeletonClass}`} />
                        </div>
                        <div className={s.progressBar}>
                            <div className={`${s.progressBarSkeleton} ${skeletonClass}`} />
                            <div className={`${s.circleSkeleton} ${s.progressCircle} ${skeletonClass}`} />
                        </div>
                    </div>

                    <div className={`${s.timeContainer} ${timeContainerClass}`}>
                        <div className={`${s.titleProgress} ${skeletonClass}`} />
                        <div className={`${s.circleSkeleton} ${skeletonClass}`} />
                    </div>
                </>
            ) : (
                <>
                    {(!loaded || !img || img.length === 0) && (
                        <div className={`${s.galleryWrapper} ${img ? skeletonClass : ""}`}>
                            <Photo className={s.galleryIcon} />
                        </div>
                    )}

                    {img&&<div className={s.imgConteiner}>
                        <img
                        src={img}
                        className={`${s.img} ${imgClass} ${!loaded ? s.hiddenImage : ""}`}
                        onLoad={() => setLoaded(true)}
                    />
                    </div>}

                    <div className={`${s.titleContainer} ${titleContainerClass}`}>
                        <p className={s.title}>{title}</p>
                        <p className={s.subtitle}>{subtitle}</p>
                    </div>

                    <div className={`${s.progressContainer} ${progressContainerClass}`}>
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
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Slider.Track className={s.track}>
                                <Slider.Range className={s.range} />
                            </Slider.Track>
                            <Slider.Thumb className={s.thumb} />
                        </Slider.Root>
                    </div>

                    <div className={`${s.timeContainer} ${timeContainerClass}`}>
                        <Time />
                        <p className={s.text}>{timeString}</p>
                    </div>
                    {showSubTasks && subTasks.length > 0 && (
                        <>
                        <div className={s.line}>

                        </div>
                        <div className={s.subTasksContainer}>
                            {subTasks.map((subtask, index) => {
                                return(
                                <div key={index} className={s.subtaskDescription}>
                                    <div className={s.number}>
                                        <p >{index+1}</p>
                                    </div>
                                    <p key={index} className={s.subtaskText}>
                                        {subtask.description}
                                    </p>
                                </div>)
                            })}
                        </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
