const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(process.cwd(), 'Keys','yokesh-portfolio-8f28793a1839.json')


const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'yokesh-portfolio',
})



module.exports = storage