import { WORKOUT_TYPES } from '@/mocks/exerciseConfig'

interface Props {
  value: string[]
  onChange: (v: string[]) => void
  disabled?: boolean
}

export function TypeChips({ value, onChange, disabled }: Props) {
  function toggle(id: string) {
    if (disabled) return
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {WORKOUT_TYPES.map(({ id, label }) => {
        const active = value.includes(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            disabled={disabled}
            className={`px-3.5 py-2.5 rounded-full text-[13px] font-semibold border transition-all active:scale-95
              ${active
                ? 'bg-accent border-accent text-[#1a2a00]'
                : 'bg-card border-line text-ink'
              }
              ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
