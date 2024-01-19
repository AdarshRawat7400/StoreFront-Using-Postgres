
export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
    // Useful params :
    // Use a different storage type. Default: sequelize (Options are sequelize,json,None)
    // "migrationStorage": "json",

    // Use a different file name. Default: sequelize-meta.json
    // "migrationStoragePath": "sequelizeMeta.json",

    // Use a different table name. Default: SequelizeMeta
    // "migrationStorageTableName": "sequelize_meta",

    // Use a different schema for the SequelizeMeta table
    // "migrationStorageTableSchema": "custom_schema"

     // Use a different storage. Default: none (Options are sequelize,json,None)

    //  "seederStorage": "json",
    // Use a different file name. Default: sequelize-data.json

    //  "seederStoragePath": "sequelizeData.json",
    // Use a different table name. Default: SequelizeData
    
    //  "seederStorageTableName": "sequelize_data"
};