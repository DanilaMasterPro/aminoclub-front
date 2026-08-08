import type { CmsArticle } from "@/api/types";

const copy = `
  <h2>Сила строится из последовательности</h2>
  <p>Прогресс редко бывает результатом одного идеального решения. Он складывается из тренировок, восстановления, питания и привычек, которые легко повторять каждый день.</p>
  <p>Начните с понятной цели, выберите измеримый ориентир и оставьте в программе только те действия, которые действительно помогают двигаться вперёд.</p>
  <img src="/images/about.png" alt="Спортсменка после тренировки" />
  <h2>Поддерживайте темп</h2>
  <p>Регулярность важнее резких рывков. Следите за самочувствием, корректируйте нагрузку и давайте организму достаточно времени на восстановление.</p>
  <p>Спортивное питание дополняет рацион, но не заменяет разнообразное питание и продуманную тренировочную программу.</p>
`;

const sources = [
  ["Как поддерживать прогресс и не выгорать", "/images/affiliate-hero-v1.png"],
  ["Силовые тренировки: база для уверенного старта", "/images/CAT.png"],
  ["Восстановление после интенсивной нагрузки", "/images/about.png"],
  ["Когда и зачем нужен протеин", "/images/hero-mobile-v1.png"],
  ["Аминокислоты в ежедневном рационе", "/images/hero-v2.png"],
  ["Как выстроить режим питания", "/images/cta-mobile-v1.png"],
  ["Маленькие привычки для большого результата", "/images/hero-v3.png"],
  ["Баланс нагрузки и отдыха", "/images/cta-mobile-v2.png"],
] as const;

export const mockArticles: CmsArticle[] = sources.map(([title, coverImageUrl], index) => ({
  id: `mock-${index + 1}`,
  title,
  slug: index === 0 ? "support-your-progress" : `article-${index + 1}`,
  excerpt: "Практические советы о тренировках, питании и восстановлении без лишней сложности.",
  content: copy,
  coverImageUrl,
  seoTitle: null,
  seoDescription: null,
  seoKeywords: [],
  status: "PUBLISHED",
  publishedAt: new Date(2026, 6, index + 1).toISOString(),
  createdAt: new Date(2026, 6, index + 1).toISOString(),
  updatedAt: new Date(2026, 6, index + 1).toISOString(),
}));

export function getMockArticle(slug: string) {
  return mockArticles.find((article) => article.slug === slug) ?? null;
}
