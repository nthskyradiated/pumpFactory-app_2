import Client from '../models/clientModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { findExistingClient, validateAge } from '../utils/clientUtils.js';
import { GraphQLScalarType, Kind } from 'graphql';
import  jwt from 'express-jwt';
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";

dotenv.config()

export const typeDefs = `#graphql

    scalar Date

    type Product {
        id: ID!
        name: String!
        description: String!
        price: Int!
    }

    type Client {
        id: ID!
        name: String!
        email: String!
        phone: String!
        birthdate: Date!
        age: Int!
        waiver: Boolean!
        membershipStatus: MembershipStatus!
        product: [Product]
        productId: ID
    }

    type User {
        id: ID!
        name: String!
        email: String!
        username: String!
        password: String!
        isAdmin: Boolean!
    }

    type Query {
        products: [Product]
        clients: [Client]
        users: [User]
    }

    enum MembershipStatus {
    active
    inactive
  }

    type Mutation { 
        
        addClient(name: String! email: String! phone: String! birthdate: String! waiver: Boolean! productId: ID): Client

        updateClient(id: ID! name: String email: String phone: String birthdate: String waiver: Boolean productId: ID): Client
        
        deleteClient(id: ID!): Client

        addProduct(name: String!, description: String!, price: Int!): Product
        
        updateProduct(id: ID!, name: String, description: String, price: Int): Product
        
        deleteProduct(id: ID!): Product

        registerUser(name: String! username: String! email: String! password: String! isAdmin: Boolean): User
        
        updateUser(id: ID! name: String username: String email: String password: String isAdmin: Boolean): User

        deleteUser(id: ID!): User

        loginUser(username: String! password: String!): User


    }

`
export const resolvers = {
    Query: {
        products: async () => Product.find(),
        clients: async () => Client.find(),
        users: async () => User.find(),
    },
    Client: {
    product: (parent) => Product.findById(parent.productId),
    },
    Mutation: {
        addClient: async (parent, args) => {
        const existingClient = await findExistingClient(args.name, args.email, args.phone);
        if (existingClient) {
        throw new Error('Client with the same name, email, or phone already exists.');
        }
      const age = validateAge(args.birthdate);
      const membershipStatus = args.productId ? 'active' : 'inactive';

      const client = new Client({
        name: args.name,
        email: args.email,
        phone: args.phone,
        birthdate: args.birthdate,
        age,
        membershipStatus,
        waiver: args.waiver,
        productId: args.productId,
      });
      return client.save();
    },

    updateClient: async (parent, args) => {
                
        const existingClient = await findExistingClient(args.name, args.email, args.phone);

        if (existingClient) {
            throw new Error('Client with the same name, email, or phone already exists.');
        }

        const age = validateAge(args.birthdate);

        const membershipStatus = args.productId ? 'active' : 'inactive';

        const client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
            birthdate: args.birthdate,
            age,
            membershipStatus,
            waiver: args.waiver,
            productId: args.productId,

        })

        return client.save()
    },
    deleteClient: async (parent, args) => {
        return Client.findByIdAndDelete(args.id)
    },
    addProduct: async (parent, args)=>{
        const product = new Product ({
            name: args.name,
            description: args.description,
            price: args.price
    })
    return product.save()
    },
    updateProduct: async (parent, args) => {
        return Product.findByIdAndUpdate(args.id,
            {
                $set: {
                    name: args.name,
                    description: args.description,
                    price: args.price
                }
            }
            ,{new: true}
            )
    },
    deleteProduct: async(parent, args) => {
        return Product.findByIdAndRemove(args.id)
    },

    registerUser: async (parent, args) => {
        // Check if the username or email is already in use
        const existingUser = await User.findOne({
            $or: [{ username: args.username }, { email: args.email }]
        });

        if (existingUser) {
            throw new Error('User with the same username or email already exists.');
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(args.password, 10);

        // Create a new user
        const user = new User({
            name: args.name,
            username: args.username,
            email: args.email,
            password: hashedPassword,
            isAdmin: args.isAdmin || false
        });

        return user.save();
    },
    loginUser: async (parent, args) => {
        const user = await User.findOne({ username: args.username });

        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(args.password, user.password);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expiration time
        });

        return token;
    }
}};


const DateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom date scalar type',
    parseValue(value) {
        if (typeof value === 'number') {
            return new Date(value);
        }
        throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    serialize(value) {
        if (value instanceof Date) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and pad with leading zero
            const day = String(value.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        throw new Error('Invalid Date value');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const dateParts = ast.value.split('-');
            if (dateParts.length === 3) {
                const year = dateParts[2];
                const month = dateParts[0];
                const day = dateParts[1];
                return `${year}-${month}-${day}`;
            }
        }
        throw new Error('Invalid Date literal');
    },
});
