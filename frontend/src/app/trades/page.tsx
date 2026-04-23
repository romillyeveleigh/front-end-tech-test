"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useListTradesQuery } from "@/lib/api/tradesApi";
import { TradeStatusSchema, type TradeStatus } from "@/lib/schemas";
import { StatusFilter } from "@/components/StatusFilter";
import { TradesTable } from "@/components/TradesTable";
import { EmptyState, Spinner } from "@/components/ui";

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.lg};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  p {
    margin: 4px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const FilterRow = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

function parseStatuses(raw: string[]): TradeStatus[] {
  return raw.flatMap((s) => {
    const parsed = TradeStatusSchema.safeParse(s);
    return parsed.success ? [parsed.data] : [];
  });
}

export default function TradesPage() {
  return (
    <Suspense
      fallback={
        <LoadingRow>
          <Spinner /> Loading…
        </LoadingRow>
      }
    >
      <TradesPageInner />
    </Suspense>
  );
}

function TradesPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const statuses = parseStatuses(params.getAll("status"));

  const query = useListTradesQuery(
    statuses.length > 0 ? statuses : undefined,
  );
  const trades = query.data ?? [];

  const counts = useMemo(() => {
    const acc: Record<TradeStatus, number> = {
      dispute: 0,
      submitted: 0,
      confirmed: 0,
      deleted: 0,
      error: 0,
    };
    for (const t of trades) acc[t.status] += 1;
    return acc;
  }, [trades]);

  const setStatuses = (next: TradeStatus[]) => {
    const sp = new URLSearchParams();
    next.forEach((s) => sp.append("status", s));
    const qs = sp.toString();
    router.replace(qs ? `/trades?${qs}` : "/trades");
  };

  return (
    <div>
      <Header>
        <div>
          <h1>Trades</h1>
        </div>
      </Header>

      <FilterRow>
        <StatusFilter
          selected={statuses}
          counts={counts}
          onChange={setStatuses}
        />
      </FilterRow>

      {query.isLoading ? (
        <LoadingRow>
          <Spinner /> Loading trades…
        </LoadingRow>
      ) : query.isError ? (
        <EmptyState
          title="Failed to load trades"
          description="Check the API is running on http://localhost:8000."
        />
      ) : (
        <TradesTable trades={trades} />
      )}
    </div>
  );
}
