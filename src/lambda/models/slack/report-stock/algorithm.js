export default data => {
  return data.map(i => {
    return {
      title: `${i.data.description}`,
      text: `${i.reason}`,
      color: '#ef3945',
      attachment_type: 'default',
      title_link: `https://us.lightspeedapp.com/?name=item.views.item&form_name=view&id=${
        i.data.itemID
      }&tab=details`,
    }
  })
}
