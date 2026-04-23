"use client";

import styled from "styled-components";
import { Badge, statusTone } from "./ui";
import { formatDate } from "@/lib/format";
import type { TradeDetail } from "@/lib/schemas";

const Wrap = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.xl};
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`;

const Id = styled.p`
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Title = styled.h1`
  margin: ${({ theme }) => `${theme.space.xs} 0 0`};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.weights.semibold};
`;

const Fields = styled.dl`
  margin: ${({ theme }) => `${theme.space.xl} 0 0`};
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.lg};
`;

const Field = styled.div`
  dt {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textFaint};
  }
  dd {
    margin: 4px 0 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

export function TradeMetadata({ trade }: { trade: TradeDetail }) {
  return (
    <Wrap>
      <Top>
        <div>
          <Id>{trade.trade_id}</Id>
          <Title>{trade.counterparty_name}</Title>
        </div>
        <Badge $tone={statusTone(trade.status)}>{trade.status}</Badge>
      </Top>
      <Fields>
        <Field>
          <dt>Product</dt>
          <dd>{trade.product_type}</dd>
        </Field>
        <Field>
          <dt>Notional</dt>
          <dd>{trade.notional_amount.toLocaleString("en-US")}</dd>
        </Field>
        <Field>
          <dt>Trade date</dt>
          <dd>{formatDate(trade.trade_date)}</dd>
        </Field>
        <Field>
          <dt>Maturity</dt>
          <dd>{formatDate(trade.maturity_date)}</dd>
        </Field>
      </Fields>
    </Wrap>
  );
}
