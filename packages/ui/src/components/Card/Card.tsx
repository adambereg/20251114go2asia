import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = true, children, ...props }, ref) => {
    // Border убран из базовых стилей для единообразия изображений
    // Border можно добавить через className если нужно: "border-2 border-slate-200"
    const baseStyles = 'bg-white rounded-xl shadow-sm transition-all';
    const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-0.5' : '';
    const combinedClassName = `${baseStyles} ${hoverStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={className}>{children}</div>;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={className}>{children}</div>;
}
