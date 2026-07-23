type LingimoMarkProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function LingimoMark({ className = '', size = 'md', label = 'LINGIMO' }: LingimoMarkProps) {
  return (
    <div className={`lingimo-mark lingimo-mark-${size} ${className}`} aria-label="Lingimo">
      <span className="lingimo-mark-orbit lingimo-mark-orbit-one" />
      <span className="lingimo-mark-orbit lingimo-mark-orbit-two" />
      <span className="lingimo-mark-core">
        <span className="lingimo-mark-word">{label}</span>
      </span>
    </div>
  )
}
