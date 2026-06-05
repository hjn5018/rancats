export default function EmptyState({ 
  icon = 'pets', 
  title, 
  buttonText, 
  onButtonClick 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-xl" id="empty-state">
      {icon && (
        <div className="w-32 h-32 rounded-full bg-primary-container/20 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      )}
      <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{title}</h2>
      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick} 
          className="mt-6 bg-primary text-white px-6 py-2.5 rounded-full font-headline-md text-headline-md hover:bg-primary/95 hover-lift active:scale-95 transition-all shadow-sm"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
