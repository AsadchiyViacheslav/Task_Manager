import { BaseErrorHandler } from "../../lib/baseHandelError";


export class useAuthErrorHandler extends BaseErrorHandler {
  constructor() {
    super();

    this.STATUS_MESSAGES = {
      login: {
<<<<<<< HEAD
=======
        404: "Ошибка сервера. Попробуйте позже",
>>>>>>> login-front
        400: "Введите корректные данные для входа",
        401: "Неверный email или пароль",
        404: "Пользователь не найден",
        429: "Слишком много попыток. Подождите немного",
        500: "Ошибка сервера. Попробуйте позже",
      },
      signup: {
<<<<<<< HEAD
=======
        404: "Ошибка сервера. Попробуйте позже",
>>>>>>> login-front
        400: "Введите корректные данные для регистрации",
        409: "Этот email или телефон уже используется. Попробуйте войти",
        429: "Слишком много попыток. Подождите немного",
        500: "Ошибка сервера. Попробуйте позже",
      },
    };
  }

  handleLoginError(error) {
    const statusCode = error?.statusCode;
    const message =
      this.STATUS_MESSAGES.login[statusCode] || "Произошла ошибка при входе";

    return {
      fieldErrors: error?.data?.errors || {},
      globalError: message,
      message,
      shouldRetry: statusCode >= 500,
    };
  }

  handleSignupError(error) {
    const statusCode = error?.statusCode;
    const message =
      this.STATUS_MESSAGES.signup[statusCode] || "Произошла ошибка при регистрации";

    return {
      fieldErrors: error?.data?.errors || {},
      globalError: message,
      message,
      shouldRetry: statusCode >= 500,
    };
  }

  static handle(error, context) {
<<<<<<< HEAD
    const instance = new AuthErrorHandler();
=======
    const instance = new useAuthErrorHandler();
>>>>>>> login-front

    if (context === "login") {
      return instance.handleLoginError(error);
    }

    if (context === "signup") {
      return instance.handleSignupError(error);
    }

    return instance.handle(error);
  }
}
