function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export default aR => {
  return [
    {
      title: 'Artikelen\n ',
      text: 'Gesorteerd op omzet',
      color: '#ef3945',
      attachment_type: 'default',
    },
    ...aR.slice(0, 10).map((item, key) => {
      return {
        color: '#ef3945',
        attachment_type: 'default',
        title: `${key + 1}: ${toTitleCase(item.fields.description)}`,
        title_link: `https://us.lightspeedapp.com/?name=item.views.item&form_name=view&id=${
          item.id
        }&tab=details`,
        text: `Omzet: €${item.value}, Winst: €${item.profit} (${
          item.profitPercentage
        }%), Aantal: ${item.quantity}\nVoorraad: ${
          item.fields.ItemShops.ItemShop[0].qoh
        }, Nabestelpunt: ${
          item.fields.ItemShops.ItemShop[0].reorderPoint
        }\nCat: ${(item.fields.Category &&
          item.fields.Category.fullPathName
            .split('/')
            .map(value => {
              return value.slice(0, 8)
            })
            .join('../')) ||
          'Geen categorie'}`,
        color: '#ef3945',
        attachment_type: 'default',
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
    }),
  ]
}
