'use client'

import GiftFormPage from './GiftFormPage'

export default function Collection() {
  return (
    <GiftFormPage
      title="Gift a collection of items"
      introLines={[
        "Whether it’s classic novels, collector’s editions, or a growing stack of favorites, your book collection probably still has room to grow.",
        'Add “at the date of my death” to ensure your full library is passed on exactly as intended.',
      ]}
      giftType="COLLECTION"
      fields={[
        { key: 'itemName', label: 'What is the collection?', placeholder: 'Description of the collection' },
        { key: 'description', label: 'Description of the collection', placeholder: 'Description of the collection' },
      ]}
      recipientTitle="Who would you like to give the collection to?"
      messageHelp="This is where you can tell them more about the gift, why you're leaving it to them or what you want them to do with it. Please note, they will not be legally obliged to carry out your wishes."
      payloadBuilder={({ values, personalMessage, recipients }) => ({
        giftType: 'COLLECTION',
        itemName: values.itemName,
        description: values.description,
        personalMessage,
        recipients,
      })}
    />
  )
}
