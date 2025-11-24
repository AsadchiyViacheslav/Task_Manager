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
          className={`${s.input} ${classNameInput} ${error ? s.inputError : ""}`}
          type={as === "input" ? type : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>

      <p className={`${s.errorMessage} ${error?s.show:""} ${classNameError}`}>
        {error}
      </p>
    </div>
  );
}
