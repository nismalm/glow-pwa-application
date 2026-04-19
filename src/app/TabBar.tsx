import { NavLink } from 'react-router-dom'
import { Home, Droplets, Dumbbell, Sparkles } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/water', icon: Droplets, label: 'Water' },
  { to: '/exercise', icon: Dumbbell, label: 'Exercise' },
  { to: '/myspace', icon: Sparkles, label: 'My Space' },
]

export default function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center justify-around backdrop-blur-xl bg-white/80 border-t border-line z-50"
      style={{
        height: 'calc(62px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all duration-200 ${
              isActive ? 'text-ink' : 'text-ink-mute'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-accent' : 'bg-transparent'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
