// Phase 6: could come from Firestore or a Cloud Function for personalised quotes
const QUOTES = [
  'You are doing something incredible, one small step at a time. 💛',
  'Every small win counts. You\'re building something beautiful. ✨',
  'Progress, not perfection. You\'re doing amazing. 🌱',
  'Today is a fresh start. Make it yours. ☀️',
  'Small steps every day. That\'s how mountains are moved. 💪',
  'You showed up today. That\'s already a win. 🎉',
  'Be gentle with yourself. You\'re doing your best. 🌸',
  'One sip, one step, one breath at a time. You\'ve got this. 💧',
  'Your consistency is your superpower. Keep going. 🔥',
  'Rest is productive too. Honor what your body needs. 🧘',
  'You\'re not just surviving — you\'re thriving. ✨',
  'Celebrate the little things. They become the big things. 🎊',
  'Today you\'re one step closer to who you\'re becoming. 💫',
  'You are worthy of every good thing heading your way. 💖',
  'The fact that you\'re trying makes you extraordinary. 🌟',
  'Breathe. You\'re right where you need to be. 🍃',
  'Strong body, calm mind, grateful heart. That\'s you. 💚',
  'Every healthy choice is an act of self-love. 🌺',
  'You don\'t have to be perfect. You just have to show up. ✨',
  'Hydrate, move, rest, repeat. You\'ve got this formula down. 💧',
  'Your future self is cheering you on right now. 🙌',
  'Today\'s effort is tomorrow\'s strength. Keep building. 🏗️',
  'Slow progress is still progress. Don\'t stop. 🌊',
  'You are the author of your own wellness story. 📖',
  'Start where you are. Use what you have. Do what you can. ✨',
  'Even the smallest habit, done consistently, changes everything. 🌿',
  'You\'re doing better than you think. Believe it. 💛',
  'Kindness to yourself is where all growth begins. 🌸',
  'Drink water. Take walks. Rest well. Repeat forever. 💙',
  'On the hard days, showing up is the whole achievement. 🥇',
]

export function getDailyQuote(): string {
  const yearStart = new Date(new Date().getFullYear(), 0, 1)
  const dayOfYear = Math.floor((Date.now() - yearStart.getTime()) / 86_400_000)
  return QUOTES[dayOfYear % QUOTES.length]
}
