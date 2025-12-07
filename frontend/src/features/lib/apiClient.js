export class ApiClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.onUnauthorized = config.onUnauthorized;
    this.maxRetries = config.maxRetries || 1;
  }

  async request(url, config = {}, retry = true, attempt = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseURL + url, {
        ...config,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...config.headers,
        },
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await response.text();
      let responseData = null;
      try {
        responseData = text ? JSON.parse(text) : null;
      } catch {
        responseData = text;
      }

      if (response.status === 401 && retry && attempt < this.maxRetries && this.onUnauthorized) {
        await this.onUnauthorized();
        return this.request(url, config, false, attempt + 1);
      }

      if (!response.ok) {
        throw { statusCode: response.status, data: responseData };
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error("Request Timeout:", url);
      } else if (error.name === "TypeError") {
        console.error("Network Error:", url, error);
      }

      throw error;
    }
  }

  get(url, config) {
    return this.request(url, { ...config, method: "GET" });
  }

  post(url, data, config) {
    return this.request(url, { ...config, method: "POST", body: JSON.stringify(data) });
  }

  put(url, data, config) {
    return this.request(url, { ...config, method: "PUT", body: JSON.stringify(data) });
  }

  patch(url, data, config) {
    return this.request(url, { ...config, method: "PATCH", body: JSON.stringify(data) });
  }

  delete(url, config) {
    return this.request(url, { ...config, method: "DELETE" });
  }
}
