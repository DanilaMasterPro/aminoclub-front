import Image from "next/image";

type ButtonProps = {
  label: string;
  href?: string;
  variant?: "primary" | "outline" | "light";
  icon?: "cart";
  showArrow?: boolean;
  className?: string;
};

const variants = {
  primary: "border-transparent bg-[#009d0a] text-white",
  outline: "border-[#009d0a] bg-transparent text-[#161a1b]",
  light: "border-transparent bg-white text-[#171b1c]",
};

export default function Button({ label, href, variant = "primary", icon, showArrow = false, className = "" }: ButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 px-5 py-2 text-sm leading-none font-semibold transition duration-200 hover:-translate-y-px ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon === "cart" && <Image className="brightness-0 invert" src="/icons/cart.svg" alt="" width={20} height={20} />}
      {label}
      {showArrow && (
        <span className="grid size-12 place-items-center rounded-full bg-[#009d0a] relative left-4" aria-hidden="true">
          <Image src="/icons/arrow-up-right.svg" alt="" width={12} height={13} />
        </span>
      )}
    </>
  );

  if (href)
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );

  return (
    <button className={classes} type="button">
      {content}
    </button>
  );
}
