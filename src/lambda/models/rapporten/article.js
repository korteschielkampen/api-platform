function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export default aR => {
  aR.slice(0, 10).map((item, key) => {
    console.log(item.id, item.fields.ItemShops.ItemShop[0].qoh)
  })

  return {
    color: '#ef3945',
    attachment_type: 'default',
    fields: [
      ...aR.slice(0, 10).map((item, key) => {
        return {
          title: `${key + 1}: ${toTitleCase(item.fields.description)}`,
          value: `Omzet: €${item.value}, Aantal: ${item.quantity}\nVoorraad: ${
            item.fields.ItemShops.ItemShop[0].qoh
          }, Nabestelpunt: ${item.fields.ItemShops.ItemShop[0].reorderPoint}`,
          color: '#40abff',
          attachment_type: 'default',
          short: true,
        }
      }),
    ],
    // actions: [
    //   {
    //     name: 'Button',
    //     text: 'Aantal',
    //     type: 'button',
    //   },
    //   {
    //     name: 'Button',
    //     text: 'Omzet',
    //     type: 'button',
    //   },
    //   {
    //     name: 'Button',
    //     text: 'Winstgevendheid',
    //     type: 'button',
    //   },
    // ],
  }
}
