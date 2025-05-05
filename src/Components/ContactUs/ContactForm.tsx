import { useTranslations } from 'next-intl'
import React from 'react'

const ContactForm = () => {
  const t = useTranslations("ContactUs")
  return (
   <div className='w-full  py-10'>
    <div className='container mx-auto px-5  shadow-[0px,10px,10px,0px,#00000040] '>
     <form className="shadow-xl px-5 w-full bg-white rounded-2xl grid gap-y-7 py-10  md:gap-x-5  grid-cols-1  md:grid-cols-2" action="">
        <input className="border w-full py-2 px-5 rounded-lg" type="text" placeholder={`${t('Iname')}`} />
        <input className="border w-full py-2 px-5 rounded-lg" type="email" placeholder={`${t('Iemail')}`}  />
        <input className="border w-full py-2 px-5 rounded-lg md:col-span-full" type="text" placeholder={`${t('Isubject')}`}  />
        <textarea  className="border w-full resize-none h-48  py-2 text-gray-500  rounded-lg md:col-span-full px-5 " placeholder={`${t('Imessage')}`}   name="message" id="">
        </textarea>
        <button type="submit" className="col-span-full justify-self-center max-w-60 bg-mainBlue py-2 px-10  rounded-xl text-white">{t("btn")}</button>
    </form>
    </div>
   </div>
  )
}

export default ContactForm