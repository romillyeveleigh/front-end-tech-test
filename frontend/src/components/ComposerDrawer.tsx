"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Spinner } from "./ui";
import { useSubmitNoteMutation } from "@/lib/api/tradesApi";
import type { Email, TradeDetail } from "@/lib/schemas";
import { formatDateTime } from "@/lib/format";

const CURRENT_USER = "trader@hedgefund.com";
const REPLY_NOTE_PREFIX = "[Reply sent]";
// Mirrors backend NoteCreate.content max_length in src/models.py.
const MAX_NOTE_LENGTH = 500;
const LOW_BODY_BUDGET = 50;

interface ComposerDrawerProps {
  trade: TradeDetail;
  onClose: () => void;
  onSent?: () => void;
}

export function ComposerDrawer({ trade, onClose, onSent }: ComposerDrawerProps) {
  const emails = trade.emails;
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(
    `[${trade.trade_id}] ${trade.counterparty_name} — `,
  );
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [submitNote, { isLoading }] = useSubmitNoteMutation();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Capture the element that opened the drawer so we can return focus on close.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    bodyRef.current?.focus();

    // Lock body scroll while the drawer is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, []);

  function validateEmails(s: string) {
    if (!s.trim()) return true;
    return s
      .split(",")
      .map((p) => p.trim())
      .every((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));
  }

  const buildNoteContent = (bodyText: string): string =>
    [
      `${REPLY_NOTE_PREFIX} ${formatDateTime(new Date().toISOString())}`,
      `From: ${CURRENT_USER}`,
      `To:   ${to}`,
      cc ? `Cc:   ${cc}` : null,
      `Subject: ${subject}`,
      "", // blank-line separator before body — must survive the filter
      bodyText,
    ]
      .filter((l) => l !== null)
      .join("\n");

  const headerLen = buildNoteContent("").length;
  const bodyMax = Math.max(0, MAX_NOTE_LENGTH - headerLen);

  const budgetError =
    bodyMax === 0
      ? "Recipients/subject already use the full message budget. Shorten them to add a body."
      : null;
  const displayError = budgetError ?? error;

  async function send() {
    if (isLoading) return;
    setError(null);
    if (!to.trim()) return setError("Enter at least one recipient.");
    if (!validateEmails(to) || !validateEmails(cc))
      return setError("One of the addresses doesn't look valid.");
    if (!subject.trim()) return setError("Subject is required.");
    if (!body.trim()) return setError("Message body can't be empty.");

    const noteContent = buildNoteContent(body);
    if (noteContent.length > MAX_NOTE_LENGTH) {
      return setError("Message is too long. Shorten the body or recipients.");
    }

    const result = await submitNote({
      tradeId: trade.id,
      content: noteContent,
    });
    if ("error" in result) {
      setError("Couldn't log the message. Try again.");
      return;
    }
    onSent?.();
    onClose();
  }

  // Guard against accidentally discarding a draft. Confirm only when there's
  // user-typed content — the prefilled subject doesn't count.
  function requestClose() {
    if (body.trim() || to.trim() || cc.trim()) {
      if (!window.confirm("Discard this draft?")) return;
    }
    onClose();
  }

  function onKey(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void send();
    }
  }

  // Escape closes from anywhere in the document, not only when focus is
  // inside the drawer (e.g. user has tabbed out). Goes through requestClose
  // so an in-progress draft isn't silently lost.
  useEffect(() => {
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        requestClose();
      }
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
    // requestClose closes over the latest draft state; re-bind each render.
  });

  return (
    <>
      <Overlay onClick={requestClose} aria-hidden />
      <Aside
        role="dialog"
        aria-modal="true"
        aria-label={`Message to counterparty for ${trade.trade_id}`}
        onKeyDown={onKey}
      >
        <Header>
          <div style={{ minWidth: 0 }}>
            <Eyebrow>Message to counterparty</Eyebrow>
            <Title>
              {trade.counterparty_name} · {trade.trade_id}
            </Title>
          </div>
          <Button $variant="ghost" $size="sm" onClick={requestClose} aria-label="Close">
            ✕
          </Button>
        </Header>

        <Body>
          <Disclosure role="note">
            Sending will log this message as a note on the trade. Outbound
            delivery to the counterparty is handled downstream.
          </Disclosure>

          <FieldRow>
            <FieldLabel>From</FieldLabel>
            <FieldStatic>{CURRENT_USER}</FieldStatic>
            <span />
          </FieldRow>

          <FieldRow>
            <FieldLabel htmlFor="to">To</FieldLabel>
            <FieldInput
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="counterparty.contact@bankofamerica.com"
            />
            {!showCc ? (
              <InlineLink type="button" onClick={() => setShowCc(true)}>
                Add Cc
              </InlineLink>
            ) : (
              <span />
            )}
          </FieldRow>

          {showCc && (
            <FieldRow>
              <FieldLabel htmlFor="cc">Cc</FieldLabel>
              <FieldInput
                id="cc"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="optional"
              />
              <span />
            </FieldRow>
          )}

          <FieldRow>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <FieldInput
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <span />
          </FieldRow>

          {bodyMax > 0 && bodyMax <= LOW_BODY_BUDGET && (
            <BudgetWarning role="status">
              Long recipients/subject leave little room for the message —
              consider trimming.
            </BudgetWarning>
          )}

          <BodyArea
            ref={bodyRef}
            aria-label="Message body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…"
            maxLength={bodyMax}
          />

          {emails.length > 0 ? (
            <ThreadContext>
              <ThreadHeader>
                <span className="title">Thread context for reference</span>
                <span className="subtitle">
                  The note records your message; the thread stays on the trade.
                </span>
              </ThreadHeader>
              <ThreadList>
                {emails.map((e) => (
                  <ThreadContextRow key={e.id} email={e} />
                ))}
              </ThreadList>
            </ThreadContext>
          ) : null}
        </Body>

        <Footer>
          <FooterStatus>
            {displayError && <ErrorText>{displayError}</ErrorText>}
            <Counter aria-live="polite" $danger={body.length > bodyMax}>
              {body.length} / {bodyMax}
            </Counter>
          </FooterStatus>
          <FooterActions>
            <KbdHint aria-hidden>
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
            </KbdHint>
            <Button $variant="ghost" $size="sm" onClick={requestClose}>
              Cancel
            </Button>
            <Button
              $variant="primary"
              $size="sm"
              onClick={send}
              disabled={isLoading || bodyMax === 0}
            >
              {isLoading ? (
                <>
                  <Spinner /> Sending
                </>
              ) : (
                "Send"
              )}
            </Button>
          </FooterActions>
        </Footer>
      </Aside>
    </>
  );
}

