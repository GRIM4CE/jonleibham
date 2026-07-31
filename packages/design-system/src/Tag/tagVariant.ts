import type { TagVariant } from './Tag'

const CLOUD = /\b(aws|azure|gcp|docker|tailscale|vercel|netlify|amplify|lambda|cognito|s3)\b/i
const DATA =
  /\b(turso|libsql|sqlite|postgres|postgresql|mongodb|mysql|redis|prisma|drizzle|supabase)\b/i

/**
 * Picks a chip color for a technology name: cloud and infrastructure read gold,
 * data stores read green, anything unrecognized reads neutral.
 *
 * Lives outside Tag.tsx so that file only exports a component.
 */
export function tagVariantFor(tech: string): TagVariant {
  if (CLOUD.test(tech)) return 'cloud'
  if (DATA.test(tech)) return 'data'
  return 'neutral'
}
