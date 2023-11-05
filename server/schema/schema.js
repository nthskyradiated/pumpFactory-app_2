import Client from '../models/clientModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import { findExistingClient, validateAge } from '../utils/clientUtils.js';
import { GraphQLScalarType, Kind } from 'graphql';
import jwt from 'jsonwebtoken';
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
        product: Product
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

        product(ID: ID!) : Product
        client(ID: ID!) : Client
        user(ID: ID!) : User

        
    }

    enum MembershipStatus {
    active
    inactive
  }

  type AuthPayload {
    token: String
    user: User
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

        loginUser(username: String! password: String!): AuthPayload


    }

`
export const resolvers = {
    Query: {
        products: async () => Product.find(),
        clients: async () => Client.find(),
        users: async () => User.find(),

        product: async (parent, {ID}) => {return await Product.findById(ID)},
        client: async (parent, {ID}) => {return await Client.findById(ID)},
        user: async (parent, {ID}) => {return await User.findById(ID)},
    },
    Client: {
    product: async (parent) => await Product.findById(parent.productId),
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
       // Save the client first to get its ID
        const savedClient = await client.save();
        if (args.productId) {
            const product = await Product.findById(args.productId);
            if (product) {
              // Update the client with the associated product
              savedClient.product = product;
                savedClient.save();
            }
          }
      
          return savedClient;
        },

    updateClient: async (parent, args) => {
        // Check for duplicates based on name, email, and phone
        if (args.name || args.email || args.phone) {
            const existingClient = await findExistingClient(args.name, args.email, args.phone);
            if (existingClient) {
                throw new Error('Client with the same name, email, or phone already exists.');
            }
        }

        // Fetch the existing client to get its current age and productId
        const existingClient = await Client.findById(args.id);

        if (!existingClient) {
            throw new Error('Client not found');
        }

        // Calculate the age based on the provided birthdate or use the existing age
        const age = args.birthdate ? validateAge(args.birthdate) : existingClient.age;

        // Determine the membership status based on the productId or use the existing status
        let membershipStatus = 'inactive';

        if (args.productId) {
            // If productId is provided, the client should have 'active' membership status
            membershipStatus = 'active';
        }

        // Create an updateFields object to specify the fields to update. We use the existing values if new values are not provided.
        const updateFields = {
            name: args.name || existingClient.name,
            email: args.email || existingClient.email,
            phone: args.phone || existingClient.phone,
            birthdate: args.birthdate || existingClient.birthdate,
            age,
            membershipStatus,
            waiver: args.waiver !== undefined ? args.waiver : existingClient.waiver,
            productId: args.productId, // To remove the product, set it to null or undefined
        };

        return Client.findByIdAndUpdate(args.id, { $set: updateFields }, { new: true });
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
        return Product.findByIdAndDelete(args.id)
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
        const hashedPassword = await bcrypt.hash(args.password, 12);

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

        return {token};
    },
    deleteUser: async(parent, args) => {
        return User.findByIdAndDelete(args.id)
    },

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
          const year = value.getUTCFullYear(); // Use UTC date methods to handle time zone
          const month = String(value.getUTCMonth() + 1).padStart(2, '0');
          const day = String(value.getUTCDate()).padStart(2, '0');
          return `${month}-${day}-${year}`;
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
                return `${month}-${day}-${year}`;
            }
        }
        throw new Error('Invalid Date literal');
    },
});
