'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.match)
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'name must be 2-25 characters long.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 99],
          msg: 'password must be between 8 and 99 characters.'
        }
      }
    },
    switchCode: {
      type: DataTypes.STRING,
      isNumeric: true,
      max: 12
    },
    about: {
      type: DataTypes.TEXT
    }
    // top1char: {
    //   type: DataTypes.INTEGER
    // },
    // top2char: {
    //   type: DataTypes.INTEGER 
    // },
    // top3char: {
    //   type: DataTypes.INTEGER 
    // },
    // top1winrate: {
    //   type: DataTypes.INTEGER 
    // },
    // top1loserate: {
    //   type: DataTypes.INTEGER 
    // },
    // top2winrate: {
    //   type: DataTypes.INTEGER 
    // },
    // top2loserate: {
    //   type: DataTypes.INTEGER 
    // },
    // top3winrate: {
    //   type: DataTypes.INTEGER 
    // },
    // top3loserate: {
    //   type: DataTypes.INTEGER 
    // },
    // totalW: {
    //   type: DataTypes.INTEGER 
    // },
    // totalL: {
    //   type: DataTypes.INTEGER
    // }
  },
   {
    sequelize,
    modelName: 'user',
  });
  
  // async -- with hash function
  // user.addHook('beforeCreate', async (pendingUser, options)=>{
  //   await bcrypt.hash(pendingUser.password, 10)
  //   .then(hashedPassword=>{
  //     console.log(`${pendingUser.password} became ---> ${hashedPassword}`)
  //     // replace the original password with the hash 
  //     pendingUser.password = hashedPassword
  //   })
  // })

  // sync --
  user.addHook('beforeCreate', (pendingUser, options)=>{
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    console.log(`${pendingUser.password} became ---> ${hashedPassword}`)
    pendingUser.password = hashedPassword
  })

  user.prototype.validPassword = async function(passwordInput){
    let match = await bcrypt.compare(passwordInput, this.password)
    return match
  }
  
  return user;
};