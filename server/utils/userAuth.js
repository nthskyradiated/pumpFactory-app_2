import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { GraphQLError } from 'graphql';

dotenv.config()

const AuthError = new GraphQLError ('User is not authenticated', {
            
  extensions: {
    code: 'UNAUTHENTICATED',
    http: { status: 401 },

  },
})

const getUser = async (token) => {
  try {
    if (token) {
      const authToken = token.split(" ")[1]
      const payload = jwt.verify(authToken, process.env.JWT_SECRET);
      return payload
    }
    return null
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    return null;
  }
};

const createAccessToken = async (user) => 
   {return jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expiration time
    })
  };
const createRefreshToken = async (user) => 
   {return jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH, {
        expiresIn: '7d' // Token expiration time
    })
  };

  const authenticateAdmin = async ({ req }) => {
    const token = req.headers.authorization || '';
    
    try {
      if (token) {
        const authToken = token.split(" ")[1];
        const payload = jwt.verify(authToken, process.env.JWT_SECRET);
  
        if (payload && payload.isAdmin) {
          return payload;
        }
      }
      throw AuthError;
    } catch (error) {
      console.error('Error verifying JWT:', error.message);
      throw AuthError;
    }
  };
  const authenticateUser = async ({ req }) => {
    const token = req.headers.authorization || '';
    
    try {
      if (token) {
        const authToken = token.split(" ")[1];
        const payload = jwt.verify(authToken, process.env.JWT_SECRET);
  
        if (payload) {
          return payload;
        }
      }
      throw AuthError;
    } catch (error) {
      console.error('Error verifying JWT:', error.message);
      throw AuthError;
    }
  };

export { getUser, createAccessToken, createRefreshToken, authenticateAdmin, authenticateUser};