export default function Loading() {
  return <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
    <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent w-10 h-10" />
    <p className="text-zinc-400 text-sm">
      Loading Form Builder...</p>
  </div>
}
