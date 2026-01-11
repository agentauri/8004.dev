/**
 * Webhooks Management Page
 *
 * List, create, and manage webhook subscriptions.
 */

'use client';

import { AlertCircle, Check, Link2, Plus, Trash2, X } from 'lucide-react';
import { Suspense, useCallback, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { useCreateWebhook, useDeleteWebhook, useWebhooks } from '@/hooks';
import { cn } from '@/lib/utils';
import type {
  CreateWebhookRequest,
  Webhook,
  WebhookEventType,
  WebhookWithSecret,
} from '@/types/webhook';
import { WEBHOOK_EVENT_DESCRIPTIONS, WEBHOOK_EVENT_LABELS, WEBHOOK_EVENTS } from '@/types/webhook';

/**
 * Webhook card component
 */
function WebhookCard({
  webhook,
  onDelete,
  isDeleting,
}: {
  webhook: Webhook;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div
      className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-4"
      data-testid={`webhook-card-${webhook.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* URL */}
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-[var(--pixel-gray-400)] shrink-0" />
            <span className="text-sm text-[var(--pixel-gray-200)] font-[family-name:var(--font-mono)] truncate">
              {webhook.url}
            </span>
          </div>

          {/* Description */}
          {webhook.description && (
            <p className="text-xs text-[var(--pixel-gray-400)] mb-3">{webhook.description}</p>
          )}

          {/* Events */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {webhook.events.map((event) => (
              <span
                key={event}
                className="px-2 py-0.5 text-[0.625rem] uppercase tracking-wider bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)]"
              >
                {WEBHOOK_EVENT_LABELS[event]}
              </span>
            ))}
          </div>

          {/* Status & Last Delivery */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  webhook.active ? 'bg-[#00D800]' : 'bg-[var(--pixel-gray-500)]',
                )}
              />
              <span className="text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)]">
                {webhook.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {webhook.lastDeliveryAt && (
              <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
                Last delivery: {new Date(webhook.lastDeliveryAt).toLocaleString()}
                {webhook.lastDeliveryStatus && (
                  <span
                    className={cn(
                      'ml-1',
                      webhook.lastDeliveryStatus === 'delivered' && 'text-[#00D800]',
                      webhook.lastDeliveryStatus === 'failed' && 'text-[#fc5454]',
                    )}
                  >
                    ({webhook.lastDeliveryStatus})
                  </span>
                )}
              </span>
            )}
            {webhook.failureCount > 0 && (
              <span className="text-[#fc5454] font-[family-name:var(--font-pixel-body)]">
                {webhook.failureCount} failures
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(webhook.id)}
          disabled={isDeleting}
          className={cn(
            'p-2 text-[var(--pixel-gray-400)] hover:text-[#fc5454] hover:bg-[#fc5454]/10',
            'border-2 border-transparent hover:border-[#fc5454]/50',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          aria-label="Delete webhook"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Create webhook form
 */
function CreateWebhookForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: (webhook: WebhookWithSecret) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<WebhookEventType[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate: createWebhook, isPending } = useCreateWebhook();

  const handleToggleEvent = useCallback((event: WebhookEventType) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!url) {
        setError('URL is required');
        return;
      }

      if (events.length === 0) {
        setError('Select at least one event type');
        return;
      }

      try {
        new URL(url);
      } catch {
        setError('Invalid URL format');
        return;
      }

      const data: CreateWebhookRequest = {
        url,
        events,
        description: description || undefined,
      };

      createWebhook(data, {
        onSuccess: (webhook) => {
          onSuccess(webhook);
        },
        onError: (err) => {
          setError(err.message);
        },
      });
    },
    [url, events, description, createWebhook, onSuccess],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-primary)] p-6 space-y-6"
      data-testid="create-webhook-form"
    >
      <h3 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider">
        Create Webhook
      </h3>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-[#fc5454]/10 border-2 border-[#fc5454]/50">
          <AlertCircle className="w-4 h-4 text-[#fc5454]" />
          <span className="text-sm text-[#fc5454]">{error}</span>
        </div>
      )}

      {/* URL */}
      <div className="space-y-2">
        <label
          htmlFor="webhook-url"
          className="block text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]"
        >
          Webhook URL *
        </label>
        <input
          id="webhook-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/webhook"
          className={cn(
            'w-full px-3 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)]',
            'text-sm text-[var(--pixel-gray-200)] font-[family-name:var(--font-mono)]',
            'placeholder:text-[var(--pixel-gray-500)]',
            'focus:outline-none focus:border-[var(--pixel-primary)]',
          )}
          required
        />
      </div>

      {/* Events */}
      <div className="space-y-2">
        <span className="block text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]">
          Event Types *
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WEBHOOK_EVENTS.map((event) => (
            <label
              key={event}
              className={cn(
                'flex items-start gap-3 p-3 cursor-pointer',
                'border-2 transition-colors',
                events.includes(event)
                  ? 'border-[var(--pixel-primary)] bg-[var(--pixel-primary)]/10'
                  : 'border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gray-600)]',
              )}
            >
              <input
                type="checkbox"
                checked={events.includes(event)}
                onChange={() => handleToggleEvent(event)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-4 h-4 shrink-0 mt-0.5 border-2 flex items-center justify-center',
                  events.includes(event)
                    ? 'border-[var(--pixel-primary)] bg-[var(--pixel-primary)]'
                    : 'border-[var(--pixel-gray-600)]',
                )}
              >
                {events.includes(event) && <Check className="w-3 h-3 text-[var(--pixel-black)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)]">
                  {WEBHOOK_EVENT_LABELS[event]}
                </span>
                <span className="block text-xs text-[var(--pixel-gray-400)] mt-0.5">
                  {WEBHOOK_EVENT_DESCRIPTIONS[event]}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="webhook-description"
          className="block text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]"
        >
          Description (optional)
        </label>
        <input
          id="webhook-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this webhook"
          maxLength={500}
          className={cn(
            'w-full px-3 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)]',
            'text-sm text-[var(--pixel-gray-200)]',
            'placeholder:text-[var(--pixel-gray-500)]',
            'focus:outline-none focus:border-[var(--pixel-primary)]',
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            'px-4 py-2 text-sm uppercase tracking-wider',
            'font-[family-name:var(--font-pixel-body)]',
            'border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
            'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
            'transition-colors',
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'px-4 py-2 text-sm uppercase tracking-wider',
            'font-[family-name:var(--font-pixel-body)]',
            'bg-[var(--pixel-primary)] border-2 border-[var(--pixel-primary)]',
            'text-[var(--pixel-black)]',
            'hover:bg-[var(--pixel-primary-hover)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
          )}
        >
          {isPending ? 'Creating...' : 'Create Webhook'}
        </button>
      </div>
    </form>
  );
}

/**
 * Secret display dialog
 */
function SecretDisplay({ webhook, onClose }: { webhook: WebhookWithSecret; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(webhook.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy secret:', err);
    }
  }, [webhook.secret]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-primary)] p-6 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider">
            Webhook Created
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#ffd700]/10 border-2 border-[#ffd700]/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-[#ffd700] font-[family-name:var(--font-pixel-body)] uppercase">
              Save your secret
            </span>
          </div>
          <p className="text-xs text-[var(--pixel-gray-300)]">
            This secret will only be shown once. Use it to verify webhook signatures.
          </p>
        </div>

        <div className="space-y-2">
          <span className="block text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]">
            Webhook Secret
          </span>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] text-sm text-[var(--pixel-gray-200)] font-[family-name:var(--font-mono)] break-all">
              {webhook.secret}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'px-3 py-2 text-sm uppercase tracking-wider shrink-0',
                'font-[family-name:var(--font-pixel-body)]',
                'border-2 transition-colors',
                copied
                  ? 'border-[#00D800] text-[#00D800]'
                  : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)]',
              )}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={cn(
            'w-full px-4 py-2 text-sm uppercase tracking-wider',
            'font-[family-name:var(--font-pixel-body)]',
            'bg-[var(--pixel-primary)] border-2 border-[var(--pixel-primary)]',
            'text-[var(--pixel-black)]',
            'hover:bg-[var(--pixel-primary-hover)]',
            'transition-colors',
          )}
        >
          I have saved my secret
        </button>
      </div>
    </div>
  );
}

/**
 * Main webhooks content
 */
function WebhooksContent() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdWebhook, setCreatedWebhook] = useState<WebhookWithSecret | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: webhooks, isLoading, error } = useWebhooks();
  const { mutate: deleteWebhook } = useDeleteWebhook();

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm('Are you sure you want to delete this webhook?')) return;

      setDeletingId(id);
      deleteWebhook(id, {
        onSettled: () => {
          setDeletingId(null);
        },
      });
    },
    [deleteWebhook],
  );

  const handleCreateSuccess = useCallback((webhook: WebhookWithSecret) => {
    setShowCreateForm(false);
    setCreatedWebhook(webhook);
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm">
          Failed to load webhooks: {error.message}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <PixelExplorer size="lg" animation="bounce" />
        <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
          Loading Webhooks...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Button / Form */}
      {showCreateForm ? (
        <CreateWebhookForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-wider',
            'font-[family-name:var(--font-pixel-body)]',
            'bg-[var(--pixel-primary)] border-2 border-[var(--pixel-primary)]',
            'text-[var(--pixel-black)]',
            'hover:bg-[var(--pixel-primary-hover)]',
            'transition-colors',
          )}
        >
          <Plus className="w-4 h-4" />
          Create Webhook
        </button>
      )}

      {/* Webhook List */}
      {webhooks && webhooks.length > 0 ? (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onDelete={handleDelete}
              isDeleting={deletingId === webhook.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
          <Link2 className="w-12 h-12 text-[var(--pixel-gray-600)] mx-auto mb-4" />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider">
            No webhooks configured
          </p>
          <p className="text-[var(--pixel-gray-500)] text-xs mt-2">
            Create a webhook to receive real-time notifications
          </p>
        </div>
      )}

      {/* Secret Display Modal */}
      {createdWebhook && (
        <SecretDisplay webhook={createdWebhook} onClose={() => setCreatedWebhook(null)} />
      )}
    </div>
  );
}

/**
 * Webhooks Management Page
 */
export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-pixel-grid">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader
          title="Webhooks"
          description="Manage webhook subscriptions to receive real-time event notifications."
          icon={Link2}
          glow="green"
          className="mb-8"
        />

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <PixelExplorer size="lg" animation="bounce" />
              <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
                Loading Webhooks...
              </p>
            </div>
          }
        >
          <WebhooksContent />
        </Suspense>
      </div>
    </div>
  );
}
