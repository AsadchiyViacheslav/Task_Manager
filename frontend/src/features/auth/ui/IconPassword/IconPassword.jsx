import Show from "../../../../assets/icons/show.svg?react";
import Hide from "../../../../assets/icons/hide.svg?react";
import s from "./IconPassword.module.css";

export default function IconPassword({ isShow, onChange }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onChange();          
  };

  return (
    <div onClick={handleClick} className={s.iconWrapper}>
      {isShow ? <Hide className={s.icon} /> : <Show className={s.icon} />}
    </div>
  );
}
