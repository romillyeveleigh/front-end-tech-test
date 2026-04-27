import { formatDateTime } from "./format";

export const REPLY_NOTE_PREFIX = "[Reply sent]";

// Mirrors backend NoteCreate.content max_length in src/models.py.
export const MAX_NOTE_LENGTH = 500;

export interface ReplyNoteFields {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface ParsedReplyNote {
  subject: string;
  to?: string;
  cc?: string;
  body: string;
}

export function buildReplyNote(f: ReplyNoteFields): string {
  return [
    `${REPLY_NOTE_PREFIX} ${formatDateTime(f.sentAt)}`,
    `From: ${f.from}`,
    `To:   ${f.to}`,
    f.cc ? `Cc:   ${f.cc}` : null,
    `Subject: ${f.subject}`,
    "", // blank-line separator before body — must survive the filter
    f.body,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function parseReplyNote(content: string): ParsedReplyNote {
  const [headers = "", ...bodyChunks] = content.split("\n\n");
  const headerLines = headers.split("\n");
  const headerValue = (key: string) =>
    headerLines
      .find((l) => l.startsWith(`${key}:`))
      ?.slice(key.length + 1)
      .trim();
  return {
    subject: headerValue("Subject") ?? "(no subject)",
    to: headerValue("To"),
    cc: headerValue("Cc"),
    body: bodyChunks.join("\n\n"),
  };
}

export function isReplyNote(content: string): boolean {
  return content.startsWith(REPLY_NOTE_PREFIX);
}
