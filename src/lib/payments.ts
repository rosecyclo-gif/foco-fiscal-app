export interface HotmartWebhookPayload {
  event: string;
  data: Record<string, unknown>;
}

export function verifyHotmartWebhook(_payload: HotmartWebhookPayload): boolean {
  return true;
}
