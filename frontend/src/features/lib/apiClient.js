
export class ApiClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.getAuthToken = config.getAuthToken || (async () => null);
    this.onUnauthorized = config.onUnauthorized;
  }

  async request(url, config = {}, retry = true, token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const authToken = token === undefined ? await this.getAuthToken() : token;

      const headers = {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };

      if (config.headers) {
        const existingHeaders = new Headers(config.headers);
        existingHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      }

      if (authToken !== null) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(this.baseURL + url, {
        ...config,
        headers,
        signal: controller.signal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        // if (
        //   response.status === 401 &&
        //   responseData.message === "Unauthorized" &&
        //   retry &&
        //   this.onUnauthorized
        // ) {
        //   // await this.onUnauthorized();
        //   // return this.request(url, config, false, authToken);
        // }
        throw {
          statusCode: response.status,
          data: responseData,
        };
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

  get(url, config, token) {
    return this.request(url, { ...config, method: "GET" }, true, token);
  }

  post(url, data, config, token) {
    return this.request(
      url,
      { ...config, method: "POST", body: JSON.stringify(data) },
      true,
      token
    );
  }

  put(url, data, config, token) {
    return this.request(
      url,
      { ...config, method: "PUT", body: JSON.stringify(data) },
      true,
      token
    );
  }

  patch(url, data, config, token) {
    return this.request(
      url,
      { ...config, method: "PATCH", body: JSON.stringify(data) },
      true,
      token
    );
  }

  delete(url, config, token) {
    return this.request(url, { ...config, method: "DELETE" }, true, token);
  }
}

