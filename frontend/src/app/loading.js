export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute w-8 h-8 bg-blue-50 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 text-gray-500 font-semibold animate-pulse tracking-wide uppercase text-sm">
        Loading System Data...
      </p>
    </div>
  );
}
