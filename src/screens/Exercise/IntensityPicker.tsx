import { INTENSITY_LEVELS } from '@/mocks/exerciseConfig'

interface Props {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function IntensityPicker({ value, onChange, disabled }: Props) {
  return (
    <div className={`flex gap-1.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {INTENSITY_LEVELS.map(({ v, emoji, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => !disabled && onChange(v)}
          className={`flex-1 py-3.5 px-1 rounded-2xl border text-center transition-all active:scale-95
            ${value === v
              ? 'bg-ink border-ink text-white'
              : 'bg-card border-line text-ink'
            }`}
        >
          <div className="text-lg">{emoji}</div>
          <div className="text-[9px] font-semibold opacity-70 mt-0.5">{label}</div>
        </button>
      ))}
    </div>
  )
}
