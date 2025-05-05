import { m } from "framer-motion";
import imgTest from "../../../../public/Testss/9 fascinating facts about Turkmenistan.png";
import imgblogs from "../../../../public/Testss/BlogsCardImg.png";
const popular = {
  tittle: "Discover the Ancient Marvels of Kunya-Urgench",
  description:
    "Step back in time and explore the legendary ruins of Kunya-Urgench, the former capital of the Khorezm Empire. ",
  price: 100,
  day: 10,
  group: "1-6",
  img: imgTest,
};

export const popularArray = new Array(8).fill(popular);

const blogs = {
  img: imgblogs,
  tittle: "Why Travel to Central Asia?",
  description:
  'Nestled between Europe and Asia, Central Asia is a land of breathtaking landscapes, ancient cities, and rich cultural heritage. Often called the "Heart of the Silk Road," this region offers a unique blend of adventure, history, and hospitality that remains undiscovered by many travelers. ',
};
export const blogsArray = new Array(5).fill(blogs);


const TourAccordion = {
  day : '10',
  tittle : 'Samarkand – The Pearl of the Silk Road',
  li: [
    {lii :  'Meet and greet at the airport'},
    {lii :  'City tour of Tashkent: Chorsu Bazaar,Kukeldash Madrasah, and Independence Square'},
    {lii :  'Welcome dinner with traditional Uzbek cuisine'},
  ]
}
export const TourAccordionArray = new Array(6).fill(TourAccordion)

 export const DatesAvailable  =[
  {
    start : 'April 10',
    end: 'April 20',
    status: 'Available'
  },
  {
    start : 'April 10',
    end: 'April 20',
    status: 'Limited Spots'
  },
  {
    start : 'April 10',
    end: 'April 20',
    status: 'Fully booked'
  },
  {
    start : 'April 10',
    end: 'April 20',
    status: 'Available'
  },
  {
    start : 'April 10',
    end: 'April 20',
    status: 'Limited Spots'
  },

]

const includes = {
  name: 'Accommodation in 3-4 star hotels & desert camp'
}

const excludes = {
  name: 'International flights'
}

export const  includesArray = new Array(5).fill(includes)
export const  exludesArray = new Array(3).fill(excludes)
