import Button from "../../../../shared/ui/Button/Button";
import InputField from "../../../../shared/ui/InputField/InputField";
import { useState, useCallback } from "react";
import { useUserStore } from "../../model/useUserStore";
import { useAuthErrorHandler } from "../../lib/error";
import IconPassword from "../IconPassword/IconPassword";
import Logo from "../../../../assets/icons/logo.svg?react";
import s from "./Login.module.css";
import Task from "../../../../shared/ui/Task/Task";
import { validateFormLogin } from "../../lib/validation";


export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const login = useUserStore((state) => state.login);
  const [globalError, setGlobalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleChange = (field) => (value) => {
    setForm({ ...form, [field]: value });
    setError((prev) => ({
      ...prev,
      [field]: null
    }));
  };

  const handleSubmit = async () => {
    const {errors,isValid}=validateFormLogin(form)
    if (!isValid) {
        setError(errors)
        return;
    }
    try {
      await login(form);
    } catch (e) {
      const handle = useAuthErrorHandler.handle(e, "login");
      setGlobalError(handle);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.left}>
            <div className={s.titleContainer}>
                <Logo/>
                <p className={s.title}>ТАСК MANAGER</p>
            </div>
            <div className={s.tasks}>
                <Task img={"/picture.svg"} title="Создать варфрейм для тп" subtitle="UI UX Design"/>
                <Task img={"/picture.svg"} title="Создать варфрейм для тп" subtitle="UI UX Design"/>
                <Task img={"/picture.svg"} title="Создать варфрейм для тп" subtitle="UI UX Design"/>
                <Task img={"/picture.svg"} title="Создать варфрейм для тп" subtitle="UI UX Design"/>
            </div>
        </div>
        <div className={s.right}>
          <h1>Вход</h1>

          <div className={s.form}>
            <InputField
              label="Email"
              value={form.email}
              onChange={handleChange("email")}
              error={error?.email || ""}
              placeholder="Введите Email"
            />
            <InputField
              icon={<IconPassword isShow={showPassword} onChange={toggleShowPassword} />}
              label="Пароль"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              error={error?.password || ""}
              placeholder="Введите Пароль"
            />

            {globalError && <p className={s.globalError}>{globalError}</p>}

            <div className={s.button}>
              <Button onClick={handleSubmit}>Войти</Button>
              <div className={s.refContainer}>
              <a className={s.ref} href="/registration">Регистрация</a>
              <a className={s.ref} href="#">Забыли пароль?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
