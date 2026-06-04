import Hero from "@/components/homePage/Hero";
import WhyWillWay from "@/components/homePage/WhyWillWay";
import HowItWorks from "@/components/homePage/HowItWorks";
import Pricing from "@/components/homePage/Pricing";
import Process from "@/components/homePage/Process";
import FAQ from "@/components/homePage/FAQ";
import CTABanner from "@/components/homePage/CTABanner";
import Footer from '@/shared/Footer';
 
function Page() {
  return (
   <div>
        <Hero />
        <WhyWillWay/>
        <Pricing/>
        <HowItWorks/>
        <Process/>
        <FAQ/>
        <CTABanner/>
      <Footer />
   </div>
  )
}

export default Page

