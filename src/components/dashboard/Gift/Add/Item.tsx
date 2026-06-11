'use client'

import GiftFormPage from './GiftFormPage'

export default function Item() {
  return (
    <GiftFormPage
      title="Gift a personal possession"
      introLines={[
        "You may only have one guitar now, but if you buy another one in the future, people won't know which one you were talking about.",
        'Always be as specific as possible so that your wishes are easy to understand.',
      ]}
      giftType="ITEM"
      fields={[
        { key: 'itemName', label: 'What is the item?', placeholder: 'Enter your item name' },
        { key: 'description', label: 'Description of the item', placeholder: 'Enter a description' },
      ]}
      recipientTitle="Who would you like to give the item to?"
      messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
      payloadBuilder={({ values, personalMessage, recipients }) => ({
        giftType: 'ITEM',
        itemName: values.itemName,
        description: values.description,
        personalMessage,
        recipients,
      })}
    />
  )
}
