const { config, uploader } = require('cloudinary');
const cloudinaryConfig = (req, res, next) =>{ 
    console.log('accesinf env',process.env.CLOUDINARY_CLOUD_NAME)
    config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});
next();
}
module.exports= { cloudinaryConfig, uploader };