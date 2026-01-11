/**
 * Webhook types for subscription management
 */

/**
 * Supported webhook event types
 */
export const WEBHOOK_EVENTS = [
  'agent.registered',
  'agent.updated',
  'feedback.received',
  'evaluation.completed',
  'reputation.changed',
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[number];

/**
 * Webhook filters for event matching
 */
export interface WebhookFilters {
  chainIds?: number[];
  agentIds?: string[];
}

/**
 * Webhook subscription
 */
export interface Webhook {
  id: string;
  url: string;
  events: WebhookEventType[];
  filters: WebhookFilters;
  active: boolean;
  description?: string;
  lastDeliveryAt?: string;
  lastDeliveryStatus?: 'delivered' | 'failed';
  failureCount: number;
  createdAt: string;
}

/**
 * Webhook with secret (only returned on creation)
 */
export interface WebhookWithSecret extends Webhook {
  secret: string;
}

/**
 * Webhook delivery record
 */
export interface WebhookDelivery {
  id: string;
  eventType: WebhookEventType;
  status: 'pending' | 'processing' | 'delivered' | 'failed';
  attempts: number;
  responseStatus?: number;
  error?: string;
  createdAt: string;
}

/**
 * Webhook with recent deliveries
 */
export interface WebhookWithDeliveries extends Webhook {
  recentDeliveries: WebhookDelivery[];
}

/**
 * Create webhook request
 */
export interface CreateWebhookRequest {
  url: string;
  events: WebhookEventType[];
  filters?: WebhookFilters;
  description?: string;
}

/**
 * Webhook list response
 */
export interface WebhooksListResult {
  webhooks: Webhook[];
  total: number;
}

/**
 * Test webhook response
 */
export interface WebhookTestResult {
  delivered: boolean;
  responseStatus?: number;
  responseBody?: string | null;
  error?: string;
}

/**
 * Event type display names
 */
export const WEBHOOK_EVENT_LABELS: Record<WebhookEventType, string> = {
  'agent.registered': 'Agent Registered',
  'agent.updated': 'Agent Updated',
  'feedback.received': 'Feedback Received',
  'evaluation.completed': 'Evaluation Completed',
  'reputation.changed': 'Reputation Changed',
};

/**
 * Event type descriptions
 */
export const WEBHOOK_EVENT_DESCRIPTIONS: Record<WebhookEventType, string> = {
  'agent.registered': 'When a new agent is registered on the blockchain',
  'agent.updated': "When an agent's metadata or configuration is updated",
  'feedback.received': 'When feedback is submitted for an agent',
  'evaluation.completed': 'When an agent evaluation is completed',
  'reputation.changed': "When an agent's reputation score changes",
};
