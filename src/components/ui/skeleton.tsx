import { cn } from "@/lib/utils";

/**
 * Заглушка на месте ещё не загруженной картинки.
 *
 * Градиент пишется как bg-gradient-to-br — это Tailwind 3, который здесь и
 * стоит. Раньше было bg-linear-to-br, имя из четвёртой версии: такого класса
 * в сборке не существует, поэтому фон не задавался вовсе. Переменные
 * --tw-gradient-* от from/via/to при этом выставлялись, но читать их было
 * некому, и заглушка выходила полностью прозрачной: background-image none,
 * background-color rgba(0,0,0,0). На светлых страницах это выглядело как
 * пустое место, а на тёмной карте первого экрана — как тёмный прямоугольник,
 * по которому непонятно зачем бегает блик.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton-shimmer rounded-md bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
