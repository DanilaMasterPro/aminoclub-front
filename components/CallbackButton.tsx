"use client";

import { useCallback, useState } from "react";
import Button from "@/components/Button";
import CallbackModal from "@/components/CallbackModal";

export default function CallbackButton({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <>
      <Button label="Обратная связь" onClick={() => setIsOpen(true)} className={className} />
      <CallbackModal isOpen={isOpen} onClose={close} />
    </>
  );
}
