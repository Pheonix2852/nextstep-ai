export default function MainLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="container mx-auto mt-24 mb-20">
        {children}
    </div>
  )
}