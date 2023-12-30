export default function RootLayout({ children }) {
    return (
      <div className="pt-10 pb-40 flex items-center justify-center w-[100vw] min-h-[100vh] h-auto overflow-y-auto bg-gradient-to-tl  from-[#FFF7AD] to-[#FFA9F9]">
        {children}
      </div>
    )
  }
  