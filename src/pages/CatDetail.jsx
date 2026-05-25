import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getCatBreedAndMood } from './Home'

export default function CatDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [cat, setCat] = useState(location.state?.cat || null)
  const [loading, setLoading] = useState(!location.state?.cat)
  const [isLiked, setIsLiked] = useState(false)
  const [note, setNote] = useState('')
  
  // useRef hook to control focus of note input
  const inputRef = useRef(null)

  // Fetch cat if not passed in location state
  useEffect(() => {
    const fetchSingleCat = async () => {
      try {
        const res = await fetch(`https://api.thecatapi.com/v1/images/${id}`)
        const data = await res.json()
        const info = getCatBreedAndMood(data, 0)
        setCat({ ...data, info })
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

    // 2. Load note
    const savedNotes = localStorage.getItem('catNotes')
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes)
        if (parsed[cat.id]) {
          setNote(parsed[cat.id])
        }
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

  const handleNoteChange = (e) => {
    const val = e.target.value
    setNote(val)

    const savedNotes = localStorage.getItem('catNotes')
    let currentNotes = {}
    if (savedNotes) {
      try {
        currentNotes = JSON.parse(savedNotes)
      } catch (err) {
        console.error(err)
      }
    }

    currentNotes[cat.id] = val
    localStorage.setItem('catNotes', JSON.stringify(currentNotes))
  }

  const handleFocus = () => {
    // Focus the input using the ref
    if (inputRef.current) {
      inputRef.current.focus()
      // Optional animation trigger
      inputRef.current.animate([
        { backgroundColor: 'rgba(112, 93, 0, 0.1)' },
        { backgroundColor: '#ffffff' }
      ], { duration: 500, easing: 'ease-out' })
    }
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

  return (
    <main className="w-full max-w-5xl mx-auto pt-24 pb-32 md:pb-margin-mobile px-margin-mobile flex flex-col md:flex-row gap-xl">
      {/* Top Header Navigation for Mobile */}
      <header className="fixed top-0 left-0 w-full z-50 px-margin-mobile py-4 flex items-center justify-between pointer-events-none">
        <button 
          aria-label="뒤로가기" 
          className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-surface/85 backdrop-blur-md shadow-sm border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95 group" 
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
        <button 
          aria-label="공유하기" 
          className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-surface/85 backdrop-blur-md shadow-sm border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">share</span>
        </button>
      </header>

      {/* Left Column: Visual */}
      <section className="w-full md:w-1/2 flex-shrink-0 flex flex-col gap-4">
        <div className="relative w-full aspect-[4/5] md:aspect-square rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(255,135,135,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] bg-surface-container-lowest border border-white/50 group">
          <img 
            alt={cat.info.breedName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src={cat.url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </section>

      {/* Right Column: Data & Actions */}
      <section className="w-full md:w-1/2 flex flex-col gap-lg md:pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-on-surface">
              {cat.info.name}
            </h1>
            <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">public</span>
              {cat.info.origin}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            "{cat.info.description}"
          </p>
        </div>

        {/* Temperament Tags */}
        <div className="flex flex-wrap gap-2">
          {cat.info.temperament.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-4 py-2 bg-primary/10 text-on-primary-container font-label-md text-label-md rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-1 hover:-translate-y-1 transition-transform">
            <span className="material-symbols-outlined text-outline text-2xl mb-1">hourglass_empty</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">수명</p>
            <p className="font-headline-md text-headline-md text-on-surface">{cat.info.lifespan}</p>
          </div>
          <div className="p-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-1 hover:-translate-y-1 transition-transform">
            <span className="material-symbols-outlined text-outline text-2xl mb-1">monitor_weight</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">몸무게</p>
            <p className="font-headline-md text-headline-md text-on-surface">{cat.info.weight}</p>
          </div>
        </div>

        <hr className="border-outline-variant/30 my-2" />

        {/* Like Button */}
        <button 
          onClick={toggleLike}
          className={`relative overflow-hidden w-full py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(255,217,61,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group ${
            isLiked 
              ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/95' 
              : 'bg-primary-container text-on-primary-container'
          }`}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
          <span 
            className={`material-symbols-outlined ${isLiked ? 'text-secondary font-bold scale-110 active' : 'text-outline'} transition-transform duration-300`} 
            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span>{isLiked ? '좋아요 취소' : '이 고양이 좋아요'}</span>
        </button>

        {/* Contextual Input (useRef simulation) */}
        <div className="mt-2 p-5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface flex items-center gap-2" htmlFor="cat-note">
              <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
              관찰 메모 남기기
            </label>
            <button 
              className="text-xs px-3 py-1 bg-surface rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors border border-outline-variant/50 font-label-sm flex items-center gap-1 shadow-sm" 
              onClick={handleFocus}
            >
              입력창 포커스 <span className="material-symbols-outlined text-[14px]">keyboard_return</span>
            </button>
          </div>
          <div className="relative group/input">
            <input 
              ref={inputRef}
              id="cat-note" 
              className="w-full p-4 pr-12 rounded-lg bg-surface focus:bg-surface-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 shadow-inner" 
              placeholder="이 고양이에 대한 특별한 기억이나 특징..." 
              type="text"
              value={note}
              onChange={handleNoteChange}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within/input:text-primary transition-colors pointer-events-none">pets</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant px-1 opacity-70">
            * 작성된 메모는 브라우저 로컬 환경에만 임시 보관됩니다.
          </p>
        </div>
      </section>
    </main>
  )
}
