import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CatDetail from './pages/CatDetail'
import Likes from './pages/Likes'

function App() {
  const location = useLocation()
  const path = location.pathname

  const isHomeActive = path === '/'
  const isLikesActive = path === '/likes'

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-24 md:pb-8 selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar (Web) */}
      <header className="hidden md:flex fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Purrfect Gallery</span>
            </Link>
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
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:bg-primary-container/10 transition-colors rounded-full p-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Routes Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat/:id" element={<CatDetail />} />
        <Route path="/likes" element={<Likes />} />
      </Routes>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-margin-mobile pb-safe bg-surface/50 backdrop-blur-lg shadow-[0_-10px_25px_-5px_rgba(255,135,135,0.1)] rounded-t-xl z-50">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center rounded-full px-5 py-1 transition-all duration-200 ${
            isHomeActive 
              ? 'bg-primary-container text-on-primary-container font-bold scale-105' 
              : 'text-on-surface-variant hover:scale-110'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isHomeActive ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="font-label-sm text-label-sm mt-0.5">홈</span>
        </Link>

        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center text-on-surface-variant hover:scale-110 transition-all duration-200`}
        >
          <span className="material-symbols-outlined">pets</span>
          <span className="font-label-sm text-label-sm mt-0.5">랜덤</span>
        </Link>

        <Link 
          to="/likes" 
          className={`flex flex-col items-center justify-center rounded-full px-5 py-1 transition-all duration-200 ${
            isLikesActive 
              ? 'bg-primary-container text-on-primary-container font-bold scale-105' 
              : 'text-on-surface-variant hover:scale-110'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLikesActive ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          <span className="font-label-sm text-label-sm mt-0.5">좋아요</span>
        </Link>
      </nav>
    </div>
  )
}

export default App
