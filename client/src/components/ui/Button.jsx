export default function Button({
  children, onClick, variant = 'primary',
  disabled = false, full = false, size = 'md', type = 'button'
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer border-none';
  const variants = {
    primary:  'bg-[#C4622D] text-white hover:bg-[#b05525] active:scale-95',
    dark:     'bg-[#1C1C1A] text-white hover:bg-[#2D2D2A] active:scale-95',
    outline:  'bg-[#F5F0E8] text-[#1C1C1A] border border-[#E0D8CC] hover:border-[#C4622D] hover:text-[#C4622D]',
    ghost:    'bg-transparent text-[#8A8578] hover:text-[#1C1C1A]',
    danger:   'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}