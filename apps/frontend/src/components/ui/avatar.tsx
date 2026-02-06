interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  // Generate warna berdasarkan nama
  const generateColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const bgColor = generateColor(fallback);

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            // Fallback kalau gambar gagal load
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}

      <div
        className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${src ? "hidden" : ""}`}
      >
        {fallback}
      </div>
    </div>
  );
}
