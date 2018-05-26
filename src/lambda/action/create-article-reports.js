import createArticleReport from '../transformation/lightspeed-items--to--article-report.js'

export default async (sales, items, soldItems) => {
  return createArticleReport(items, soldItems)
}
