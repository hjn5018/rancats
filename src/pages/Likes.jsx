import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Likes() {
  const [likedCats, setLikedCats] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('likedCats')
    if (saved) {
      try {
        setLikedCats(JSON.parse(saved))
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  const removeLike = (e, catId) => {
    e.stopPropagation()
    const updated = likedCats.filter(c => c.id !== catId)
    setLikedCats(updated)
    localStorage.setItem('likedCats', JSON.stringify(updated))
  }

  return (
    <main className="flex-grow pt-24 pb-lg px-margin-mobile max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-xl flex items-center justify-between">
        <span className="bg-primary-container/10 text-primary font-label-md text-label-md px-4 py-1 rounded-full">
          {likedCats.length} Cats
        </span>
      </div>

      {likedCats.length > 0 ? (
        /* Cat Image Grid (Populated State) */
        <div className="columns-3 gap-gutter space-y-gutter w-full" id="cat-grid">
          {likedCats.map((cat) => (
            <div 
              key={cat.id}
              className="break-inside-avoid relative group rounded-xl overflow-hidden ambient-shadow transition-all duration-300 hover:-translate-y-1 hover:ambient-shadow-hover bg-white cursor-pointer"
              onClick={() => navigate(`/cat/${cat.id}`, { state: { cat } })}
            >
              <img 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
                src={cat.url}
                alt={cat.breeds?.[0]?.name || cat.info?.breedName || "고양이"}
              />
              {/* Heart Icon (Liked State) */}
              <button 
                className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center bg-surface/85 backdrop-blur-md rounded-full text-secondary-container shadow-sm hover:scale-110 active:scale-90 transition-all duration-200 z-10 group-hover:bg-white"
                onClick={(e) => removeLike(e, cat.id)}
                aria-label="좋아요 삭제"
              >
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
              {/* Tags (Optional overlay on hover) */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <span className="bg-surface-container-highest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm px-3 py-1 rounded-full">
                  {cat.breeds?.[0]?.name || cat.info?.breedName || "품종 정보 없음"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-xl" id="empty-state">
          <div className="w-32 h-32 rounded-full bg-primary-container/20 flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">아직 좋아요한 고양이가 없어요</h2>
        </div>
      )}
    </main>
  )
}
