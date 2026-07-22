import type { Review } from "@/mock/reviews";

const avatarClasses = {
  gray: "bg-[radial-gradient(circle_at_30%_30%,#d6d6d6,#35363a)]",
  pink: "bg-[radial-gradient(circle_at_65%_30%,#ff9fbd,#8c0060_58%,#075079)]",
  dark: "bg-[radial-gradient(circle_at_50%_40%,#d7d7d7,#353535)]",
  green: "bg-[radial-gradient(circle_at_35%_30%,#d7f2b5,#24713a_65%,#10331f)]",
};

type TestimonialCardProps = {
  review: Review;
  animationDelay?: number;
};

export default function TestimonialCard({ review, animationDelay = 0 }: TestimonialCardProps) {
  return (
    <article data-fade-up data-fade-up-delay={animationDelay} className="grid h-full min-h-[318px] grid-cols-[70px_1fr] gap-x-[22px] rounded-[22px] bg-[#f8f8f8] px-12 py-[42px] max-[600px]:min-h-0 max-[600px]:p-7">
      <div className={`size-[70px] rounded-full ${avatarClasses[review.avatar]}`} aria-hidden="true" />
      <div className="flex h-[70px] flex-col justify-center gap-1">
        <h2 className="m-0 text-[22px] leading-none font-medium">{review.name}</h2>
        <div className="text-[27px] leading-none tracking-[3px] text-[#ffad15]" aria-label="Оценка: 5 из 5">
          ★★★★★
        </div>
      </div>
      <p className="col-span-full mt-[22px] min-h-[3.9em] line-clamp-3 text-2xl leading-[1.3] max-[850px]:text-base">{review.text}</p>
    </article>
  );
}
