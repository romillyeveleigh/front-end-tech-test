"use client";

import styled from "styled-components";
import Link from "next/link";
import { Badge, statusTone } from "./ui";
import { formatDate } from "@/lib/format";
import type { Trade } from "@/lib/schemas";

const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  thead {
    background: ${({ theme }) => theme.colors.bg};
    text-align: left;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }

  th,
  td {
    padding: ${({ theme }) =>
      `${theme.space.md} ${theme.space.lg}`};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.bg};
  }

  .subject {
    min-width: 320px;
  }
`;

const TradeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface TradesTableProps {
  trades: Trade[];
}

export function TradesTable({ trades }: TradesTableProps) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>Trade ID</th>
            <th>Counterparty</th>
            <th>Product</th>
            <th>Notional</th>
            <th>Trade date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.id}>
              <td>
                <TradeLink href={`/trades/${t.id}`}>{t.trade_id}</TradeLink>
              </td>
              <td>{t.counterparty_name}</td>
              <td>{t.product_type}</td>
              <td>
                {t.currency_code} {t.notional_amount.toFixed(2)}
              </td>
              <td>{formatDate(t.trade_date)}</td>
              <td>
                <Badge $tone={statusTone(t.status)}>{t.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}
