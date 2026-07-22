"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { reviews } from "@/mock/reviews";

const avatarClasses = {
  gray: "bg-[radial-gradient(circle_at_30%_30%,#d6d6d6,#35363a)]",
  pink: "bg-[radial-gradient(circle_at_65%_30%,#ff9fbd,#8c0060_58%,#075079)]",
  dark: "bg-[radial-gradient(circle_at_50%_40%,#d7d7d7,#353535)]",
  green: "bg-[radial-gradient(circle_at_35%_30%,#d7f2b5,#24713a_65%,#10331f)]",
};

export default function Testimonials() {
  return (
    <section className="relative" aria-label="Отзывы покупателей">
      <Swiper
        spaceBetween={34}
        slidesPerView={1}
        breakpoints={{ 700: { slidesPerView: 2, spaceBetween: 24 }, 1100: { slidesPerView: 2.75, spaceBetween: 34 } }}
        className="pb-12"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="h-auto">
            <article className="grid h-full min-h-[318px] grid-cols-[70px_1fr] gap-x-[22px] rounded-[22px] bg-[#f8f8f8] px-12 py-[42px] max-[600px]:min-h-0 max-[600px]:p-7">
              <div className={`size-[70px] rounded-full ${avatarClasses[review.avatar]}`} aria-hidden="true" />
              <div><h2 className="mt-[5px] mb-2 text-[22px] font-medium">{review.name}</h2><div className="text-[27px] tracking-[3px] text-[#ffad15]">★★★★★</div></div>
              <p className="col-span-full mt-[34px] min-h-[3.9em] line-clamp-3 text-[clamp(16px,1.3vw,24px)] leading-[1.3]">{review.text}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
