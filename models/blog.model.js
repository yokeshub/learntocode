module.exports = (sequelize, Sequelize) => {
    const Blog = sequelize.define("myblog", {
      title: {
        type: Sequelize.STRING
      },
      short_description:{
        type: Sequelize.TEXT
      },
      description:{
        type: Sequelize.TEXT
      },
      Createdby:{
        type: Sequelize.STRING
      },
    });
  
    return Blog;
  };