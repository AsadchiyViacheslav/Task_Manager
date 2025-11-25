import { useState, useRef, useEffect } from "react";
import s from "./Avatar.module.css";
import { useUserStore } from "../../../../features/auth/model/useUserStore";
import Button from "../../../../shared/ui/Button/Button";

export default function Avatar() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const logout = useUserStore((state) => state.logout);
  const avatar = useUserStore((state)=>state.avatar);
  console.log(useUserStore((state)=>state.isLoggedIn))

  const handleToggle = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Ошибка при выходе:", e);
    }
  };

  return (
    <div className={s.avatarWrapper} ref={popupRef}>
      <img
        className={s.avatar}
        src={avatar}
        alt="Avatar"
        onClick={handleToggle}
      />
      
        <div className={`${s.popup} ${open?s.open:s.hide}`}>
          <Button className={s.logoutButton} onClick={handleLogout}>
            <p>Выйти</p>
          </Button>
        </div>
    </div>
  );
}
