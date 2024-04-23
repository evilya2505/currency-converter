import { DECIMAL_PRECISION } from "./constants";

export function convert(
  amountFrom: number,
  amountTo: number,
  currencyFrom: string,
  currencyTo: string,
  rates: Record<string, number>,
  changedField: string
): string {
  let rate: number | null = null;
  let result: number | null = null;

  switch (changedField) {
    case "currencyCodeFrom":
    case "amountFrom":
      rate = rates[currencyTo];
      result = amountFrom * rate;
      break;
    case "currencyCodeTo":
      rate = rates[currencyFrom];
      result = amountFrom / rate;
      break;
    case "amountTo":
      rate = rates[currencyTo];
      result = amountTo / rate;
      break;
    default:
      result = null;
      break;
  }

  return result !== null ? result.toFixed(DECIMAL_PRECISION) : "";
}

export function formatField(text: string): string {
  if (text.startsWith(".") || text.startsWith(",")) {
    text = "0" + text;
  }
  return text.replace(/[^0-9.,]/g, "");
}
