import { useRef } from "react";
import s from "./InputField.module.css";

export default function InputField({
  label,
  placeholder = "",
  maxLength,
  type = "text",
  as = "input",
  value,
  onChange,
  classNameLabel,
  classNameField,
  classNameInput,
  icon: Icon,        
  error,            
  classNameError,  
  ...props
}) {
  const Component = as === "textarea" ? "textarea" : "input";
  const inputRef = useRef(null);
  console.log(error)
  return (
    <div className={`${s.inputField} ${classNameField}`}>
      {label && <p className={`${s.label} ${classNameLabel}`}>{label}</p>}

      <div
        className={`${s.inputWrapper} ${error ? s.error : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        {Icon && (
          <span className={s.icon}>
            {Icon}
          </span>
        )}

        <Component
          ref={inputRef}
          className={`${s.input} ${classNameInput} ${error && error.lenght>0 ? s.inputError : ""}`}
          type={as === "input" ? type : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>

      {error && (
        <p className={`${s.errorMessage} ${s.show} ${classNameError}`}>
          {error}
        </p>
      )}
    </div>
  );
}
