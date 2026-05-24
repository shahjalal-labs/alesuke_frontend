'use client'

import GiftFormPage from './GiftFormPage'

export default function Cash() {
  return (
    <GiftFormPage
      title="Gift cash"
      giftType="CASH"
      fields={[
        { key: 'amount', label: 'How much would you like to give', placeholder: 'SGD 10,000', type: 'number' },
      ]}
      recipientTitle="Who would you like to give the cash to?"
      messageHelp="This is where you can tell them more about the gift, why you’re leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
      payloadBuilder={({ values, personalMessage, recipients }) => ({
        giftType: 'CASH',
        amount: Number(String(values.amount ?? '').replace(/[^0-9.]/g, '')),
        personalMessage,
        recipients,
      })}
    />
  )
}
