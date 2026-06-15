import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton-shimmer rounded-md bg-linear-to-br from-gray-100 via-gray-200 to-gray-100",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
