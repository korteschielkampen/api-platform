import moment from 'moment'

import createBusinessReport from './actions/create-business-report.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let dates = {
      start: moment()
        .subtract(31, 'days')
        .format(),
      end: moment().format(),
    }

    let postSlack = {
      post: true,
      channel: 'C97BAQ41J',
    }

    // Do the main action
    await createBusinessReport(dates, postSlack)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
