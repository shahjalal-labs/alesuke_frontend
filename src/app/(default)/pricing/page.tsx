import CTABanner from '@/components/homePage/CTABanner'
import Pricing from '@/components/homePage/Pricing'
import DocumentWill from '@/components/pricing/DocumentWill'
import HeadingSection from '@/components/pricing/HeadingSection'
import WillInclude from '@/components/pricing/WillInclude'
import React from 'react'
import Footer from '@/shared/Footer';

function page() {
  return (
    <div>
        <HeadingSection/>
        <Pricing/>
        <WillInclude/>
        <DocumentWill/>
        <CTABanner/>
      <Footer />
    </div>
  )
}

export default page