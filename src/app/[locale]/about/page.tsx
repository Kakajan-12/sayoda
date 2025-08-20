import React from 'react'
import AboutUs from '../../../Components/AboutUs/AboutUs'
import Services from '../../../Components/AboutUs/Services'
import WhyChoose from '../../../Components/AboutUs/WhyChoose'
import HowToWork from '../../../Components/AboutUs/HowToWork'
import Testimonials from '../../../Components/AboutUs/Testimonials'

const page = () => {
  return (
    <div>
        <AboutUs/>
        <Services/>
        <WhyChoose />
        <HowToWork/>
        <Testimonials/>
    </div>
  )
}

export default page