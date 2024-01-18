import dotenv from  'dotenv'
dotenv.config()
export default {
    'PORT' : process.env.PORT,
    'DATABASE_URI': process.env.DATABASE_URI,
    'JWT_SECRET': process.env.JWT_SECRET,
    'JWT_EXPIRY': process.env.JWT_EXPIRY,
    'SECRET' : process.env.SECRET,
}