export default (status, action, err) => {
  let notification
  switch (status) {
    case 'loading':
      return {
        status: {
          text: `${action.name} starting`,
          color: 'grey',
          sign: 'loading',
          show: 10,
        },
      }
      break
    case 'success':
      return {
        status: {
          text: `${action.name} succesvol`,
          color: 'green',
          sign: 'done',
          show: 2,
        },
      }
      break
    case 'error':
      return {
        status: {
          text: `${action.name} ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
          show: 2,
        },
      }
      break
    default:
      console.log('Unknown notification type')
  }
}
