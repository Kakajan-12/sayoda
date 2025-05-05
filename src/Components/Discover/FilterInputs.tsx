"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { closeDrawer, forToggleDrawer } from "@/app/Redux/DrawerInputs";
import { PoppinFont, QuicksandFont } from "@/Ui/Fonts";
const destiantions = [
  { name: "Kazakhstan" },
  { name: "Kyrgyzystan" },
  { name: "Tajikistan" },
  { name: "Pakistan" },
  { name: "Tajikistan" },
  { name: "Uzbekistan" },
];
interface TypesForFiltr {
  name: string;
  id: string;
  placeholder?: string;
}

export const FilterInputs: React.FC<TypesForFiltr> = ({
  name,
  id,
  placeholder,
}) => {
  const targetRef = useRef<HTMLInputElement | null>(null);
  const active = useSelector((state: RootState) => state.inputs.active);
  const dispacth = useDispatch();
  const [search, setSearch] = useState("");

  const filteredDestinations = destiantions.filter((destination) =>
    destination.name.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleClick = (name: string) => {
    setSearch(name);
  };

  const scrollToSection = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
  const forNotVisible = (event: MouseEvent) => {
    if (
      active &&
      targetRef.current &&
      !targetRef.current.contains(event.target as Node)
    ) {
      dispacth(closeDrawer());
    }
  };
  useEffect(() => {
    document.addEventListener("click", forNotVisible);
    return () => {
      document.removeEventListener("click", forNotVisible);
    };
  }, [active]);
  return (
    <div
      className={` ${PoppinFont.className} flex flex-col  md:items-start w-full gap-2 lg:gap-3 2xl:gap-4 relative  `}
    >
      <h5 className={`md:text-xs  font-medium lg:text-sm  text-sm `}>{name}</h5>
      <label className="flex relative items-center" htmlFor="">
        <input
          ref={targetRef}
          placeholder="select"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => {
            dispacth(forToggleDrawer(id));
            scrollToSection();
          }}
          className="w-full border-[solid,#D9D9D9]   rounded-2xl px-3.5 py-3 md:py-2  lg:py-3 lg:text-sm border-2 text-xs"
          type="text"
        />
        {/* <IoIosArrowDown /> */}
      </label>
      
      <AnimatePresence initial={false}>
        {active === id && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.1 }}
            className={`border-[3px,solid,#D9D9D9] w-full top-24 md:top-[70px] lg:top-20 xl:top-[85px]  bg-white max-h-56 ${
              destiantions.length > 5 ? "overflow-y-scroll" : ""
            }   absolute z-20  border `}
          >
            {filteredDestinations.length == 0 ? (
              <p className="py-3 px-3 gap-3 md:p-3 lg:py-4 ">Not Found</p>
            ) : (
              <div className="flex flex-col  py-3 px-3 gap-3 md:p-3 lg:py-4 ">
                {filteredDestinations.map((items) => (
                  <li
                    onClick={() => {
                      handleClick(items.name);
                    }}
                    className={`cursor-pointer  list-none md:text-xs lg:text-sm xl:text-md 2xl:text-lg pointer ${QuicksandFont.className}`}
                  >
                    {items.name}
                  </li>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FilterInputs;
