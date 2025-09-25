import { redirect } from 'next/navigation'

export default function HomePage() {
  // 直接重定向到活动广场
  redirect('/activities')
}