import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Home() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState([])
  const navigate = useNavigate()

  // Load liked items on mount
  useEffect(() => {
    const saved = localStorage.getItem('likedCats')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setLikedIds(parsed.map(c => c.id))
      } catch (e) {
        console.error(e)
      }
    }
    fetchCats(true)
  }, [])

  const fetchCats = async (isInitial = false) => {
    setLoading(true)
    try {
      // The Cat API public search endpoint
      // Fetching 10 images to display in a grid layout
      const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1', {
        headers: {
          'x-api-key': 'DEMO-API-KEY'
        }
      })
      const data = await res.json()
      
      const newCats = data

      if (isInitial) {
        setCats(newCats)
      } else {
        setCats(prev => [...prev, ...newCats])
      }
    } catch (err) {
      console.error("Error fetching cats:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleHeart = (e, cat) => {
    e.stopPropagation()
    const saved = localStorage.getItem('likedCats')
    let currentLiked = []
    if (saved) {
      try {
        currentLiked = JSON.parse(saved)
      } catch (err) {
        console.error(err)
      }
    }

    const isAlreadyLiked = currentLiked.some(c => c.id === cat.id)
    let updatedLiked = []

    if (isAlreadyLiked) {
      updatedLiked = currentLiked.filter(c => c.id !== cat.id)
      setLikedIds(prev => prev.filter(id => id !== cat.id))
    } else {
      updatedLiked = [...currentLiked, cat]
      setLikedIds(prev => [...prev, cat.id])
    }

    localStorage.setItem('likedCats', JSON.stringify(updatedLiked))
  }

  return (
    <main className="max-w-7xl mx-auto pt-24 px-margin-mobile">
      {/* Bento Grid / Masonry Layout */}
      <div className="grid grid-cols-3 gap-lg" id="cat-grid">
        {cats.map((cat) => {
          const isLiked = likedIds.includes(cat.id)
          return (
            <article 
              key={cat.id} 
              className="bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow hover-lift relative group cursor-pointer"
              onClick={() => navigate(`/cat/${cat.id}`, { state: { cat } })}
            >
              <div className="aspect-square relative overflow-hidden rounded-t-xl bg-surface-container">
                <img 
                  alt="Cat" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={cat.url}
                />
                <button 
                  className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform z-10" 
                  onClick={(e) => toggleHeart(e, cat)}
                  aria-label="좋아요 토글"
                >
                  <span 
                    className={`material-symbols-outlined heart-icon ${isLiked ? 'active' : 'text-outline'}`}
                    style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-primary-container/90 text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full backdrop-blur-md">
                    {cat.breeds?.[0]?.temperament?.split(',')[0]?.trim() || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className="p-md flex justify-between items-center">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">{cat.breeds?.[0]?.name || "이름 정보 없음"}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{cat.breeds?.[0]?.origin || "원산지 정보 없음"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-[20px]">ads_click</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Load More Section */}
      <div className="flex justify-center mt-xl mb-xl">
        {!loading && (
          <button 
            className="bg-primary-container text-on-primary-container font-headline-md text-headline-md py-4 px-8 rounded-full soft-shadow hover-lift flex items-center gap-2 transition-all group" 
            id="loadMoreBtn" 
            onClick={() => fetchCats(false)}
          >
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-y-1">arrow_downward</span>
            <span className="material-symbols-outlined transition-all duration-300 paw-walk-1">pets</span>
            <span className="material-symbols-outlined transition-all duration-300 paw-walk-2">pets</span>
            <span className="material-symbols-outlined transition-all duration-300 paw-walk-3">pets</span>
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-xl" id="loadingSpinner">
          <span className="material-symbols-outlined text-primary text-4xl paw-spinner" style={{ fontSize: '48px' }}>pets</span>
          <p className="mt-4 font-label-md text-label-md text-primary font-bold">귀여운 친구들을 부르는 중...</p>
        </div>
      )}
    </main>
  )
}
