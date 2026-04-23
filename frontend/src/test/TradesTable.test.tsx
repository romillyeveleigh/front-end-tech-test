import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { TradesTable } from "@/components/TradesTable";
import { renderWithProviders } from "./helpers";
import type { Trade } from "@/lib/schemas";

function makeTrade(
  partial: Partial<Trade> & { id: string; status: Trade["status"] },
): Trade {
  return {
    id: partial.id,
    trade_id: partial.trade_id ?? partial.id,
    counterparty_name: partial.counterparty_name ?? "Acme Bank",
    status: partial.status,
    currency_code: partial.currency_code ?? "USD",
    notional_amount: partial.notional_amount ?? 1_000_000,
    trade_date: partial.trade_date ?? "2026-01-15",
    maturity_date: partial.maturity_date ?? null,
    product_type: partial.product_type ?? "Interest Rate Swap",
    has_notes: partial.has_notes ?? false,
  };
}

describe("TradesTable", () => {
  it("renders a row per trade with the trade id linked to the detail page", () => {
    const trades: Trade[] = [
      makeTrade({ id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", trade_id: "MW-1001", status: "dispute" }),
      makeTrade({ id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", trade_id: "MW-1002", status: "confirmed" }),
    ];
    renderWithProviders(<TradesTable trades={trades} />);

    expect(screen.getByRole("link", { name: "MW-1001" })).toHaveAttribute(
      "href",
      "/trades/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    );
    expect(screen.getByRole("link", { name: "MW-1002" })).toBeInTheDocument();
  });

  it("renders the trade status for each row", () => {
    const trades: Trade[] = [
      makeTrade({ id: "cccccccc-cccc-cccc-cccc-cccccccccccc", status: "dispute" }),
    ];
    renderWithProviders(<TradesTable trades={trades} />);
    expect(screen.getByText("dispute")).toBeInTheDocument();
  });
});
