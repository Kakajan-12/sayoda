import { cn } from "@/lib/utils";

/**
 * Заглушка на месте ещё не загруженной картинки.
 *
 * Градиент пишется как bg-linear-to-br — имя из Tailwind 4, на которой
 * проект и собирается.
 *
 * У этой строки уже была история. Когда в проекте стояла третья версия,
 * здесь лежало то же самое имя из четвёртой — класса в сборке не
 * существовало, и фон не задавался вовсе: переменные --tw-gradient-* от
 * from/via/to выставлялись, но читать их было некому. Заглушка выходила
 * полностью прозрачной (background-image none, background-color
 * rgba(0,0,0,0)): на светлых страницах пустое место, а на тёмной карте
 * первого экрана — тёмный прямоугольник, по которому непонятно зачем
 * бегает блик. Тогда имя поправили на bg-gradient-to-br, а с переходом на
 * v4 вернули обратно — теперь оно верное.
 */
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
