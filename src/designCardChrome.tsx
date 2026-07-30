import type { ReactNode } from 'react'

/**
 * A labelled row of variants inside a design card.
 *
 * Lives here rather than in `entry-design.tsx` so that file exports only data
 * and functions — mixing a component in with them trips
 * `react-refresh/only-export-components`, the same reason `tagVariant.ts` and
 * `icons.ts` sit beside their components instead of inside them.
 *
 * The `dsc-` classes come from `scripts/design-card.css`, which the bundle
 * concatenates onto the app stylesheet. They are plain global classes, not a
 * CSS Module: this markup is never part of App's tree, so its CSS would not be
 * in `dist/assets/*.css`.
 */
export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="dsc-group">
      <span className="dsc-label">{label}</span>
      <div className="dsc-row">{children}</div>
    </div>
  )
}
