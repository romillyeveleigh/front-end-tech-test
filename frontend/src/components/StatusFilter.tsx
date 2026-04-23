"use client";

import styled from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

const ALL_STATUSES: TradeStatus[] = [
  "dispute",
  "submitted",
  "confirmed",
  "deleted",
  "error",
];

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`;

const Chip = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentSoft : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.weights.medium};
  text-transform: capitalize;
  cursor: pointer;
  user-select: none;

  .count {
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

interface StatusFilterProps {
  selected: TradeStatus[];
  counts: Record<TradeStatus, number>;
  onChange: (next: TradeStatus[]) => void;
}

export function StatusFilter({
  selected,
  counts,
  onChange,
}: StatusFilterProps) {
  const toggle = (s: TradeStatus) => {
    if (selected.includes(s)) {
      onChange(selected.filter((x) => x !== s));
    } else {
      onChange([...selected, s]);
    }
  };

  return (
    <Row>
      {ALL_STATUSES.map((s) => (
        <Chip
          key={s}
          $active={selected.includes(s)}
          onClick={() => toggle(s)}
        >
          <span>{s}</span>
          <span className="count">{counts[s] ?? 0}</span>
        </Chip>
      ))}
    </Row>
  );
}
