const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files/:folderName", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.delete("/files/remove", controller.remove);
  router.get("/files/removeall", controller.removeall);

  app.use('/api/image',router);
};

module.exports = routes;