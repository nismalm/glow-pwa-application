// @ts-check
const admin = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '{}')
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const MESSAGES = [
  { title: '🌙 Sunday wind-down',   body: "Before you rest — did you log today? A few taps keeps your streak alive." },
  { title: '🌟 Monday check-in',    body: "New week, fresh energy! Don't let today go unrecorded. Open Glow now." },
  { title: '💪 Keep it going',      body: "Two days strong! Your progress is worth tracking. 30 seconds — that's all." },
  { title: '🔥 Midweek momentum',   body: "You're halfway through the week. Log your wins before they fade." },
  { title: '✨ Almost there',        body: "Thursday done! Every log is a promise to your future self. Record it." },
  { title: '🎉 Friday check-in',    body: "End the week strong — log your progress and feel that Friday glow." },
  { title: '🌿 Saturday self-care', body: "Rest days count too. Mood, water, rituals — capture how today felt." },
]

async function run() {
  // Use IST date for correct day-of-week
  const dayOfWeek = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  ).getDay()
  const { title, body } = MESSAGES[dayOfWeek]

  const usersSnap = await admin.firestore().collection('users').get()

  const validTokens = []
  const tokenToUser = {}

  usersSnap.docs.forEach((doc) => {
    const data = doc.data()
    if (data.preferences?.reminders !== true) return
    const tokens = data.fcmTokens ?? []
    tokens.forEach((t) => {
      validTokens.push(t)
      tokenToUser[t] = doc.id
    })
  })

  if (validTokens.length === 0) {
    console.log('No users with reminders enabled.')
    return
  }

  console.log(`Sending "${title}" to ${validTokens.length} device(s)…`)

  const response = await admin.messaging().sendEachForMulticast({
    tokens: validTokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: 'https://glow-pwa-application.vercel.app/icons/icon-192.png',
        badge: 'https://glow-pwa-application.vercel.app/icons/icon-192.png',
        requireInteraction: false,
      },
      fcmOptions: { link: 'https://glow-pwa-application.vercel.app/' },
    },
  })

  console.log(`Success: ${response.successCount} / ${validTokens.length}`)

  // Remove stale tokens
  const staleByUser = {}
  response.responses.forEach((res, i) => {
    if (!res.success) {
      const token = validTokens[i]
      const uid = tokenToUser[token]
      if (uid) staleByUser[uid] = [...(staleByUser[uid] ?? []), token]
    }
  })

  await Promise.all(
    Object.entries(staleByUser).map(([uid, tokens]) =>
      admin.firestore().doc(`users/${uid}`).update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...tokens),
      })
    )
  )

  if (Object.keys(staleByUser).length > 0) {
    console.log(`Cleaned up ${Object.keys(staleByUser).length} stale token(s).`)
  }
}

run().catch((err) => { console.error(err); process.exit(1) })
