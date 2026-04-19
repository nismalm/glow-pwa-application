export function useHaptic() {
  return (ms = 10) => {
    if ('vibrate' in navigator) navigator.vibrate(ms)
  }
}
