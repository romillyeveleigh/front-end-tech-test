"use client";

import styled from "styled-components";
import { Panel, EmptyState } from "./ui";
import { formatDateTime } from "@/lib/format";
import type { Email } from "@/lib/schemas";

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

const Body = styled.p`
  margin: ${({ theme }) => `${theme.space.sm} 0 0`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  white-space: pre-wrap;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function EmailsPanel({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return (
      <Panel title="Emails">
        <EmptyState
          title="No emails on this trade"
          description="Emails from the counterparty will appear here once received."
        />
      </Panel>
    );
  }

  return (
    <Panel title={`Emails (${emails.length})`}>
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
            {body ? <Body>{body}</Body> : null}
          </Item>
        ))}
      </List>
    </Panel>
  );
}
