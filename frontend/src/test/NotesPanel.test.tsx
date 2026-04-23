import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NotesPanel } from "@/components/NotesPanel";
import { renderWithProviders } from "./helpers";

describe("NotesPanel", () => {
  it("hides the submission form for non-break statuses", () => {
    renderWithProviders(
      <NotesPanel
        tradeId="00000000-0000-0000-0000-000000000000"
        status="confirmed"
        notes={[]}
      />,
    );
    expect(screen.queryByLabelText(/add a note/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/notes can be added once this trade/i),
    ).toBeInTheDocument();
  });

  it("shows the submission form when the trade is in dispute", () => {
    renderWithProviders(
      <NotesPanel
        tradeId="00000000-0000-0000-0000-000000000000"
        status="dispute"
        notes={[]}
      />,
    );
    expect(screen.getByLabelText(/add a note/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save note/i }),
    ).toBeInTheDocument();
  });
});
