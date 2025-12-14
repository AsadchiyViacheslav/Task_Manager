import { NavLink } from "react-router-dom";
import Logo from "../../../assets/icons/logo.svg?react"
import Main from "../../../assets/icons/main.svg?react"
import Settings from "../../../assets/icons/settings.svg?react"
import Tasks from "../../../assets/icons/tasks.svg?react"
import s from "./Menu.module.css"

export default function Menu() {
    const links = [
        { path: "/", label: "Главная", Icon: Main },
        { path: "/tasks", label: "Задачи", Icon: Tasks },
        // { path: "/settings", label: "Настройки", Icon: Settings },
    ];

    return (
        <div className={s.menu}>
            <div className={s.logo}>
                <Logo />
                <p className={s.title}>ТАСК MANAGER</p>
            </div>

            <div className={s.links}>
                {links.map(({ path, label, Icon }) => (
                    <NavLink
                        to={path}
                        key={path}
                        className={({ isActive }) =>
                            isActive ? s.activeLink : s.link
                        }
                    >
                        <Icon />
                        <p className={s.text}>{label}</p>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
