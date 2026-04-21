import { Toaster } from 'sonner'
import AppRouter from '@/router'

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton duration={6000} />
      <AppRouter />
    </>
  )
}
