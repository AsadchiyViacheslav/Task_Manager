import { BaseErrorHandler } from "../../lib/baseHandelError";


export class useAuthErrorHandler extends BaseErrorHandler {
  constructor() {
    super();

    this.STATUS_MESSAGES = {
      login: {
        400: "Введите корректные данные для входа",
        401: "Неверный email или пароль",
        404: "Пользователь не найден",
        429: "Слишком много попыток. Подождите немного",
        500: "Ошибка сервера. Попробуйте позже",
      },
      signup: {
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
    const instance = new AuthErrorHandler();

    if (context === "login") {
      return instance.handleLoginError(error);
    }

    if (context === "signup") {
      return instance.handleSignupError(error);
    }

    return instance.handle(error);
  }
}
