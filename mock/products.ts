export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  delivery: string;
  image: string;
  flavour: string;
  category: "proteins" | "amino-acids";
};

// Temporary data source. Replace this module with an API client once the catalog endpoint is available.
export const products: Product[] = [
  { id: "light-whey-strawberry", name: "Сывороточный протеин", description: "Европейское сырьё, содержит пробиотик, со вкусом клубники, 21 г белка, 30 порций.", price: 1290, delivery: "2–3 дня", image: "/images/products/light-whey-strawberry.jpg", flavour: "Клубника", category: "proteins" },
  { id: "light-whey-plombir", name: "Сывороточный протеин", description: "Европейское сырьё, содержит пробиотик, со вкусом пломбира, 21 г белка, 30 порций.", price: 1290, delivery: "2–3 дня", image: "/images/products/light-whey-plombir.jpg", flavour: "Пломбир", category: "proteins" },
  { id: "light-whey-moccaccino", name: "Сывороточный протеин", description: "Европейское сырьё, содержит пробиотик, со вкусом моккачино, 21 г белка, 30 порций.", price: 1290, delivery: "2–3 дня", image: "/images/products/light-whey-moccaccino.jpg", flavour: "Моккачино", category: "proteins" },
  { id: "light-whey-chocolate", name: "Сывороточный протеин", description: "Европейское сырьё, содержит пробиотик, со вкусом шоколада, 21 г белка, 30 порций.", price: 1290, delivery: "2–3 дня", image: "/images/products/light-whey-chocolate.jpg", flavour: "Шоколад", category: "proteins" },
  { id: "bcaa-orange", name: "BCAA 2:1:1", description: "Оптимальный баланс аминокислот для восстановления, энергии и эффективных тренировок.", price: 1290, delivery: "2–3 дня", image: "/images/products/bcaa-orange.webp", flavour: "Апельсин", category: "amino-acids" },
  { id: "bcaa-pear", name: "BCAA 2:1:1", description: "Оптимальный баланс аминокислот для восстановления, энергии и эффективных тренировок.", price: 1290, delivery: "2–3 дня", image: "/images/products/bcaa-pear.webp", flavour: "Груша", category: "amino-acids" },
  { id: "bcaa-berries", name: "BCAA 2:1:1", description: "Оптимальный баланс аминокислот для восстановления, энергии и эффективных тренировок.", price: 1290, delivery: "2–3 дня", image: "/images/products/bcaa-berries.webp", flavour: "Лесные ягоды", category: "amino-acids" },
  { id: "bcaa-apple", name: "BCAA 2:1:1", description: "Оптимальный баланс аминокислот для восстановления, энергии и эффективных тренировок.", price: 1290, delivery: "2–3 дня", image: "/images/products/bcaa-apple.webp", flavour: "Яблоко", category: "amino-acids" },
];
