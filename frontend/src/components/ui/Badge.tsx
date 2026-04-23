"use client";

import styled, { css } from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

type Tone = "neutral" | "warn" | "success" | "danger" | "muted";

const toneStyles = {
  neutral: css`
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  warn: css`
    background: ${({ theme }) => theme.colors.warnSoft};
    color: ${({ theme }) => theme.colors.warn};
    border-color: ${({ theme }) => theme.colors.warnSoft};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successSoft};
    color: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.successSoft};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.dangerSoft};
  `,
  muted: css`
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textMuted};
    border-color: ${({ theme }) => theme.colors.border};
  `,
};

export const Badge = styled.span<{ $tone?: Tone }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.weights.medium};
  text-transform: capitalize;

  ${({ $tone = "neutral" }) => toneStyles[$tone]}
`;

export function statusTone(status: TradeStatus): Tone {
  switch (status) {
    case "dispute":
      return "warn";
    case "submitted":
      return "neutral";
    case "confirmed":
      return "success";
    case "deleted":
      return "muted";
    case "error":
      return "danger";
  }
}
