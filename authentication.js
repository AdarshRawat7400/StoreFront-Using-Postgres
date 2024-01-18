import db from "./db.js";
import jwt from 'jsonwebtoken';
import config  from "./config.js";
// authMiddleware.js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET, // Change this to a strong and secure secret
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await db.users.findByPk(jwtPayload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false, { message: 'User not found' });
        } catch (error) {
            return done(error, false);
        }
    })
);

const isAuthenticated = (request, response, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return response.status(500).json({ error: 'Internal Server Error' });
      }
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      request.user = user;
      return next();
    })(request, response, next);
  };

  const generateToken = (userId) => {
    // Payload: information you want to include in the token
    const payload = {
      id: userId,
      // Add any other claims you want to include
    };
  
    // Secret key: used to sign the token
    const secretKey = config.JWT_SECRET
  
    // Options: additional options for the token (e.g., expiration time)
    const options = {
      expiresIn: config.JWT_EXPIRY
    };
  
    // Generate the token
    const token = jwt.sign(payload, secretKey, options);
  
    return token;
  };
export { isAuthenticated, generateToken };