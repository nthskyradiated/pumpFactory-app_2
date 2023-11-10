import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()

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
        expiresIn: '15m' // Token expiration time
    })
  };
const createRefreshToken = async (user) => 
   {return jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH, {
        expiresIn: '7d' // Token expiration time
    })
  };

const userVerification = async (context) => {
  const token = context.req.headers.authorization || '';
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
}

export { getUser, createAccessToken, createRefreshToken, userVerification };