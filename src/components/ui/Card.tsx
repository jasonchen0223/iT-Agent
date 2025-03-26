// components/ui/Card.tsx
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  withBorder?: boolean;
}

export function Card({
  children,
  className,
  hoverable = false,
  withBorder = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-indigo-950/40 to-black/40 backdrop-blur-sm rounded-lg p-6",
        withBorder && "border border-indigo-800/30",
        hoverable && "hover:border-indigo-500 transition-colors",
        className,
      )}
      data-oid="7n-crmg"
    >
      {children}
    </div>
  );
}

// 卡片标题
export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn("text-xl font-semibold text-indigo-100 mb-4", className)}
      data-oid="kelwxwr"
    >
      {children}
    </h3>
  );
}

// 卡片内容
export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-indigo-300/70", className)} data-oid="kkf8lf9">
      {children}
    </div>
  );
}

// 卡片底部
export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-indigo-800/30", className)}
      data-oid="jo0z:kb"
    >
      {children}
    </div>
  );
}
