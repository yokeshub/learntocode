const { processFileMiddleware  }=require('../middlewares/multer.upload')
module.exports = app => {
    const blog = require("../controllers/blog.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/createBlog",processFileMiddleware, blog.create);
  
    // Retrieve all blog
    router.get("/", blog.findAll);
  
    // Retrieve all published blog
    router.get("/published", blog.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", blog.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", blog.updateBlog);
  
    // Delete a Tutorial with id
    router.delete("/:id", blog.delete);
  
    // Create a new Tutorial
    router.delete("/", blog.deleteAll);
  
    app.use('/api/blog', router);
  };