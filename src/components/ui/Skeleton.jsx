export default function Skeleton({ width, height, className = '' }) {
  return (
    <div
      className={`
        rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
        bg-[length:200%_100%] animate-shimmer
        ${width ?? 'w-full'} ${height ?? 'h-4'} ${className}
      `}
      style={{ willChange: 'background-position' }}
    />
  );
}
