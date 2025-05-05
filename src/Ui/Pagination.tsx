import React from "react";
import Pagination from "@mui/material/Pagination";
interface Props {
  onchange: (_: React.ChangeEvent<unknown>, value: number) => void;
  page: number;
  items: any[];
  itemsPerPage: number
}

const PaginationUi: React.FC<Props> = ({ onchange, page, items , itemsPerPage}) => {
  return (
    <div className=" w-full py-20  shadow-2xl   ">
      <div className=" container  mx-auto  flex justify-center items-center ">
        <Pagination
          sx={{
            "& .MuiPaginationItem-ellipsis": {
              backgroundColor: "transparent !important", // Убираем фон у точек
              border: "none !important", // Если нужно убрать границу
              color: "#002A5F66 !important", // Оставляем цвет как у обычного текста
              fontSize: "35px !important", // Размер шрифта точек
              minWidth: "43px !important", // Минимальная ширина точки
              minHeight: "55px !important", //// Минимальная высота точки
              width: "auto !important", // Задаем ширину точек
              height: "30px !important", // Задаем высоту точек
              padding: "0px !important", // Задаем высоту точек
            },

            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#245483", // Фон активной кнопки
              color: "white", // Цвет текста активной кнопки
              scale: "1.3",
              "&:hover": {
                backgroundColor: "#245483", // Убираем цвет фона при наведении
                boxShadow: "none", // Убираем возможные тени
              },
            },
            "& .MuiPaginationItem-root": {
              color: "white", // Цвет текста
              backgroundColor: " #002A5F66",
              padding: "10px",
              border: "none",
              minWidth: "4px",
              //   width: "10px !important", // Задаем ширину каждой кнопки пагинации
              width: {
                xs: "10px", // Для мобильных экранов (xs)
                md: "30px", // Для средних экранов (md)
              },
              height: {
                xs: "15px", // Для мобильных экранов (xs)
                md: "30px", // Для средних экранов (md)
              },
              margin: {
                xs: "3px", // Для мобильных экранов (xs)
                md: "5px", // Для средних экранов (md)
              },
              fontSize: "10px", // Увеличиваем шрифт
              "&:hover": {
                backgroundColor: "#245483", // Убираем цвет фона при наведении
                boxShadow: "none", // Убираем возможные тени
              },
            },
            "& .MuiPaginationItem-previousNext": {
              backgroundColor: "transparent", // Меняем цвет фона
              color: "#245483",
              fontSize: "2000rem !important", // Увеличиваем размер текста
              padding: "8px 16px !important", // Увеличиваем внутренние отступы для кнопок
              borderRadius: "8px", // Можно добавить скругление
              marginLeft: "10px",
              marginRight: "10px",
              minHeight: "40px",
              "& .MuiPaginationItem-icon": {
                fontSize: "40px",
              },
              "&:hover": {
                backgroundColor: "transparent", // Убираем цвет фона при наведении
                boxShadow: "none", // Убираем возможные тени
              },
            },
          }}
          siblingCount={0}
          onChange={onchange}
          page={page}
          count={Math.ceil(items.length / itemsPerPage)}
          size="small"
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default PaginationUi;