function ThreadContextRow({ email }: { email: Email }) {
  const [open, setOpen] = useState(false);
  return (
    <ThreadRow>
      <ThreadRowMain>
        <ThreadRowButton
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <ThreadRowTopLine>
            <span className="left">
              <Caret $open={open} aria-hidden>
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Caret>
              <span className="from">{email.from_name}</span>
            </span>
            <span className="when">{formatDateTime(email.sent_at)}</span>
          </ThreadRowTopLine>
          <ThreadRowSubject>
            {email.subject || "(no subject)"}
          </ThreadRowSubject>
        </ThreadRowButton>
      </ThreadRowMain>
      {open && (
        <ThreadRowExpanded>
          <p className="meta">
            To: {email.to.map((r) => r.name).join(", ")}
            {email.cc.length > 0 ? (
              <> · Cc: {email.cc.map((r) => r.name).join(", ")}</>
            ) : null}
          </p>
          <pre>{email.body || "(no body)"}</pre>
        </ThreadRowExpanded>
      )}
    </ThreadRow>
  );
}

export function isReplyNote(content: string): boolean {
  return content.startsWith(REPLY_NOTE_PREFIX);
}

// =============================================================================
//  Styled-components
// =============================================================================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: 40;
  animation: fadeIn 160ms ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const Aside = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(640px, 100vw);
  background: ${({ theme }) => theme.colors.surface};
  z-index: 41;
  box-shadow: -24px 0 48px rgba(26, 28, 35, 0.12);
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideInRight 220ms ease-out;
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
`;

const SectionPadding = styled.div`
  padding-left: ${({ theme }) => theme.space.lg};
  padding-right: ${({ theme }) => theme.space.lg};
  @media (min-width: 600px) {
    padding-left: ${({ theme }) => theme.space.xl};
    padding-right: ${({ theme }) => theme.space.xl};
  }
