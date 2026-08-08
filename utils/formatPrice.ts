export function formatPrice(value: number | string) {
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
}
