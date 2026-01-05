'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles = {
    primary: `
    bg-gradient-to-r from-purple to-purple-light
    hover:from-purple-light hover:to-purple
    text-white font-semibold
    shadow-lg hover:shadow-[0_0_30px_rgba(138,43,226,0.5)]
    border border-purple/50
  `,
    secondary: `
    bg-[var(--zz-bg-card)]
    hover:bg-[var(--zz-bg-elevated)]
    text-white font-medium
    border border-white/10 hover:border-purple/50
  `,
    ghost: `
    bg-transparent
    hover:bg-white/5
    text-text-secondary hover:text-white
    border border-transparent hover:border-white/10
  `,
    danger: `
    bg-red-600 hover:bg-red-700
    text-white font-semibold
    border border-red-500/50
  `,
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
    md: 'px-6 py-3 text-base rounded-xl gap-2',
    lg: 'px-8 py-4 text-lg rounded-xl gap-2.5',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <motion.button
            className={`
        inline-flex items-center justify-center
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || isLoading}
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
}

// Icon Button variant
interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    'aria-label': string;
}

const iconSizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
};

export function IconButton({
    icon,
    variant = 'ghost',
    size = 'md',
    className = '',
    ...props
}: IconButtonProps) {
    return (
        <motion.button
            className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${className}
      `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {icon}
        </motion.button>
    );
}
