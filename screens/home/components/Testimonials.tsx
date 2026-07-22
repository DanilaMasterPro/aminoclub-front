"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { reviews } from "@/mock/reviews";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section className="relative" aria-label="Отзывы покупателей">
      <Swiper
        spaceBetween={34}
        slidesPerView={1}
        breakpoints={{ 700: { slidesPerView: 2, spaceBetween: 24 }, 1100: { slidesPerView: 2.75, spaceBetween: 34 } }}
        className="pb-12"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={review.id} className="h-auto">
            <TestimonialCard review={review} animationDelay={index * 0.08} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
