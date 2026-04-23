"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button, Panel, EmptyState } from "./ui";
import { useSubmitNoteMutation } from "@/lib/api/tradesApi";
import { formatDateTime } from "@/lib/format";
import { BREAK_STATUSES, type Note, type TradeStatus } from "@/lib/schemas";

const List = styled.ol`
  margin: 0 0 ${({ theme }) => theme.space.lg};
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) =>
    `${theme.space.md} ${theme.space.lg}`};

  p {
    margin: 0;
    white-space: pre-wrap;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  time {
    display: block;
    margin-top: 4px;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};

  label {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  textarea {
    width: 100%;
    min-height: 80px;
    padding: ${({ theme }) =>
      `${theme.space.sm} ${theme.space.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface};
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.md};
    resize: vertical;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .count {
      font-size: ${({ theme }) => theme.fontSizes.xs};
      color: ${({ theme }) => theme.colors.textFaint};
    }
  }

  .error {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.danger};
  }
`;

interface NotesPanelProps {
  tradeId: string;
  status: TradeStatus;
  notes: Note[];
}

export function NotesPanel({ tradeId, status, notes }: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [submitNote, { isLoading, error }] = useSubmitNoteMutation();

  const canSubmit = BREAK_STATUSES.has(status);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    submitNote({ tradeId, content: draft }).then((result) => {
      if (!("error" in result)) {
        setDraft("");
      }
    });
  };

  return (
    <Panel title={`Notes (${notes.length})`}>
      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description={
            canSubmit
              ? "Add the first note to help inform future agentic processes."
              : "Notes can be added once this trade enters a break status."
          }
        />
      ) : (
        <List>
          {notes.map((n) => (
            <Item key={n.id}>
              <p>{n.content}</p>
              <time dateTime={n.created_at}>
                {formatDateTime(n.created_at)}
              </time>
            </Item>
          ))}
        </List>
      )}

      {canSubmit ? (
        <Form onSubmit={onSubmit}>
          <label htmlFor="note">Add a note</label>
          <textarea
            id="note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note…"
            maxLength={500}
          />
          <div className="row">
            <span className="count">{draft.length} / 500</span>
            <Button type="submit">Save note</Button>
          </div>
          {error ? (
            <p className="error">
              {"status" in error
                ? `Request failed (${error.status}).`
                : "Something went wrong. Please try again."}
            </p>
          ) : null}
          {isLoading ? null : null}
        </Form>
      ) : null}
    </Panel>
  );
}
