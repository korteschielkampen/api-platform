import moment from 'moment'

import createBusinessReport from './action/create-business-report.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let datesArray = _.times(1, i => {
      return {
        date: moment()
          .subtract(i, 'days')
          .format(),
        lsRefresh: true,
        delay: 2000 * i,
      }
    })
    let channel = 'CAPCPRW6B'

    await createBusinessReport(datesArray, channel)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
