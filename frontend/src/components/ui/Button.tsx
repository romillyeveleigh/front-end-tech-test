"use client";

import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface StyleProps {
  $variant?: Variant;
  $size?: Size;
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.accent};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentHover};
      border-color: ${({ theme }) => theme.colors.accentHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bg};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bg};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.danger};
    &:hover:not(:disabled) {
      filter: brightness(0.92);
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    padding: 8px 16px;
    font-size: ${({ theme }) => theme.fontSizes.md};
  `,
};

export const Button = styled.button.attrs<StyleProps>(({ type }) => ({
  type: type ?? "button",
}))<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.weights.medium};
  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $variant = "primary" }) => variantStyles[$variant]}
  ${({ $size = "md" }) => sizeStyles[$size]}
`;
