interface Props {
  glasses: number
  goal: number
  onGlassClick: (index: number) => void
}

export function GlassGrid({ glasses, goal, onGlassClick }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1.5 mx-auto w-fit">
      {Array.from({ length: goal }, (_, i) => (
        <button
          key={i}
          onClick={() => onGlassClick(i)}
          aria-label={`${i < glasses ? 'Remove' : 'Add'} glass ${i + 1}`}
          className={`w-[22px] h-[26px] rounded-[3px_3px_6px_6px] relative transition-colors duration-200 ${
            i < glasses ? 'bg-accent' : 'bg-[#f1efe9]'
          }`}
        >
          <div className="absolute left-[3px] right-[3px] top-[3px] h-[2px] rounded-sm bg-black/[.05]" />
        </button>
      ))}
    </div>
  )
}