`;

const Header = styled(SectionPadding).attrs({ as: "header" })`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding-top: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Title = styled.h2`
  margin: 2px 0 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.weights.semibold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled(SectionPadding)`
  flex: 1;
  overflow: auto;
  padding-top: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.lg};
  @media (min-width: 600px) {
    padding-top: ${({ theme }) => theme.space.lg};
    padding-bottom: ${({ theme }) => theme.space.xl};
  }
`;

const Disclosure = styled.div`
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => `${theme.colors.accent}22`};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: 1.5;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.sm} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 120ms ease;
  &:hover { border-bottom-color: ${({ theme }) => theme.colors.borderStrong}; }
  &:focus-within { border-bottom-color: ${({ theme }) => theme.colors.accent}; }
  @media (min-width: 600px) {
    grid-template-columns: 72px minmax(0, 1fr) auto;
  }
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.weights.medium};
`;

const FieldStatic = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  padding: 0;
  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
`;

const InlineLink = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  cursor: pointer;
  padding: 0 6px;
`;

const BudgetWarning = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  background: ${({ theme }) => theme.colors.warnSoft};
  border-left: 2px solid ${({ theme }) => theme.colors.warn};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.warn};
`;

const BodyArea = styled.textarea`
  margin-top: ${({ theme }) => theme.space.md};
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const ThreadContext = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const ThreadHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .title {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: ${({ theme }) => theme.weights.medium};
  }
  .subtitle {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

const ThreadList = styled.ul`
  margin: 0;
  padding: ${({ theme }) => theme.space.xs};
  list-style: none;
`;

const ThreadRow = styled.li`
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-bottom: 2px;
`;

const ThreadRowMain = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
`;

const ThreadRowButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  flex: 1;
  min-width: 0;
`;

const ThreadRowTopLine = styled.span`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  align-items: center;

  .left {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .from {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .when {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textFaint};
    flex-shrink: 0;
  }
`;

const Caret = styled.svg.attrs({ width: 10, height: 10, viewBox: "0 0 12 12" })<{
  $open: boolean;
}>`
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0)")};
  transition: transform 160ms;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const ThreadRowSubject = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ThreadRowExpanded = styled.div`
  padding: ${({ theme }) =>
    `0 ${theme.space.md} ${theme.space.md} ${theme.space.xl}`};

  .meta {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textFaint};
  }
  pre {
    margin: ${({ theme }) => theme.space.sm} 0 0;
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    white-space: pre-wrap;
    line-height: 1.5;
    background: ${({ theme }) => theme.colors.bg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
    max-height: 200px;
    overflow: auto;
  }
`;

const Footer = styled(SectionPadding).attrs({ as: "footer" })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding-top: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  flex-wrap: wrap;
  row-gap: ${({ theme }) => theme.space.sm};
`;

const FooterStatus = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  flex-wrap: wrap;
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

const Counter = styled.span<{ $danger: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger : theme.colors.textFaint};
  font-variant-numeric: tabular-nums;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const KbdHint = styled.span`
  display: none;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  margin-right: ${({ theme }) => theme.space.sm};
  @media (min-width: 600px) { display: inline-flex; }
`;

const Kbd = styled.kbd`
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  padding: 1px 5px;
  margin: 0 1px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
`;
