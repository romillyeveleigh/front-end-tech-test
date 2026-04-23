"use client";

import { use } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useGetTradeQuery } from "@/lib/api/tradesApi";
import { TradeMetadata } from "@/components/TradeMetadata";
import { EmailsPanel } from "@/components/EmailsPanel";
import { NotesPanel } from "@/components/NotesPanel";

const Back = styled(Link)`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
  margin-top: ${({ theme }) => theme.space.xl};

  > section {
    flex: 1;
  }
`;

export default function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const query = useGetTradeQuery(id);

  if (query.isLoading) {
    return <div>loading...</div>;
  }

  if (query.isError || !query.data) {
    return null;
  }

  const trade = query.data;

  return (
    <div>
      <Back href="/trades">← Back to trades</Back>
      <TradeMetadata trade={trade} />
      <Grid>
        <EmailsPanel emails={trade.emails} />
        <NotesPanel
          tradeId={trade.id}
          status={trade.status}
          notes={trade.notes}
        />
      </Grid>
    </div>
  );
}
