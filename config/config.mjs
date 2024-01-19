import dotenv from  'dotenv'
dotenv.config()
export default {
    'PORT' : process.env.PORT,
    'DATABASE_URI': process.env.DATABASE_URI,
    'JWT_SECRET': process.env.JWT_SECRET,
    'JWT_EXPIRY': process.env.JWT_EXPIRY,
    'SECRET' : process.env.SECRET,
    'NODE_ENV': process.env.NODE_ENV,
    'DB_PORT': process.env.DB_PORT,
    'DB_HOST': process.env.DB_HOST,
    'DB_USER': process.env.DB_USER,
    'DB_PASSWORD': process.env.DB_PASSWORD,
    'DB_NAME': process.env.DB_NAME,
    'DB_DIALECT': process.env.DB_DIALECT,
    'API_ENDPOINT' : process.env.API_ENDPOINT,
    'LOCAL_ENV' : process.env.LOCAL_ENV,
}