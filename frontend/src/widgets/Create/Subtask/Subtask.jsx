import { useState, useRef, useEffect } from "react";
import s from "./SubTask.module.css";
import InputField from "../../../shared/ui/InputField/InputField";

export default function SubTask({
  value = "",
  onChange = () => {},
  editable = true,
  autoFocus = false,
  onEmpty = () => {},
}) {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const inputRef = useRef(null);

  const activate = () => {
    if (!editable) return;
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finish = () => {
    setIsEditing(false);
    if (!value.trim()) {
        onEmpty?.();
        console.log("empty")
    }
  };

  useEffect(() => {
    if (autoFocus && editable) {
      setTimeout(() => {
        setIsEditing(true);
        inputRef.current?.focus();
      }, 0);
    }
  }, [autoFocus, editable]);

  return (
    <div
      className={`${s.wrapper} ${isEditing ? s.editing : ""} ${
        !editable ? s.disabled : ""
      }`}
    >
      <div className={s.text} onClick={activate}>
        {value.length ? value : ""}
      </div>

      <div className={s.inputBox}>
        <InputField
          ref={inputRef}
          value={value}
          onChange={onChange}
          onBlur={finish}
          onKeyDown={(e) => e.key === "Enter" && finish()}
        />
      </div>
    </div>
  );
}
