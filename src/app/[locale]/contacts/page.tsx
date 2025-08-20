import React from 'react'
import ContactMain from '../../../Components/ContactUs/ContactUsMain'
import ContactForm from '../../../Components/ContactUs/ContactForm'
import LocationSwitcher from "../../../Components/ContactUs/Address";

const page = () => {
  return (
    <div className='bg-[#E8ECF0]'>
        <ContactMain/>
        <LocationSwitcher/>
        <ContactForm/>
    </div>
  )
}

export default page