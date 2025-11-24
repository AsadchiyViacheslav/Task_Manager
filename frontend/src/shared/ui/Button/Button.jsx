import s from "./Button.module.css"
export default function Button({ children, ...props }) {
  return (
    <button className={s.button} {...props}>
      {children}
    </button>
  );
}