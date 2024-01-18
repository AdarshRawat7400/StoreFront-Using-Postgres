import { Sequelize,DataTypes } from "sequelize";
import config from  './config.js'

const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: 'postgres',
  define: {
    freezeTableName: true
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Disable SSL verification (not recommended for production)
    }
  }
});


try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
// Access the 'devices' collection (it will be created if it doesn't exist)
// const users = database.collection('users');
// const products = database.collection('products');
// const cart = database.collection('cart');

const User = sequelize.define('user', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  role : {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user"
  },
}, {
  // Other model options go here
});


const Product = sequelize.define('product', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
    //, allowNull defaults to true
  },
  price :{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  // Other model options go here
});


const Cart = sequelize.define('cart', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'id',
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      // This is a reference to another model
      model: Product,
      // This is the column name of the referenced model
      key: 'id',
    }
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  price :{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});


await sequelize.sync({alter:true});
// await User.drop();
// await Products.drop();
// await Cart.drop();

export default {
    "users" : User,
    "products" : Product,
    "cart" : Cart
};
