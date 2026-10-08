"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option<T extends string> = { value: T; label: string };

type SelectMenuProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/**
 * Dropdown in the site style (a native <select> cannot be styled on Windows/Chrome).
 * Keyboard: ↑/↓ to move, Enter/Space to choose, Esc or a click outside to close.
 */
export default function SelectMenu<T extends string>({ value, options, onChange, label, className = "" }: SelectMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  const open = () => {
    setHighlighted(Math.max(0, options.findIndex((option) => option.value === value)));
    setIsOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { setIsOpen(false); return; }
    if (!isOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); open(); return; }
    if (!isOpen) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setHighlighted((index) => Math.min(options.length - 1, index + 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setHighlighted((index) => Math.max(0, index - 1)); }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(highlighted); }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label}: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`inline-flex h-11 cursor-pointer items-center gap-3 rounded-full bg-white pr-4 pl-5 text-sm whitespace-nowrap text-[#15191a] shadow-[0_3px_15px_rgba(0,0,0,.06)] transition hover:shadow-[0_6px_20px_rgba(0,0,0,.1)] ${isOpen ? "ring-2 ring-[#009d0a]/30" : ""}`}
      >
        {current.label}
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={`size-4 text-[#6d7271] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-full right-0 z-30 mt-2 min-w-full rounded-2xl bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,.12)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-6 rounded-xl px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${index === highlighted ? "bg-[#f5f3ed]" : ""} ${isSelected ? "font-medium text-[#009d0a]" : "text-[#15191a]"}`}
              >
                {option.label}
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={`size-4 ${isSelected ? "opacity-100" : "opacity-0"}`}>
                  <path d="m4.5 10.5 3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
