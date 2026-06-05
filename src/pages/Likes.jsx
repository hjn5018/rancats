import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CatCard from '../components/CatCard'
import EmptyState from '../components/EmptyState'

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

  const removeLike = (cat) => {
    const updated = likedCats.filter(c => c.id !== cat.id)
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
            <CatCard
              key={cat.id}
              cat={cat}
              variant="masonry"
              isLiked={true}
              onHeartClick={removeLike}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <EmptyState 
          title="아직 좋아요한 고양이가 없어요" 
          buttonText="홈으로 이동"
          onButtonClick={() => navigate('/')}
        />
      )}
    </main>
  )
}
