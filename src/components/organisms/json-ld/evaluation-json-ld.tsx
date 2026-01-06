import type { AgentFeedback, AgentReputation } from '@/types/agent';

/**
 * Evaluation JSON-LD structured data
 * Represents agent reputation and evaluations using schema.org AggregateRating and Review
 *
 * @see https://schema.org/AggregateRating
 * @see https://schema.org/Review
 */
interface EvaluationJsonLdProps {
  /** Agent ID in format chainId:tokenId */
  agentId: string;
  /** Agent name */
  agentName: string;
  /** Agent reputation data */
  reputation: AgentReputation;
  /** Recent feedback items (optional, shows as individual reviews) */
  recentFeedback?: AgentFeedback[];
}

export function EvaluationJsonLd({
  agentId,
  agentName,
  reputation,
  recentFeedback,
}: EvaluationJsonLdProps) {
  // Build the aggregate rating schema
  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: reputation.averageScore,
    bestRating: 100,
    worstRating: 0,
    ratingCount: reputation.count,
  };

  // Build individual review schemas from recent feedback
  const reviews = recentFeedback?.map((feedback) => ({
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: feedback.score,
      bestRating: 100,
      worstRating: 0,
    },
    ...(feedback.context && { reviewBody: feedback.context }),
    datePublished: feedback.timestamp,
    author: {
      '@type': 'Person',
      name: feedback.submitter
        ? `${feedback.submitter.slice(0, 6)}...${feedback.submitter.slice(-4)}`
        : 'Anonymous',
    },
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: agentName,
    description: `AI Agent ${agentName} on 8004.dev - decentralized agent registry`,
    url: `https://www.8004.dev/agent/${agentId}`,
    aggregateRating,
    ...(reviews && reviews.length > 0 && { review: reviews }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Score Distribution Low',
        value: reputation.distribution.low,
      },
      {
        '@type': 'PropertyValue',
        name: 'Score Distribution Medium',
        value: reputation.distribution.medium,
      },
      {
        '@type': 'PropertyValue',
        name: 'Score Distribution High',
        value: reputation.distribution.high,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
