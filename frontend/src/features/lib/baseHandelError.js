export class BaseErrorHandler {
  constructor() {
    // this.SERVER_TRANSLATIONS = {};
  }

  handle(error) {
    if (this.isNetworkError(error)) {
      return {
        fieldErrors: {},
        globalError: "Нет интернета",
        message:
          "Не удалось установить соединение с сервером. Проверьте интернет-соединение и попробуйте снова.",
        shouldRetry: true,
      };
    }

    if (this.isApiError(error)) {
      const { statusCode, data } = error;

      const globalError =
        data?.message || `Ошибка. Попробуйте позже`;

      return {
        fieldErrors: {},
        globalError,
        message: globalError,
        shouldRetry: statusCode >= 500,
      };
    }

    return {
      fieldErrors: {},
      globalError: "Произошла ошибка. Попробуйте позже",
      message: "Произошла неизвестная ошибка на сервере.",
      shouldRetry: false,
    };
  }

  isNetworkError(error) {
    return (
      error !== null &&
      typeof error === "object" &&
      "name" in error &&
      (error.name === "AbortError" || error.name === "TypeError")
    );
  }

  isApiError(error) {
    return error !== null && typeof error === "object" && "statusCode" in error;
  }
}
