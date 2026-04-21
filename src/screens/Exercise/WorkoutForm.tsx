import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useHaptic } from '@/hooks/useHaptic'
import { WORKOUT_TYPES } from '@/lib/exerciseConfig'
import { TypeChips } from './TypeChips'
import { DurationSlider } from './DurationSlider'
import { IntensityPicker } from './IntensityPicker'

const workoutTypeIds = WORKOUT_TYPES.map((t) => t.id) as [string, ...string[]]

const schema = z.object({
  didWorkout: z.boolean(),
  types: z.array(z.enum(workoutTypeIds as [string, ...string[]])).optional(),
  durationMin: z.number().min(5).max(180),
  intensity: z.number().int().min(1).max(5),
  notes: z.string().max(280).optional(),
}).refine(d => d.didWorkout ? (d.types?.length ?? 0) > 0 : true, {
  message: 'Pick at least one activity',
  path: ['types'],
})

type FormValues = z.infer<typeof schema>

export function WorkoutForm() {
  const store = useExerciseStore()
  const haptic = useHaptic()

  const { control, handleSubmit, watch, formState: { isValid, isDirty, isSubmitSuccessful } } = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      didWorkout: store.didWorkout,
      types: store.types as FormValues['types'],
      durationMin: store.durationMin,
      intensity: store.intensity,
      notes: store.notes,
    },
  })

  const didWorkout = watch('didWorkout')
  const notes = watch('notes') ?? ''

  function onSubmit(data: FormValues) {
    haptic()
    store.setLog({
      didWorkout: data.didWorkout,
      types: data.types ?? [],
      durationMin: data.durationMin,
      intensity: data.intensity as 1 | 2 | 3 | 4 | 5,
      notes: data.notes ?? '',
    })
  }

  return (
    <div className="bg-card rounded-3xl p-5 shadow-card border border-black/[.03] mb-4">
      <h3 className="text-[16px] font-bold text-ink">Today's movement 🏃‍♀️</h3>
      <p className="text-ink-soft text-[13px] mt-0.5 mb-5">Small steps, big wins</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Did you workout? */}
        <div>
          <label className="text-[13px] font-semibold text-ink block mb-2">
            Did you workout today?
          </label>
          <Controller
            name="didWorkout"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { field.onChange(true); haptic() }}
                  className={`flex-1 py-3 rounded-2xl border text-[13px] font-bold transition-all active:scale-[.97]
                    ${field.value ? 'bg-ink border-ink text-white' : 'bg-card border-line text-ink'}`}
                >
                  Yes, I did! 💪
                </button>
                <button
                  type="button"
                  onClick={() => { field.onChange(false); haptic() }}
                  className={`flex-1 py-3 rounded-2xl border text-[13px] font-bold transition-all active:scale-[.97]
                    ${!field.value ? 'bg-ink border-ink text-white' : 'bg-card border-line text-ink'}`}
                >
                  Rest day
                </button>
              </div>
            )}
          />
        </div>

        {/* Activity type */}
        <div className={!didWorkout ? 'opacity-40 pointer-events-none' : ''}>
          <label className="text-[13px] font-semibold text-ink block mb-2">
            What did you do?
          </label>
          <Controller
            name="types"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TypeChips
                  value={field.value ?? []}
                  onChange={field.onChange}
                  disabled={!didWorkout}
                />
                {fieldState.error && (
                  <p className="text-coral text-[12px] mt-1.5">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Duration */}
        <div className={!didWorkout ? 'opacity-40 pointer-events-none' : ''}>
          <Controller
            name="durationMin"
            control={control}
            render={({ field }) => (
              <DurationSlider
                value={field.value}
                onChange={field.onChange}
                disabled={!didWorkout}
              />
            )}
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="text-[13px] font-semibold text-ink block mb-2">
            How intense did it feel?
          </label>
          <Controller
            name="intensity"
            control={control}
            render={({ field }) => (
              <IntensityPicker
                value={field.value}
                onChange={field.onChange}
                disabled={!didWorkout}
              />
            )}
          />
        </div>

        {/* Notes */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[13px] font-semibold text-ink">
              A quick note (optional)
            </label>
            <span className="text-[11px] text-ink-mute">{notes.length}/280</span>
          </div>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="How are you feeling? Any wins today?"
                maxLength={280}
                rows={3}
                className="w-full border border-line rounded-2xl p-3 text-[14px] font-medium text-ink
                  placeholder:text-ink-mute resize-none focus:outline-none focus:border-ink/30 bg-bg"
              />
            )}
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={!isValid || !isDirty}
          className="w-full py-4 rounded-2xl bg-ink text-white text-[14px] font-bold
            active:scale-[.97] transition-transform disabled:opacity-40"
        >
          {isSubmitSuccessful ? 'Saved ✨' : 'Save today\'s workout ✨'}
        </button>
      </form>
    </div>
  )
}
