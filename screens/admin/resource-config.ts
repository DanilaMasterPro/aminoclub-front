export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "file-list" | "certificate-list" | "tags";

export interface ResourceField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface ResourceConfig {
  title: string;
  singular: string;
  endpoint: string;
  createable?: boolean;
  editable?: boolean;
  searchable?: boolean;
  statusFilter?: Array<{ label: string; value: string }>;
  columns: Array<{ key: string; label: string }>;
  fields?: ResourceField[];
}

export const resourceConfigs: Record<string, ResourceConfig> = {
  products: {
    title: "Товары", singular: "товар", endpoint: "/admin/products", createable: true, editable: true, searchable: true,
    columns: [
      { key: "title", label: "Название" }, { key: "sku", label: "Артикул" },
      { key: "price", label: "Цена" }, { key: "stockQuantity", label: "Остаток" },
      { key: "isActive", label: "На сайте" },
    ],
    fields: [
      { name: "title", label: "Название", required: true }, { name: "slug", label: "Slug", required: true },
      { name: "sku", label: "Артикул", required: true }, { name: "categoryId", label: "ID категории", required: true },
      { name: "flavor", label: "Вкус" }, { name: "price", label: "Цена, ₽", type: "number", required: true },
      { name: "stockQuantity", label: "Остаток", type: "number", required: true },
      { name: "shortDescription", label: "Короткое описание", type: "textarea" },
      { name: "description", label: "Описание", type: "textarea", required: true },
      { name: "images", label: "Изображения", type: "file-list" },
      { name: "certificates", label: "Сертификаты качества", type: "certificate-list" },
      { name: "isActive", label: "Опубликован", type: "checkbox" },
      { name: "isPopular", label: "Популярный", type: "checkbox" },
      { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" },
      { name: "seoKeywords", label: "SEO keywords через запятую", type: "tags" },
    ],
  },
  categories: {
    title: "Категории", singular: "категорию", endpoint: "/admin/categories", createable: true, editable: true,
    columns: [{ key: "title", label: "Название" }, { key: "slug", label: "Slug" }, { key: "isActive", label: "Активна" }, { key: "_count.products", label: "Товаров" }],
    fields: [
      { name: "title", label: "Название", required: true }, { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Описание", type: "textarea" }, { name: "imageUrl", label: "Изображение" },
      { name: "isActive", label: "Активна", type: "checkbox" }, { name: "sortOrder", label: "Порядок", type: "number" },
      { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" },
      { name: "seoKeywords", label: "SEO keywords через запятую", type: "tags" },
    ],
  },
  orders: {
    title: "Заказы", singular: "заказ", endpoint: "/admin/orders", searchable: true, editable: true,
    statusFilter: ["NEW", "AWAITING_PAYMENT", "PAID", "PROCESSING", "PACKING", "SHIPPED", "COMPLETED", "CANCELLED"].map((value) => ({ label: value, value })),
    columns: [{ key: "number", label: "Номер" }, { key: "customerName", label: "Покупатель" }, { key: "finalAmount", label: "Сумма" }, { key: "status", label: "Статус" }, { key: "createdAt", label: "Дата" }],
    fields: [{ name: "adminComment", label: "Внутренний комментарий", type: "textarea" }],
  },
  trainers: {
    title: "Тренеры", singular: "тренера", endpoint: "/admin/trainers", searchable: true, editable: true,
    columns: [{ key: "name", label: "Имя" }, { key: "surname", label: "Фамилия" }, { key: "user.email", label: "Email" }, { key: "commissionRate", label: "%" }, { key: "status", label: "Статус" }],
    fields: [
      { name: "name", label: "Имя" }, { name: "surname", label: "Фамилия" }, { name: "phone", label: "Телефон" },
      { name: "city", label: "Город" }, { name: "socialLink", label: "Социальная сеть" },
      { name: "specialization", label: "Специализация" }, { name: "audienceSize", label: "Аудитория", type: "number" },
      { name: "commissionRate", label: "Вознаграждение, %", type: "number" },
    ],
  },
  "trainer-applications": {
    title: "Заявки тренеров", singular: "заявку", endpoint: "/admin/trainer-applications",
    statusFilter: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"].map((value) => ({ label: value, value })),
    columns: [{ key: "name", label: "Имя" }, { key: "surname", label: "Фамилия" }, { key: "email", label: "Email" }, { key: "specialization", label: "Специализация" }, { key: "status", label: "Статус" }],
  },
  "promo-codes": {
    title: "Промокоды", singular: "промокод", endpoint: "/admin/promo-codes", createable: true, editable: true,
    columns: [{ key: "code", label: "Код" }, { key: "type", label: "Тип" }, { key: "value", label: "Скидка" }, { key: "usageCount", label: "Использований" }, { key: "isActive", label: "Активен" }],
    fields: [
      { name: "code", label: "Код", required: true }, { name: "type", label: "Тип", type: "select", required: true, options: [{ label: "Процент", value: "PERCENT" }, { label: "Фиксированная", value: "FIXED" }] },
      { name: "value", label: "Размер скидки", type: "number", required: true }, { name: "trainerId", label: "ID тренера" },
      { name: "usageLimit", label: "Лимит использований", type: "number" }, { name: "validUntil", label: "Действует до", type: "date" },
      { name: "isActive", label: "Активен", type: "checkbox" },
    ],
  },
  pages: {
    title: "Страницы", singular: "страницу", endpoint: "/admin/pages", createable: true, editable: true,
    columns: [{ key: "title", label: "Название" }, { key: "slug", label: "Slug" }, { key: "status", label: "Статус" }, { key: "updatedAt", label: "Обновлена" }],
    fields: [
      { name: "title", label: "Название", required: true }, { name: "slug", label: "Slug", required: true },
      { name: "heading", label: "Заголовок", required: true }, { name: "content", label: "Содержимое", type: "textarea", required: true },
      { name: "status", label: "Статус", type: "select", options: [{ label: "Черновик", value: "DRAFT" }, { label: "Опубликована", value: "PUBLISHED" }, { label: "Архив", value: "ARCHIVED" }] },
      { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description", type: "textarea" },
      { name: "seoKeywords", label: "SEO keywords через запятую", type: "tags" },
    ],
  },
  articles: {
    title: "Новости", singular: "новость", endpoint: "/admin/articles", createable: true, editable: true,
    columns: [{ key: "title", label: "Заголовок" }, { key: "slug", label: "Slug" }, { key: "status", label: "Статус" }, { key: "publishedAt", label: "Публикация" }],
    fields: [
      { name: "title", label: "Заголовок", required: true }, { name: "slug", label: "Slug", required: true },
      { name: "excerpt", label: "Анонс", type: "textarea" }, { name: "content", label: "Содержимое", type: "textarea", required: true },
      { name: "coverImageUrl", label: "Обложка" },
      { name: "status", label: "Статус", type: "select", options: [{ label: "Черновик", value: "DRAFT" }, { label: "Опубликована", value: "PUBLISHED" }, { label: "Архив", value: "ARCHIVED" }] },
      { name: "seoKeywords", label: "SEO keywords через запятую", type: "tags" },
    ],
  },
  banners: {
    title: "Баннеры", singular: "баннер", endpoint: "/admin/banners", createable: true, editable: true,
    columns: [{ key: "title", label: "Название" }, { key: "placement", label: "Расположение" }, { key: "sortOrder", label: "Порядок" }, { key: "isActive", label: "Активен" }],
    fields: [
      { name: "title", label: "Название", required: true }, { name: "imageUrl", label: "Изображение", required: true },
      { name: "mobileImageUrl", label: "Мобильное изображение" }, { name: "linkUrl", label: "Ссылка" },
      { name: "placement", label: "Расположение" }, { name: "sortOrder", label: "Порядок", type: "number" },
      { name: "isActive", label: "Активен", type: "checkbox" },
    ],
  },
  payouts: {
    title: "Заявки на выплату", singular: "заявку", endpoint: "/admin/payouts",
    statusFilter: ["REVIEW", "PROCESSING", "PAID", "REJECTED"].map((value) => ({ label: value, value })),
    columns: [{ key: "trainer.name", label: "Тренер" }, { key: "amount", label: "Сумма" }, { key: "accountHint", label: "Реквизиты" }, { key: "status", label: "Статус" }, { key: "createdAt", label: "Дата" }],
  },
};
