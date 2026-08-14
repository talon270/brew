/**
 * Shared formatting helpers.
 *
 * `rupees` lived privately inside Cards.tsx until a second page needed it.
 * Indian digit grouping (1,20,000 rather than 120,000) is the whole reason this
 * is a function at all.
 */

export function rupees(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`
}
