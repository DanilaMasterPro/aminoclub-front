export const orderStatusLabels: Record<string, string> = {
  NEW: "Новый",
  AWAITING_PAYMENT: "Ожидает оплаты",
  PAID: "Оплачен",
  PROCESSING: "В обработке",
  PACKING: "Собирается",
  SHIPPED: "Передан в доставку",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Ожидает оплаты",
  WAITING_FOR_CAPTURE: "Ожидает подтверждения",
  SUCCEEDED: "Оплачен",
  CANCELED: "Отменён",
};

export const shipmentStatusLabels: Record<string, string> = {
  PENDING: "Заявка не создана",
  CREATED: "Заявка создана",
  IN_TRANSIT: "В пути",
  READY_FOR_PICKUP: "Ждёт в пункте выдачи",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
  RETURNED: "Возврат",
  FAILED: "Ошибка",
};

export const receiptStatusLabels: Record<string, string> = {
  PENDING: "Ожидает отправки",
  SENT: "Отправлен в кассу",
  DONE: "Пробит",
  FAILED: "Ошибка",
  SKIPPED: "Не отправлялся",
};
