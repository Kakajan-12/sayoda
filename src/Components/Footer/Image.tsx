import NextImage from "next/image";
import footerImage from "../../../public/image.png";

const FooterImage = () => {
  return (
    <div className="w-full bg-white leading-none mb-10">
      <NextImage
        src={footerImage}
        alt="Ashgabat skyline"
        className="w-full h-auto block"
        sizes="100vw"
        priority={false}
      />
    </div>
  );
};

export default FooterImage;
