'use client';

import { Users } from 'lucide-react';
import { Suspense, useCallback, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { PaymentModal, TeamComposer, TeamResult } from '@/components/organisms';
import { MainLayout } from '@/components/templates';
import { usePaidComposeTeam, useWallet } from '@/hooks';
import { cn } from '@/lib/utils';
import type { TeamComposition } from '@/types';

/**
 * Loading animation for team building
 */
function BuildingAnimation(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <PixelExplorer size="lg" animation="bounce" />
      <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gold-coin)] mt-6 animate-pulse uppercase tracking-wider">
        Building your team...
      </p>
      <div className="mt-4 flex gap-2">
        <span
          className="w-2 h-2 bg-[var(--pixel-gold-coin)] animate-[ping_1s_ease-in-out_infinite]"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-[var(--pixel-gold-coin)] animate-[ping_1s_ease-in-out_infinite]"
          style={{ animationDelay: '200ms' }}
        />
        <span
          className="w-2 h-2 bg-[var(--pixel-gold-coin)] animate-[ping_1s_ease-in-out_infinite]"
          style={{ animationDelay: '400ms' }}
        />
      </div>
    </div>
  );
}

/**
 * Error display for composition failures
 */
function ErrorDisplay({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PixelExplorer size="md" animation="float" />
      <h3 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-red-fire)] mt-6">
        Team Composition Failed
      </h3>
      <p className="font-mono text-sm text-[var(--pixel-gray-400)] mt-2 max-w-md">
        {error.message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          'mt-6 px-4 py-2 border-2 transition-all',
          'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
          'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)]',
          'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
          'hover:shadow-[0_0_12px_var(--glow-blue)]',
        )}
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Main compose page content
 */
function ComposePageContent(): React.JSX.Element {
  const [composition, setComposition] = useState<TeamComposition | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const wallet = useWallet();

  const {
    mutate: composeTeam,
    isPending,
    error,
    reset,
    paymentState,
    confirmPayment,
    clearPayment,
  } = usePaidComposeTeam();

  const handleCompose = useCallback(
    (input: Parameters<typeof composeTeam>[0]) => {
      composeTeam(input, {
        onSuccess: (data) => {
          setComposition(data);
          setShowPaymentModal(false);
        },
      });
    },
    [composeTeam],
  );

  const handleReset = useCallback(() => {
    setComposition(null);
    clearPayment();
    reset();
  }, [reset, clearPayment]);

  // Show payment modal when payment is required
  const handlePaymentModalOpen = useCallback(
    (open: boolean) => {
      setShowPaymentModal(open);
      if (!open) {
        clearPayment();
      }
    },
    [clearPayment],
  );

  const handleConfirmPayment = useCallback(async () => {
    // For now, simulate a signed payment header
    // In production, this would involve signing with the wallet
    // TODO: Implement actual wallet signing with @x402/fetch
    try {
      await confirmPayment('signed-payment-header');
    } catch {
      // Error is already handled in paymentState.paymentError
    }
  }, [confirmPayment]);

  // Open payment modal when payment is required
  if (paymentState.paymentRequired && !showPaymentModal) {
    setShowPaymentModal(true);
  }

  // Show loading animation while composing or paying
  if (isPending || paymentState.isPaying) {
    return <BuildingAnimation />;
  }

  // Show error if composition failed (but not payment errors)
  if (error && !composition && !paymentState.paymentRequired) {
    return <ErrorDisplay error={error} onRetry={handleReset} />;
  }

  // Show result if composition is complete
  if (composition) {
    return <TeamResult composition={composition} onReset={handleReset} />;
  }

  // Show composer form with payment modal
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-100)] mb-2">
              Describe Your Task
            </h2>
            <p className="font-mono text-sm text-[var(--pixel-gray-400)]">
              Tell us what you need, and we will find the optimal team of AI agents
            </p>
          </div>
          <TeamComposer onCompose={handleCompose} isLoading={isPending} />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={handlePaymentModalOpen}
        paymentDetails={paymentState.paymentDetails}
        operationName="Compose Team"
        usdcBalance={wallet.usdcBalance}
        isWalletConnected={wallet.status === 'connected'}
        isCorrectNetwork={wallet.isCorrectNetwork}
        isProcessing={paymentState.isPaying}
        error={paymentState.paymentError}
        onConfirm={handleConfirmPayment}
        onSwitchNetwork={wallet.switchToBase}
        onConnectWallet={wallet.connect}
      />
    </>
  );
}

/**
 * Team composition page.
 *
 * Allows users to describe a task and compose an optimal team of AI agents
 * to accomplish it. Shows team members with roles, contributions, and
 * compatibility scores.
 */
export default function ComposePage(): React.JSX.Element {
  return (
    <MainLayout>
      <main className="space-y-8 px-4 py-8">
        {/* Header */}
        <PageHeader
          title="Team Composer"
          description="Build the perfect agent team for your task"
          icon={Users}
          glow="gold"
          align="center"
        />

        {/* Content */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <PixelExplorer size="md" animation="bounce" />
              <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
                Loading...
              </p>
            </div>
          }
        >
          <ComposePageContent />
        </Suspense>
      </main>
    </MainLayout>
  );
}
