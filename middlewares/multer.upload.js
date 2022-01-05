const multer = require("multer");
const util = require("util");
const DatauriParser = require("datauri/parser");
const path = require("path");
const storage = multer.memoryStorage();
const dUri = new DatauriParser();
const multerUploader = multer({ storage }).single("image");
const dataUri = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
let processFileMiddleware = util.promisify(multerUploader);
module.exports = { processFileMiddleware, dataUri };