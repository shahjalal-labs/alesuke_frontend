'use client'

import GiftFormPage from './GiftFormPage'

export default function Vehicle() {
  return (
    <GiftFormPage
      title="Gift a vehicle"
      introLines={[
        'Here, the car will pass to your beneficiary only if the same vehicle remains in your ownership when you die.',
      ]}
      giftType="VEHICLE"
      fields={[
        { key: 'vehicleDetails', label: 'What is the vehicle?', placeholder: 'Description of the vehicle' },
        { key: 'charitySearch', label: 'Search for a charity', placeholder: 'Enter a charity name' },
      ]}
      recipientTitle="Who would you like to give the vehicle to?"
      messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
      payloadBuilder={({ values, personalMessage, recipients }) => ({
        giftType: 'VEHICLE',
        vehicleDetails: values.vehicleDetails,
        personalMessage,
        recipients,
      })}
    />
  )
}
