import BlogsCards from "@/Components/MainComonents/BlogsCards";
import Explore from "@/Components/MainComonents/Explore";
import MainSwiper from "@/Components/MainComonents/MainSwiper";
import PopularCards from "@/Components/MainComonents/PopularCards";

export default function Home() {
  return (
    <div >
      <MainSwiper />
      <Explore />
      <PopularCards />
      <BlogsCards/>
    </div>
  );
}
