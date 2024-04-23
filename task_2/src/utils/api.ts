import type { ExchangeRateApiResponse } from "./types";

class MainApi {
  private _baseUrl: string;
  private _headers: Record<string, string>;

  constructor(options: { baseUrl: string; headers: Record<string, string> }) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _getRequestResult(res: Response) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getExchangeRate(currency: string): Promise<ExchangeRateApiResponse> {
    return fetch(`${this._baseUrl}/latest/${currency}`, {
      method: "GET",
      headers: {
        ...this._headers,
      },
    }).then((res) => this._getRequestResult(res));
  }
}

// Создание экземпляра класса Api
const mainApi = new MainApi({
  baseUrl: "https://open.er-api.com/v6",
  headers: {},
});

export default mainApi;
