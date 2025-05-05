import { Poppins, Comfortaa, Quicksand, Montserrat } from "next/font/google";

export const PoppinFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const ComfortaFont = Comfortaa({
  subsets: ["cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-comforta",
});
export const QuicksandFont = Quicksand({
  subsets: ["latin-ext"],
  variable: "--font-quicksand",
});

export const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});
