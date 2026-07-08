import styles from './Tabs.module.css'

export interface TabsProps {
  items: string[]
  active: string
  onChange: (value: string) => void
  /** Accessible name for the tablist */
  label: string
  /** Optional map from item value to display text */
  renderLabel?: (item: string) => string
  align?: 'left' | 'center'
}

export function Tabs({ items, active, onChange, label, renderLabel, align = 'left' }: TabsProps) {
  return (
    <div
      className={`${styles.tabs} ${align === 'center' ? styles.center : ''}`}
      role="tablist"
      aria-label={label}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          className={`${styles.tab} ${active === item ? styles.tabActive : ''}`}
          aria-selected={active === item}
          onClick={() => onChange(item)}
        >
          {renderLabel ? renderLabel(item) : item}
        </button>
      ))}
    </div>
  )
}
