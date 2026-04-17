import React from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
};

type ButtonAsLink = BaseProps & {
  as: 'link';
  to: string;
  replace?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type ButtonAsAnchor = BaseProps & {
  as: 'a';
  href: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--kt-brand)] text-[var(--kt-brand-on)] hover:bg-[var(--kt-brand-hover)] shadow-[var(--kt-shadow-sm)]',
  secondary:
    'bg-[var(--kt-surface)] text-[var(--kt-ink)] border border-[var(--kt-border)] hover:bg-[var(--kt-surface-muted)]',
  ghost:
    'bg-transparent text-[var(--kt-ink)] hover:bg-[var(--kt-surface-muted)]',
  danger:
    'bg-[var(--kt-accent-danger)] text-[var(--kt-brand-on)] hover:brightness-95 shadow-[var(--kt-shadow-sm)]'
};

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kt-surface-page)] disabled:cursor-not-allowed disabled:opacity-60';

const buildClassName = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string
) =>
  [
    baseClass,
    sizeClass[size],
    variantClass[variant],
    fullWidth ? 'w-full' : '',
    extra ?? ''
  ]
    .filter(Boolean)
    .join(' ');

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    iconStart,
    iconEnd,
    children,
    className
  } = props;
  const classes = buildClassName(variant, size, fullWidth, className);
  const content = (
    <>
      {iconStart}
      <span>{children}</span>
      {iconEnd}
    </>
  );

  if (props.as === 'link') {
    const { to, replace, onClick } = props;
    return (
      <Link to={to} replace={replace} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { href, target, rel, onClick } = props;
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }

  const {
    as: _ignored,
    variant: _v,
    size: _s,
    fullWidth: _fw,
    iconStart: _is,
    iconEnd: _ie,
    children: _c,
    className: _cls,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
};
