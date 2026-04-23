import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  NoteSchema,
  TradeDetailSchema,
  TradeListSchema,
  type Note,
  type TradeDetail,
  type Trade,
  type TradeStatus,
} from "../schemas";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export const tradesApi = createApi({
  reducerPath: "tradesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Trades", "Trade"],
  endpoints: (build) => ({
    listTrades: build.query<Trade[], TradeStatus[] | undefined>({
      query: (statuses) => {
        if (!statuses || statuses.length === 0) return "/api/trades";
        const params = new URLSearchParams();
        for (const s of statuses) params.append("status", s);
        return `/api/trades?${params.toString()}`;
      },
      transformResponse: (raw: unknown) => TradeListSchema.parse(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: "Trade" as const, id: t.id })),
              { type: "Trades" as const, id: "LIST" },
            ]
          : [{ type: "Trades" as const, id: "LIST" }],
    }),
    getTrade: build.query<TradeDetail, string>({
      query: (id) => `/api/trades/${id}`,
      transformResponse: (raw: unknown) => TradeDetailSchema.parse(raw),
      providesTags: (_result, _err, id) => [{ type: "Trade", id }],
    }),
    submitNote: build.mutation<
      Note,
      { tradeId: string; content: string }
    >({
      query: ({ tradeId, content }) => ({
        url: `/api/trades/${tradeId}/notes`,
        method: "POST",
        body: { content },
      }),
      transformResponse: (raw: unknown) => NoteSchema.parse(raw),
      invalidatesTags: ["Trades"],
    }),
  }),
});

export const {
  useListTradesQuery,
  useGetTradeQuery,
  useSubmitNoteMutation,
} = tradesApi;
