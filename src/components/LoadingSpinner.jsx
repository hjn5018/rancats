export default function LoadingSpinner({ message = '로딩 중...', className = 'py-xl' }) {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`} id="loadingSpinner">
      <span className="material-symbols-outlined text-primary text-4xl paw-spinner" style={{ fontSize: '48px' }}>pets</span>
      <p className="mt-4 font-label-md text-label-md text-primary font-bold">{message}</p>
    </div>
  )
}
