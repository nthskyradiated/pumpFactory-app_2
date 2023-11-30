import express from "express";
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4'
import dotenv from "dotenv";
import connectDB from './config/db.js'
import {typeDefs, resolvers} from "./schema/schema.js";
import ansi from '../node_modules/ansi-colors-es6/index.js'
import morgan from "morgan";
import helmet from "helmet";
import vhost from "vhost";
// import { expressjwt } from "express-jwt";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config()

const port = process.env.PORT || 5000
const subdomain = process.env.SUBDOMAIN || 'api'
const domain = process.env.DOMAIN || 'localhost'
connectDB()

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    path: 'api.localhost/graphql',
    status400ForVariableCoercionErrors: true,
    credentials: 'include'
});

await server.start();  
app.use(cookieParser())
app.use(morgan('common'));
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your SvelteKit app's domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json())


    app.use(vhost(`${subdomain}.${domain}`, expressMiddleware(server, {
      context: async ({ req, res }) => {return {req, res}}}))
    //     const token = req.headers.authorization || '';

        // Verify the token and get user information
    //     const user = await getUser(token);

    //     if (!user || !user.isAdmin) {
    //       throw new GraphQLError ('User is not authenticated', {

    //         extensions: {
    //           code: 'UNAUTHENTICATED',
    //           http: { status: 401 },
    
    //         },
    //     })}

    //     return { user, token, res };
    //   },
    
    // }))

)

// const authMiddleware = expressjwt({
//     secret: process.env.JWT_SECRET, // Replace with your secret key

//     algorithms: ['HS256'], // Use HS256 or the appropriate algorithm for your setup
//   });
//   // Use the authentication middleware for protected routes
//   app.use(authMiddleware);
  

app.listen(port, () => console.log(ansi.green.bold.underline(`server running on port ${port}`)));