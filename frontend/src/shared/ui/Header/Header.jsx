import Avatar from "../../../widgets/Home/share/Avatar/Avatar"
import s from "./Header.module.css"

export default function Header ({
    title,
}){
    return(
        <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
            <Avatar className={s.avatar}/>
        </div>
    )
}