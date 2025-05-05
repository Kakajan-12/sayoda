import React from 'react'
import AddressForm from '../../../Components/ContactUs/Address'
import ContactMain from '../../../Components/ContactUs/ContactUsMain'
import ContactForm from '../../../Components/ContactUs/ContactForm'
import Map from '../../../Components/TourPerPage/Map'

const page = () => {
  return (
    <div className='bg-[#E8ECF0]'>
        <ContactMain/>
        <AddressForm/>
        <ContactForm/>
        <Map/>
    </div>
  )
}

export default page