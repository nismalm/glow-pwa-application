interface Props {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function DurationSlider({ value, onChange, disabled }: Props) {
  const pct = Math.round((value / 180) * 100)

  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] font-semibold text-ink">How long?</span>
        <span className="text-[13px] font-bold text-ink-soft">
          <span className="text-ink">{value}</span> min
        </span>
      </div>

      <style>{`
        .dur-slider { width: 100%; -webkit-appearance: none; appearance: none; background: transparent; }
        .dur-slider::-webkit-slider-runnable-track {
          height: 10px; border-radius: 999px;
          background: linear-gradient(90deg, #cdde3f ${pct}%, #ececec ${pct}%);
        }
        .dur-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%;
          background: #111; margin-top: -8px; cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,.2);
        }
      `}</style>

      <input
        type="range"
        className="dur-slider"
        min={5}
        max={180}
        step={5}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
      />

      <div className="flex justify-between text-[12px] text-ink-soft mt-1.5">
        <span>5</span>
        <span>90</span>
        <span>180</span>
      </div>
    </div>
  )
}
