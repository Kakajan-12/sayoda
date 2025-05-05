import React from 'react'
import MainCountries from '../../../../Components/Countries/MainCountries'
import TextsCountry from '../../../../Components/Countries/TextsCountry'
import GalleryCountry from '../../../../Components/Countries/GalleryCountry'

const page = () => {
  return (
    <div>
        <MainCountries/>
        <TextsCountry/>
        <GalleryCountry/>
    </div>
  )
}

export default page