import { Suspense } from "react";
import { RiseLoader } from "react-spinners"

export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="px-5">
        <Suspense fallback={<RiseLoader className="mt-4" color="linear-gradient(to right, #6b7280, #d1d5db)"/>}>
            {children}
        </Suspense>
    </div>
  )
}