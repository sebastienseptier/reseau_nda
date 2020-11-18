module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define("tag", {
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      }
    });
  
    return Tag;
  };