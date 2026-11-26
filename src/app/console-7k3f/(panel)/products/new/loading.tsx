import { Skeleton } from "@/components/ui/skeleton";

export default function NewProductLoading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Back link */}
      <Skeleton className="h-4 w-20" />

      {/* Title */}
      <Skeleton className="h-8 w-36" />

      {/* Product details card */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <Skeleton className="h-3 w-28" />

        {/* Image uploader */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Variants card */}
      <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
        <div className="rounded-xl bg-[#F9F4F0] p-3 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Skeleton className="h-11 w-full rounded-3xl" />
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>
    </main>
  );
}
