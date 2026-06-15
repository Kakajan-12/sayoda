import ImageWithSkeleton from "@/Ui/ImageWithSkeleton";
import footerImage from "../../../public/image2.png";

const FooterImage = () => {
  return (
    <div className="relative w-full bg-white">
      <ImageWithSkeleton
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
