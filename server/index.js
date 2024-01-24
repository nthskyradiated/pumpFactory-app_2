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
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config()

const port = process.env.PORT || 5555
const subdomain = process.env.SUBDOMAIN || 'api'
const domain = process.env.DOMAIN || 'localhost'
connectDB()

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    path: 'localhost:5555',
    status400ForVariableCoercionErrors: true,
    credentials: 'include'
});

await server.start();  
app.use(morgan('common'));
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your SvelteKit app's domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Token', 'Content-Type', 'refreshtoken', 'authorization'],
  credentials: true,
}));
app.use(express.json())


    // app.use(vhost(`${subdomain}.${domain}`, expressMiddleware(server, {
    app.use(cookieParser(), expressMiddleware(server, {
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

// )
  
app.listen(port, () => console.log(ansi.green.bold.underline(`server running on port ${port}`)));