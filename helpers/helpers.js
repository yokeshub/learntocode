const util = require("util");
const { format } = require("util");
const gc = require("../storage/googlecloud.config");
const bucket = gc.bucket("yokesh-portfolio.appspot.com"); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
const request = require("request");

const config = {
  action: "read",
  expires: new Date("26 Sep 2021 06:05 PM"),
  accessibleAt: new Date(),
};

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    async function MakeImagePubilc() {
      try {
        await bucket.file(originalname).makePublic();
        console.log(`${originalname} made public successfully`);
        return;
      } catch (err) {
        console.log(err);
        console.log(
          `Uploaded the file successfully: ${originalname}, but public access is denied!`
        );
      }
    }
    //   async function MakeImagePrivate(){
    //     await bucket.file(originalname).getSignedUrl(config, function(err, url) {
    //         if (err) {
    //           console.error(err);
    //           return;
    //         }
    //         // The file will be available to read from this URL from 03-13-2025 to 03-17-2025.
    //         request(url, function(err, resp) {
    //           if(resp.statusCode = 200)
    //           {
    //               console.log(url)
    //           }

    //         });
    //       });
    //   }

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        // await MakeImagePrivate();
        await MakeImagePubilc();
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
module.exports = uploadImage;
