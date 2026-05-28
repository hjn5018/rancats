import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

export default function CatDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [cat, setCat] = useState(location.state?.cat)
  const [loading, setLoading] = useState(!location.state?.cat)
  const [isLiked, setIsLiked] = useState(false)

  // Fetch cat if not passed in location state
  useEffect(() => {
    const fetchSingleCat = async () => {
      try {
        const res = await fetch(`https://api.thecatapi.com/v1/images/${id}`, {
          headers: {
            'x-api-key': 'DEMO-API-KEY'
          }
        })
        const data = await res.json()
        setCat(data)
      } catch (err) {
        console.error("Error fetching single cat detail:", err)
      } finally {
        setLoading(false)
      }
    }

    if (!cat) {
      fetchSingleCat()
    }
  }, [id, cat])

  // Sync likes and notes
  useEffect(() => {
    if (!cat) return

    // 1. Check if liked
    const savedLikes = localStorage.getItem('likedCats')
    if (savedLikes) {
      try {
        const parsed = JSON.parse(savedLikes)
        setIsLiked(parsed.some(c => c.id === cat.id))
      } catch (e) {
        console.error(e)
      }
    }
  }, [cat])

  const toggleLike = () => {
    if (!cat) return
    const savedLikes = localStorage.getItem('likedCats')
    let currentLiked = []
    if (savedLikes) {
      try {
        currentLiked = JSON.parse(savedLikes)
      } catch (err) {
        console.error(err)
      }
    }

    const isAlreadyLiked = currentLiked.some(c => c.id === cat.id)
    let updatedLiked = []

    if (isAlreadyLiked) {
      updatedLiked = currentLiked.filter(c => c.id !== cat.id)
      setIsLiked(false)
    } else {
      updatedLiked = [...currentLiked, cat]
      setIsLiked(true)
    }
    localStorage.setItem('likedCats', JSON.stringify(updatedLiked))
  }



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-primary text-4xl paw-spinner" style={{ fontSize: '48px' }}>pets</span>
        <p className="mt-4 font-label-md text-label-md text-primary font-bold">상세 정보 로딩 중...</p>
      </div>
    )
  }

  if (!cat) {
    return (
      <div className="text-center py-20">
        <h2 className="font-headline-md text-headline-md text-on-surface">고양이 정보를 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"> 홈으로 이동 </button>
      </div>
    )
  }

  const breed = cat.breeds?.[0]
  const temperamentTags = breed?.temperament ? breed.temperament.split(',').map(s => s.trim()) : null

  return (
    <main className="w-full max-w-5xl mx-auto pt-24 pb-margin-mobile px-margin-mobile flex flex-col gap-6">
      {/* Top Header Navigation (Desktop Back Button) */}
      <div className="flex items-center justify-between w-full">
        <button
          aria-label="뒤로가기"
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md active:scale-95 transition-transform"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          뒤로가기
        </button>
      </div>

      <div className="flex flex-row gap-xl">
        {/* Left Column: Visual */}
        <section className="w-1/2 flex-shrink-0 flex flex-col gap-4">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(255,135,135,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] bg-surface-container-lowest border border-white/50 group">
            <img
              alt={breed?.name || "고양이"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={cat.url}
            />
            <button 
              className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform z-10" 
              onClick={toggleLike}
              aria-label="좋아요 토글"
            >
              <span 
                className={`material-symbols-outlined heart-icon ${isLiked ? 'active' : 'text-outline'}`}
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </section>

        {/* Right Column: Data & Actions */}
        <section className="w-1/2 flex flex-col gap-lg pt-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="font-headline-lg font-bold text-on-surface">
                {breed?.name || "이름 정보 없음"}
              </h1>
              <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">public</span>
                {breed?.origin || "출신 정보 없음"}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              {breed?.description ? `"${breed.description}"` : "등록된 품종 설명 정보가 없습니다."}
            </p>
          </div>

          {/* Temperament Tags */}
          <div className="flex flex-wrap gap-2">
            {temperamentTags ? (
              temperamentTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-primary/10 text-on-primary-container font-label-md text-label-md rounded-full border border-primary/20"
                >
                  {tag || "특징 정보 없음"}
                </span>
              ))
            ) : (
              <span className="px-4 py-2 bg-primary/10 text-on-primary-container font-label-md text-label-md rounded-full border border-primary/20">
                특징 정보 없음
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-1 hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-outline text-2xl mb-1">hourglass_empty</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant">수명</p>
              <p className="font-headline-md text-headline-md text-on-surface">{breed?.life_span ? `${breed.life_span} yrs` : "정보 없음"}</p>
            </div>
            <div className="p-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-1 hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-outline text-2xl mb-1">monitor_weight</span>
              <p className="font-label-sm text-label-sm text-on-surface-variant">몸무게</p>
              <p className="font-headline-md text-headline-md text-on-surface">{breed?.weight?.imperial ? `${breed.weight.imperial} lbs` : "정보 없음"}</p>
            </div>
          </div>

          <hr className="border-outline-variant/30 my-2" />


        </section>
      </div>
    </main>
  )
}
