import Button from "../../../../shared/ui/Button/Button";
import InputField from "../../../../shared/ui/InputField/InputField";
import { useState,useCallback } from "react";
import { useUserStore } from "../../model/useUserStore";
import { useAuthErrorHandler } from "../../lib/error";
import { validateFormRegistration } from "../../lib/validation";
import IconPassword from "../IconPassword/IconPassword";
import Task from "../../../../shared/ui/Task/Task";
import Logo from "../../../../assets/icons/logo.svg?react"
import s from "./Registration.module.css"


export default function Registration() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        name: ""
    });
    const [error,setError]=useState(null)
    const reg = useUserStore((state)=>state.reg)
    const [globalError,setGlobalError]=useState(null)
    const [showPassword,setShowPassword]=useState(false)
    const [showPasswordRepid,setShowPasswordRepid]=useState(false)

    const toggleShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
        }, []);

    const toggleShowRepeatPassword = useCallback(() => {
            setShowPasswordRepid(prev => !prev);
            }, []);

    const handleChange = (field) => (value) => {
        setForm({ ...form, [field]: value });
        setError((prev) => ({
            ...prev,
            [field]: null,
        }));
    };
    const handleSubmit = async ()=>{
        const {errors,isValid} =validateFormRegistration(form);
        if (isValid) {
            try{
                await reg(form)
            }catch (e){
                const handel = useAuthErrorHandler.handle(e,"signup")
                setGlobalError(handel)
            }
        } else{
            setError(errors)
        }
    }
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
                    <h1>Регистрация</h1>
                
                    <div className={s.form}>
                        
                        <InputField
                            label="Имя"
                            value={form.name}
                            onChange={handleChange("name")}
                            error={error?.name||""}
                            placeholder="Введите Имя"
                        />
                        <InputField
                            label="Email"
                            value={form.email}
                            onChange={handleChange("email")}
                            error={error?.email||""}
                            placeholder="Введите Email"
                        />
                        <InputField
                            icon={<IconPassword isShow={showPassword} onChange={toggleShowPassword}/>}
                            label="Пароль"
                            type={showPassword?"password":"text"}
                            value={form.password}
                            onChange={handleChange("password")}
                            error={error?.password||""}
                            placeholder="Введите Пароль"
                        />
                        <InputField
                            icon={<IconPassword isShow={showPasswordRepid} onChange={toggleShowRepeatPassword}/>}
                            label="Повтор пароля"
                            type={showPasswordRepid?"password":"text"}
                            value={form.repeatPassword}
                            onChange={handleChange("repeatPassword")}
                            error={error?.repeatPassword||""}
                            placeholder="Повторите пароль"
                        />
                        {globalError && <p className={s.globalError}>{globalError.globalError}</p>}
                        <div className={s.button}>
                            <Button onClick={handleSubmit}>
                                Зарегистрироваться
                            </Button>
                            <a className={s.ref} href="/login">Войти</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
