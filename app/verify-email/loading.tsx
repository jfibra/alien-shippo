import { Skeleton } from "@/components/ui/skeleton"

export default function VerifyEmailLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="space-y-4 text-center">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
    </div>
  )
}
