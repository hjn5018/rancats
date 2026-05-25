import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const getCatBreedAndMood = (cat, index) => {
  const breedsList = ["코숏 치즈", "페르시안", "브리티시 숏헤어", "러시안 블루", "샴", "렉돌", "메인쿤"];
  const moodsList = ["호기심 많은", "활발한", "느긋한", "장난꾸러기", "똑똑한", "조용한", "애교쟁이"];
  
  if (cat.breeds && cat.breeds.length > 0) {
    const breed = cat.breeds[0];
    return {
      name: breed.name,
      breedName: breed.name,
      mood: breed.temperament ? breed.temperament.split(',')[0].trim() : moodsList[index % moodsList.length],
      origin: breed.origin || "Egypt",
      description: breed.description || "The breed is active and a joy to have in your home.",
      temperament: breed.temperament ? breed.temperament.split(',').map(s => s.trim()) : [moodsList[index % moodsList.length]],
      lifespan: breed.life_span || "14 - 15 yrs",
      weight: breed.weight?.imperial || "7 - 10 lbs"
    };
  }
  
  const mockNames = ["루나", "모카", "구름이", "레오", "심바", "코코", "하루", "보리", "까미"];
  return {
    name: mockNames[index % mockNames.length],
    breedName: breedsList[index % breedsList.length],
    mood: moodsList[index % moodsList.length],
    origin: "Korea",
    description: "귀엽고 사랑스러운 외모와 친화력이 돋보이는 고양이 친구입니다.",
    temperament: [moodsList[index % moodsList.length], "친근한", "온순한"],
    lifespan: "12 - 15 yrs",
    weight: "8 - 12 lbs"
  };
};

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
      // Fetching 9 images to display in a 3-column layout
      const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=9&has_breeds=1')
      const data = await res.json()
      
      const newCats = data.map((cat, idx) => {
        const info = getCatBreedAndMood(cat, idx + (isInitial ? 0 : cats.length))
        return {
          ...cat,
          info
        }
      })

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
    <main className="max-w-7xl mx-auto pt-8 md:pt-24 px-margin-mobile">
      {/* Mobile Header (hidden on desktop) */}
      <div className="md:hidden flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Purrfect Gallery</h1>
      </div>

      {/* Bento Grid / Masonry Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg" id="cat-grid">
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
                  className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-sm p-3 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform z-10" 
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
                    {cat.info.mood}
                  </span>
                </div>
              </div>
              <div className="p-md flex justify-between items-center">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">{cat.info.name}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{cat.info.breedName}</p>
                </div>
                <button className="font-label-md text-label-md text-primary bg-primary-container/20 hover:bg-primary-container/30 px-4 py-2 rounded-lg transition-colors">
                  자세히 보기
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Load More Section */}
      <div className="flex justify-center mt-xl mb-xl">
        {!loading && (
          <button 
            className="bg-primary-container text-on-primary-container font-headline-md text-headline-md py-4 px-8 rounded-full soft-shadow bounce-hover hover-lift flex items-center gap-2 transition-all" 
            id="loadMoreBtn" 
            onClick={() => fetchCats(false)}
          >
            <span className="material-symbols-outlined">autorenew</span>
            새로운 고양이 친구들 보기
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
