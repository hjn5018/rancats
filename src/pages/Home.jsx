import { useState, useEffect } from 'react'
import CatCard from '../components/CatCard'
import LoadingSpinner from '../components/LoadingSpinner'


export default function Home() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState([])

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

  const toggleHeart = (cat) => {
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
        {cats.map((cat) => (
          <CatCard
            key={cat.id}
            cat={cat}
            isLiked={likedIds.includes(cat.id)}
            onHeartClick={toggleHeart}
          />
        ))}
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
      {loading && <LoadingSpinner message="귀여운 친구들을 부르는 중..." />}
    </main>
  )
}
