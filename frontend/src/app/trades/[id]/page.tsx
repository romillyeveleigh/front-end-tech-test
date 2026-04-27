"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useGetTradeQuery } from "@/lib/api/tradesApi";
import { TradeMetadata } from "@/components/TradeMetadata";
import { EmailsPanel } from "@/components/EmailsPanel";
import { NotesPanel } from "@/components/NotesPanel";
import { ComposerDrawer } from "@/components/ComposerDrawer";

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
  const [composerOpen, setComposerOpen] = useState(false);

  // #region agent log
  useEffect(() => {
    if (!query.data) return;
    fetch("http://127.0.0.1:7937/ingest/cec45640-9a6b-4b35-a7ab-d9666d837ff9", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "bbfb5f",
      },
      body: JSON.stringify({
        sessionId: "bbfb5f",
        location: "trades/[id]/page.tsx:useEffect",
        message: "getTrade snapshot",
        data: {
          queryId: id,
          dataTradeId: query.data.id,
          notesCount: query.data.notes.length,
          isFetching: query.isFetching,
          fulfilledTimeStamp: query.fulfilledTimeStamp,
        },
        timestamp: Date.now(),
        hypothesisId: "A",
        runId: "verify-cache",
      }),
    }).catch(() => {});
  }, [
    id,
    query.data,
    query.data?.notes.length,
    query.isFetching,
    query.fulfilledTimeStamp,
  ]);
  // #endregion

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
        <EmailsPanel
          emails={trade.emails}
          status={trade.status}
          onCompose={() => setComposerOpen(true)}
        />
        <NotesPanel
          tradeId={trade.id}
          status={trade.status}
          notes={trade.notes}
        />
      </Grid>
      {composerOpen ? (
        <ComposerDrawer
          trade={trade}
          onClose={() => setComposerOpen(false)}
        />
      ) : null}
    </div>
  );
}
