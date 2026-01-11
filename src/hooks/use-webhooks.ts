/**
 * Hooks for webhook management with TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateWebhookRequest,
  Webhook,
  WebhookTestResult,
  WebhookWithDeliveries,
  WebhookWithSecret,
} from '@/types/webhook';

/**
 * Query key factory for webhooks
 */
const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  list: () => [...webhookKeys.lists()] as const,
  details: () => [...webhookKeys.all, 'detail'] as const,
  detail: (id: string) => [...webhookKeys.details(), id] as const,
};

export interface UseWebhooksOptions {
  /** Whether the query should be enabled (default: true) */
  enabled?: boolean;
}

export interface UseWebhookOptions {
  /** Whether the query should be enabled (default: true) */
  enabled?: boolean;
}

/**
 * Fetch webhooks from API route
 */
async function fetchWebhooks(): Promise<Webhook[]> {
  const response = await fetch('/api/webhooks');
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch webhooks');
  }

  return json.data;
}

/**
 * Fetch single webhook details
 */
async function fetchWebhook(id: string): Promise<WebhookWithDeliveries> {
  const response = await fetch(`/api/webhooks/${id}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch webhook');
  }

  return json.data;
}

/**
 * Create a new webhook
 */
async function createWebhook(data: CreateWebhookRequest): Promise<WebhookWithSecret> {
  const response = await fetch('/api/webhooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to create webhook');
  }

  return json.data;
}

/**
 * Delete a webhook
 */
async function deleteWebhook(id: string): Promise<void> {
  const response = await fetch(`/api/webhooks/${id}`, {
    method: 'DELETE',
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to delete webhook');
  }
}

/**
 * Test a webhook
 */
async function testWebhook(id: string): Promise<WebhookTestResult> {
  const response = await fetch(`/api/webhooks/${id}/test`, {
    method: 'POST',
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to test webhook');
  }

  return json.data;
}

/**
 * Hook to fetch all webhooks
 *
 * @param options - Hook options
 * @returns TanStack Query result with webhooks list
 *
 * @example
 * ```tsx
 * const { data: webhooks, isLoading } = useWebhooks();
 *
 * if (webhooks) {
 *   webhooks.forEach(webhook => {
 *     console.log(`${webhook.url}: ${webhook.events.join(', ')}`);
 *   });
 * }
 * ```
 */
export function useWebhooks({ enabled = true }: UseWebhooksOptions = {}) {
  return useQuery<Webhook[], Error>({
    queryKey: webhookKeys.list(),
    queryFn: fetchWebhooks,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a single webhook with delivery history
 *
 * @param id - Webhook ID
 * @param options - Hook options
 * @returns TanStack Query result with webhook details
 *
 * @example
 * ```tsx
 * const { data: webhook, isLoading } = useWebhook('wh_123');
 *
 * if (webhook) {
 *   console.log(`${webhook.url} has ${webhook.recentDeliveries.length} recent deliveries`);
 * }
 * ```
 */
export function useWebhook(id: string, { enabled = true }: UseWebhookOptions = {}) {
  return useQuery<WebhookWithDeliveries, Error>({
    queryKey: webhookKeys.detail(id),
    queryFn: () => fetchWebhook(id),
    enabled: enabled && Boolean(id),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to create a new webhook
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { mutate: create, isPending } = useCreateWebhook();
 *
 * create({
 *   url: 'https://example.com/webhook',
 *   events: ['agent.registered'],
 * }, {
 *   onSuccess: (webhook) => {
 *     console.log('Created webhook:', webhook.id);
 *     console.log('Save this secret:', webhook.secret);
 *   },
 * });
 * ```
 */
export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation<WebhookWithSecret, Error, CreateWebhookRequest>({
    mutationFn: createWebhook,
    onSuccess: () => {
      // Invalidate webhooks list to refetch
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

/**
 * Hook to delete a webhook
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { mutate: remove, isPending } = useDeleteWebhook();
 *
 * remove('wh_123', {
 *   onSuccess: () => {
 *     console.log('Webhook deleted');
 *   },
 * });
 * ```
 */
export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteWebhook,
    onSuccess: (_, id) => {
      // Invalidate webhooks list and remove detail from cache
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
      queryClient.removeQueries({ queryKey: webhookKeys.detail(id) });
    },
  });
}

/**
 * Hook to test a webhook
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { mutate: test, isPending } = useTestWebhook();
 *
 * test('wh_123', {
 *   onSuccess: (result) => {
 *     if (result.delivered) {
 *       console.log('Test delivered successfully');
 *     } else {
 *       console.log('Test failed:', result.error);
 *     }
 *   },
 * });
 * ```
 */
export function useTestWebhook() {
  return useMutation<WebhookTestResult, Error, string>({
    mutationFn: testWebhook,
  });
}
