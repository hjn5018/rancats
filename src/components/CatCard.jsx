import { useNavigate } from 'react-router-dom'

export default function CatCard({ cat, variant = 'grid', isLiked = false, onHeartClick }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/cat/${cat.id}`, { state: { cat } })
  }

  const handleHeartClick = (e) => {
    e.stopPropagation()
    if (onHeartClick) {
      onHeartClick(cat)
    }
  }

  if (variant === 'masonry') {
    return (
      <div 
        className="break-inside-avoid relative group rounded-xl overflow-hidden ambient-shadow transition-all duration-300 hover:-translate-y-1 hover:ambient-shadow-hover bg-white cursor-pointer"
        onClick={handleCardClick}
      >
        <img 
          className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
          src={cat.url}
          alt={cat.breeds?.[0]?.name || cat.info?.breedName || "고양이"}
        />
        {/* Heart Icon (Liked State) */}
        <button 
          className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center bg-surface/85 backdrop-blur-md rounded-full text-secondary-container shadow-sm hover:scale-110 active:scale-90 transition-all duration-200 z-10 group-hover:bg-white"
          onClick={handleHeartClick}
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
    )
  }

  // Default: 'grid' variant (Home page style)
  return (
    <article 
      className="bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow hover-lift relative group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-xl bg-surface-container">
        <img 
          alt="Cat" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          src={cat.url}
        />
        <button 
          className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform z-10" 
          onClick={handleHeartClick}
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
}
