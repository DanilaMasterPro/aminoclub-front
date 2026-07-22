import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "light";
};

type LinkButtonProps = CommonProps &
  { href: string } &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;

type NativeButtonProps = CommonProps &
  { href?: never } &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | "href">;

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const { children, className = "", variant = "primary" } = props;
  const variants = {
    primary: "border-transparent bg-[#009d0a] text-white",
    outline: "border-[#009d0a] bg-transparent text-[#161a1b]",
    light: "border-transparent bg-white text-[#171b1c]",
  };
  const classes = `inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-5 py-2 text-sm leading-none font-medium transition duration-200 hover:-translate-y-px ${variants[variant]} ${className}`;

  if (props.href) {
    const { children: linkChildren, className: _className, variant: _variant, href, ...anchorProps } = props;
    return (
      <a className={classes} href={href} {...anchorProps}>
        {linkChildren}
      </a>
    );
  }

  const { children: buttonChildren, className: _className, variant: _variant, href: _href, ...buttonProps } = props;
  return (
    <button className={classes} type="button" {...buttonProps}>
      {buttonChildren}
    </button>
  );
}
