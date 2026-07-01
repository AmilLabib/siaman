import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  showBack?: boolean
  rightElement?: React.ReactNode
  transparent?: boolean
}

export default function TopBar({ title, showBack, rightElement, transparent }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 ${
        transparent ? 'bg-transparent' : 'bg-white border-b border-blue-50'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className={`font-extrabold text-lg truncate ${transparent ? 'text-white' : 'text-blue-950'}`}>
          {title}
        </h1>
      </div>
      {rightElement && <div className="flex-shrink-0 ml-2">{rightElement}</div>}
    </header>
  )
}
