export function validateEmail(email) {
  if (!email) return "Email обязателен";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Некорректный email";
  return null;
}

export function validatePassword(password) {
  const requirements = [];

  if (!password) {
    return "Пароль обязателен";
  }

  if (password.length < 8) requirements.push("минимум 8 символов");
  if (!/[A-ZА-ЯЁ]/.test(password)) requirements.push("хотя бы одна заглавная буква");
  if (!/[a-zа-яё]/.test(password)) requirements.push("хотя бы одна строчная буква");
  if (!/[0-9]/.test(password)) requirements.push("хотя бы одна цифра");

  if (requirements.length === 0) return null;

  return `Неверный пароль: ${requirements.join(", ")}`;
}

export function validateRepeatPassword(password, repeatPassword) {
  if (!repeatPassword) return "Повтор пароля обязателен";
  if (repeatPassword !== password) return "Пароли не совпадают";
  return null;
}

export function validateName(name) {
  if (!name) return "Имя обязательно";
  return null;
}

export function validateFormRegistration(form) {
  const errors = {
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    repeatPassword: validateRepeatPassword(form.password, form.repeatPassword),
    name: validateName(form.name),
  };

  const isValid = Object.values(errors).every((err) => !err);

  return { errors, isValid };
}
<<<<<<< HEAD
=======
export function validateFormLogin(form) {
  const errors = {
    email: validateEmail(form.email),
    password: validatePassword(form.password)
  };

  const isValid = Object.values(errors).every((err) => !err);

  return { errors, isValid };
}
>>>>>>> login-front
