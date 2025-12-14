import s from "./Button.module.css"
export default function Button({ children,className, ...props }) {
  return (
    <button className={`${s.button} ${className}`} {...props}>
      {children}
    </button>
  );
}