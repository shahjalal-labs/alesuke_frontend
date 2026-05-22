import CTABanner from '@/components/homePage/CTABanner'
import Video from '@/components/HowItWorks/Video'
import React from 'react'
import Footer from '@/shared/Footer';

function page() {
  return (
    <div>
        <Video/>
       <div className='bg-[#FAFAFA]'>
         <CTABanner/>
       </div>
      <Footer />
    </div>
  )
}

export default page