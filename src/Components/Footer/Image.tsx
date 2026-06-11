import NextImage from "next/image";
import footerImage from "../../../public/image2.png";

const FooterImage = () => {
  return (
    <div className="w-full bg-white">
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
