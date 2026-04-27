"use client";

import styled from "styled-components";
import { Button, Panel, EmptyState } from "./ui";
import { formatDateTime } from "@/lib/format";
import { BREAK_STATUSES, type Email, type TradeStatus } from "@/lib/schemas";

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.lg};
`;

const ItemHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`;

const Who = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.weights.medium};
`;

const Meta = styled.p`
  margin: 4px 0 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Subject = styled.p`
  margin: ${({ theme }) => `${theme.space.sm} 0 0`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.weights.medium};
  min-width: 320px;
`;

const BodyText = styled.p`
  margin: ${({ theme }) => `${theme.space.sm} 0 0`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  white-space: pre-wrap;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface EmailsPanelProps {
  emails: Email[];
  status: TradeStatus;
  onCompose: () => void;
}

export function EmailsPanel({ emails, status, onCompose }: EmailsPanelProps) {
  const canCompose = BREAK_STATUSES.has(status);
  const action = canCompose ? (
    <Button $variant="primary" $size="sm" onClick={onCompose}>
      <ComposeIcon /> Compose
    </Button>
  ) : null;

  if (emails.length === 0) {
    return (
      <Panel title="Emails" actions={action}>
        <EmptyState
          title="No emails on this trade"
          description="Emails from the counterparty will appear here once received."
        />
      </Panel>
    );
  }

  return (
    <Panel title={`Emails (${emails.length})`} actions={action}>
      <List>
        {emails.map(({ id, from_name, to, subject, body, sent_at }) => (
          <Item key={id}>
            <ItemHeader>
              <div>
                <Who>{from_name}</Who>
                <Meta>To: {to.map((r) => r.name).join(", ")}</Meta>
              </div>
              <Meta>{formatDateTime(sent_at)}</Meta>
            </ItemHeader>
            {subject ? <Subject>{subject}</Subject> : null}
            {body ? <BodyText>{body}</BodyText> : null}
          </Item>
        ))}
      </List>
    </Panel>
  );
}

function ComposeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M11.5 2.5l2 2L5 13l-2.5.5L3 11l8.5-8.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
