const {processFileMiddleware} = require("../middlewares/multer.upload");
const { format } = require("util");
// Instantiate a storage client with credentials
const storage = require('../storage/googlecloud.config');


exports.upload = async (req, res) => {
    const bucket = storage.bucket("yokesh-portfolio.appspot.com");
    try {
      await processFileMiddleware(req, res);
  
      if (!req.file) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      const folderName=await req.body.folderName;
      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(`${folderName}/`+req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
  
      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
      });
  
      blobStream.on("finish", async (data) => {
        // Create URL for directly file access via HTTP.
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
  
        try {
          // Make the file public
          await bucket.file(`${folderName}/`+req.file.originalname).makePublic();
        } catch {
          return res.status(500).send({
            message:
              `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
            url: publicUrl,
          });
        }
  
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
          url: publicUrl,
        });
      });
  
      blobStream.end(req.file.buffer);
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };
  
  exports.getListFiles = async (req, res) => {
    try {
     const folderName=req.params.folderName;
     const bucket = storage.bucket("yokesh-portfolio.appspot.com",);
     const bucketName=folderName==='all'?'':folderName;
    const [files] = await bucket.getFiles({prefix:`${bucketName}`});
      let fileInfos = [];
      files.forEach((file) => {
        fileInfos.push({
          name: file.name,
          url: file.metadata.mediaLink,
          publicUrl : file.publicUrl(),
          isCopy:false
        });
      });
  
      res.status(200).send(fileInfos);
    } catch (err) {
      console.log(err.message);
  
      res.status(500).send({
        message: "Unable to read list of files!",
      });
    }
  };
  
  exports.download = async (req, res) => {
    try {
      const [metaData] = await bucket.file(req.params.name).getMetadata();
      res.redirect(metaData.mediaLink);
      
    } catch (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  };
  exports.remove = async (req, res) => {
    const bucket = storage.bucket("yokesh-portfolio.appspot.com");
    if (!req.body.bucketPath) {
        return res.status(400).send({ message: "Please specify a file name!" });
      }
    const bucketpath = req.body.bucketPath;
    await bucket
      .file(`${bucketpath}`)
      .delete()
      .then((response) => {
        res.status(200).send({message:`${bucketpath} image deleted`});
      })
      .catch((err) => res.json(err.message));
  };
  exports.removeall = async (req, res) => {
    const bucket = storage.bucket("yokesh-portfolio.appspot.com");
    const removeName = req.params.folderName;
    await bucket.deleteFiles(
      {
        prefix: `${removeName}/`,
      },
      function (err) {
        if (!err) {
          // All files in the `images` directory have been deleted.
          res.json(removeName);
        }
      }
    );
    // res.json(removeName)
    console.log(`${removeName} images deleted`);
  };
  
//   module.exports = {
//     upload,
//     getListFiles,
//     download,
//     remove,
//     removeall
//   };