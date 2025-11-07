import { ReactNode } from "react"

export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-[#0f1117] overflow-hidden">
      {children}
    </div>
  )
}
