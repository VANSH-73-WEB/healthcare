import React from "react";
import Hero from "./home/Hero.jsx";
import Stats from "./home/Stats.jsx";
import Services from "./home/Services.jsx";
import Doctors from "./home/Doctors.jsx";
import WhyChooseUs from "./home/WhyChooseUs.jsx";
import Testimonials from "./home/Testimonials.jsx";
import AppointmentCTA from "./home/AppointmentCTA.jsx";
import EmergencyCare from "./home/EmergencyCare.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Doctors />
      <WhyChooseUs />
      <Testimonials />
      <AppointmentCTA />
      <EmergencyCare />
    </>
  );
}
