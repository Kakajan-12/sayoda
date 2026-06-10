import React from "react";
import ContactMain from "../../../Components/ContactUs/ContactUsMain";
import ContactForm from "../../../Components/ContactUs/ContactForm";
import LocationSwitcher from "../../../Components/ContactUs/Address";

const page = () => {
  return (
    <section>
      <ContactMain />
      <LocationSwitcher />
      <ContactForm />
    </section>
  );
};

export default page;
