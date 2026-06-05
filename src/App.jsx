import { useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CatDetail from './pages/CatDetail'
import Likes from './pages/Likes'

function App() {
  const location = useLocation()
  const path = location.pathname

  const isHomeActive = path === '/'
  const isLikesActive = path === '/likes'

  const searchInputRef = useRef(null)

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      const query = searchInputRef.current.value.trim();
      if (!query) {
        searchInputRef.current.focus()
        // Optional focus flash animation
        searchInputRef.current.animate([
          { backgroundColor: 'rgba(255, 135, 135, 0.15)' },
          { backgroundColor: 'transparent' }
        ], { duration: 500, easing: 'ease-out' })
      }
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-8 selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar (Web) */}
      <header className="flex fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Purrfect Gallery</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar (useRef simulation) */}
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 rounded-full px-3.5 py-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="검색어 입력..." 
                className="bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 w-36 focus:w-48 transition-all"
              />
              <button 
                onClick={handleSearchClick}
                className="text-on-surface-variant hover:text-primary active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                aria-label="검색 포커스"
              >
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>

            <nav className="flex gap-6">
              <Link 
                to="/" 
                className={`${isHomeActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:bg-primary-container/10'} pb-1 transition-colors active:scale-95 transition-transform font-headline-md text-headline-md`}
              >
                홈
              </Link>
              <Link 
                to="/likes" 
                className={`${isLikesActive ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:bg-primary-container/10'} pb-1 transition-colors active:scale-95 transition-transform font-headline-md text-headline-md`}
              >
                좋아요 목록
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Routes Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat/:id" element={<CatDetail />} />
        <Route path="/likes" element={<Likes />} />
      </Routes>
    </div>
  )
}

export default App
