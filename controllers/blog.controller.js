const db = require("../models");
const { dataUri } = require("../middlewares/multer.upload");
const multer = require("multer");
// Create multer object
const { uploader } = require("../storage/cloudinary.config");
const uploadImage = require("../helpers/helpers");
const Blog = db.blogs;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  console.log("creating..", req.body);
  for (const [key, value] of Object.entries(req.body)) {
    if (!value) {
      res.status(400).send({
        message: `${key} Content can not be empty!`,
      });
      return;
    }
  }
  async function Uploaded() {
    try {
      const myFile = req.file;
      const imageUrl = await uploadImage(myFile);
      return imageUrl;
    } catch (error) {
      console.log("uploadinng error", error);
    }
  }
  const blog = {};
  for (const [key, value] of Object.entries(req.body)) {
    blog[key] = value;
  }
  // Save Tutorial in the database
  Blog.create(blog)
    .then((data) => {
      res.status(200).send("Blog created sucessfully");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Blog.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving blogs.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Blog.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Blog with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.updateBlog = async (req, res) => {
  const id = req.params.id;
  console.log("updating..",req.body);
  if(Object.keys(req.body).length>0){
  for (const [key, value] of Object.entries(req.body)) {
    if (!value) {
      res.status(400).send({
        message: `${key} Content can not be empty!`,
      });
    return;
    
    }
  }}
  else {
    res.status(400).send({
      message: `req body empty`,
    });
    return;

  }
  const blog = {};
  for (const [key, value] of Object.entries(req.body)) {
    if(!(key==='id')){
    blog[key] = value;
    }
  }
  console.log("updating..", blog);

  Blog.update(blog, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Blog was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Blog with id=${id}. Maybe Blog was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Blog was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Blog with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Blog with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Blog.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Blog were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Blogs."
      });
    });
};


// Find all published Tutorials
exports.findAllPublished = (req, res) => {};
