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
    let datesArray = [
      {
        date: moment().format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(1, 'days')
          .format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(2, 'days')
          .format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(3, 'days')
          .format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(4, 'days')
          .format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(5, 'days')
          .format(),
        lsRefresh: false,
      },
      {
        date: moment()
          .subtract(6, 'days')
          .format(),
        lsRefresh: false,
      },
    ]
    let channel = 'CAPCPRW6B'

    await createBusinessReport(datesArray, channel)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
