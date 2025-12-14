export function validateTask(form) {
  const errors = {};

  if (!form.title || form.title.trim().length === 0) {
    errors.title = "Название обязательно";
  } else if (form.title.trim().length < 3) {
    errors.title = "Название должно быть не менее 3 символов";
  } else if (form.title.trim().length > 100) {
    errors.title = "Название должно быть не более 100 символов";
  }

  if (form.description && form.description.length > 1000) {
    errors.description = "Описание не должно превышать 1000 символов";
  }

  if (!form.date) {
    errors.date = "Дата обязательна";
  } else {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(form.date)) {
      errors.date = "Дата должна быть в формате yyyy-MM-dd";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = form.date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      if (dateObj < today) {
        errors.date = "Дата не может быть в прошлом";
      }
    }
  }

  const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
  if (!form.priority || !allowedPriorities.includes(form.priority)) {
    errors.priority = "Приоритет обязателен";
  }

  return errors;
}