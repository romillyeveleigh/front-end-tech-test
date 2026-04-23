import { z } from "zod";

export const TradeStatusSchema = z.enum([
  "dispute",
  "submitted",
  "confirmed",
  "deleted",
  "error",
]);

export type TradeStatus = z.infer<typeof TradeStatusSchema>;

export const BREAK_STATUSES: ReadonlySet<TradeStatus> = new Set(["dispute"]);

export const EmailRecipientSchema = z.object({
  name: z.string(),
  address: z.string().nullable().optional(),
});

export type EmailRecipient = z.infer<typeof EmailRecipientSchema>;

export const EmailSchema = z.object({
  id: z.number().int(),
  from_name: z.string(),
  from_address: z.string(),
  to: z.array(EmailRecipientSchema),
  cc: z.array(EmailRecipientSchema).default([]),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  sent_at: z.string().nullable(),
});

export type Email = z.infer<typeof EmailSchema>;

export const NoteSchema = z.object({
  id: z.number().int(),
  trade_id: z.string().uuid(),
  content: z.string(),
  created_at: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;

const TradeBaseSchema = z.object({
  id: z.string().uuid(),
  trade_id: z.string(),
  counterparty_name: z.string(),
  status: TradeStatusSchema,
  currency_code: z.string(),
  notional_amount: z.number(),
  trade_date: z.string(),
  maturity_date: z.string().nullable(),
  product_type: z.string(),
  has_notes: z.boolean(),
});

export const TradeSchema = TradeBaseSchema;
export type Trade = z.infer<typeof TradeSchema>;

export const TradeDetailSchema = TradeBaseSchema.extend({
  emails: z.array(EmailSchema).default([]),
  notes: z.array(NoteSchema).default([]),
});
export type TradeDetail = z.infer<typeof TradeDetailSchema>;

export const TradeListSchema = z.array(TradeSchema);
