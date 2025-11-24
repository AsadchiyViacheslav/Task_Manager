import s from "./Task.module.css";
import Time from "../../../assets/icons/time.svg?react";
import Photo from "../../../assets/icons/gallery.svg?react"
import * as Slider from "@radix-ui/react-slider";

import { useState } from "react";
import { timeToString } from "../../lib/timeToString";

export default function Task({
    img,
    title,
    subtitle,
    progress=0,
    setProgress,
    time,
    className = "",
    imgClass = "",
    titleContainerClass = "",
    progressContainerClass = "",
    timeContainerClass = "",
    skeleton = false,
    animatedSkeleton = true,
}) {
    const [value, setValue] = useState(progress)
    const skeletonClass = animatedSkeleton
            ? s.skeletonAnimated
            : s.skeleton
    const [loaded, setLoaded] = useState(false);
    const onChangeProgress = (value)=>{
        setValue(value)
        setProgress(value)
    }
    const timeString = timeToString(time);
    // console.log(timeString)
    return (
        <div className={`${s.container} ${className}`}>
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
                        <div className={`${s.lineSkeleton} ${skeletonClass}`} />
                        <div className={`${s.progressBarSkeleton} ${skeletonClass}`} />
                    </div>

                    <div className={`${s.timeContainer} ${timeContainerClass}`}>
                        <div className={`${s.iconSkeleton} ${skeletonClass}`} />
                        <div className={`${s.lineSkeletonSmall} ${skeletonClass}`} />
                    </div>
                </>
            ) : (
                <>
                    {!loaded && (
                        <div className={`${s.galleryWrapper} ${skeletonClass}`}>
                            <Photo className={s.galleryIcon} />
                        </div>
                    )}

                    <img
                        src={img}
                        className={`${imgClass} ${!loaded ? s.hiddenImage : ""}`}
                        onLoad={() => setLoaded(true)}
                    />

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
                </>
            )}
        </div>
    );
}
