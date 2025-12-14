export class ApiClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.onUnauthorized = config.onUnauthorized;
    this.maxRetries = config.maxRetries || 1;
  }

  async request(url, config = {}, retry = true, attempt = 0, skipContentType = false) {
    console.log(retry)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = {
        "X-Requested-With": "XMLHttpRequest",
        ...config.headers,
      };

      // Если skipContentType = false и body не является FormData, ставим JSON
      if (!skipContentType && !(config.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(this.baseURL + url, {
        ...config,
        headers,
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
        return this.request(url, config, false, attempt + 1, skipContentType);
      }

      if (!response.ok) {
        console.log(response,{statusCode: response.status, data: responseData})
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

  post(url, data, config = {},retry=true) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(url, { ...config, method: "POST", body },retry);
  }

  put(url, data, config = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(url, { ...config, method: "PUT", body });
  }

  patch(url, data, config = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(url, { ...config, method: "PATCH", body });
  }

  delete(url, config) {
    return this.request(url, { ...config, method: "DELETE" });
  }
}
