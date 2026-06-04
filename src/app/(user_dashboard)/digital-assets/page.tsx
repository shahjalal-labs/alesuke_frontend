import DigitalAssets from '@/components/dashboard/DigitalAssets/DigitalAssets'
import DashboardHeader from '@/components/dashboard/myWill/DashboardHeader'
import React from 'react'

function page() {
  return (
    <div>
         <DashboardHeader />
        <DigitalAssets />
    </div>
  )
}

export default page