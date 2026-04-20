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
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-stretch backdrop-blur-xl bg-white/80 border-t border-line z-50"
      style={{
        height: 'calc(72px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              isActive ? 'text-ink' : 'text-ink-mute'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-accent' : 'bg-transparent'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
