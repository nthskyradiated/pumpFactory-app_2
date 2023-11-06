import Client from '../models/clientModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Attendance from '../models/attendanceModel.js'
import { findExistingClient, validateAge, calculateExpirationDate, updateMembershipStatus } from '../utils/clientUtils.js';
import { GraphQLScalarType, Kind } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";

dotenv.config()

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


export const typeDefs = `#graphql

    scalar Date

    type Attendance {
        id: ID!
        clientId: ID!
        productId: ID!
        checkIn: Date!
    }

    type Product {
        id: ID!
        name: String!
        description: String!
        price: Int!
        # type: String!
        # validity: String!
        # expiresAt: Date!
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
        attendance: [Attendance]
    }

    type User {
        id: ID!
        name: String!
        email: String!
        username: String!
        password: String!
        isAdmin: Boolean!
    }

    input AddProductInput {
        name: String!
        description: String!
        price: Int!
    }

    input UpdateProductInput {
        id: ID!
        name: String
        description: String
        price: Int
    }

    input AddClientInput {
        name: String!
        email: String!
        phone: String!
        birthdate: String!
        waiver: Boolean!
    }
    input UpdateClientInput {
        name: String
        email: String
        phone: String
        birthdate: String
        waiver: Boolean
    }

    input AddUserInput {
        name: String!
        email: String!
        username: String!
        password: String!
        isAdmin: Boolean!
    }
    input UpdateUserInput {
        name: String
        email: String
        username: String
        password: String
        isAdmin: Boolean
    }

    type Query {
        products: [Product]
        clients: [Client]
        users: [User]
        attendance(ID: ID!) : [Attendance]
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
        
        addAttendance(clientId: ID!, productId: ID!): Attendance

        deleteAttendance(id: ID!): Attendance
        
        addClient(input: AddClientInput! productId: ID): Client

        updateClient(id: ID! input: UpdateClientInput! productId: ID): Client
        
        deleteClient(id: ID!): Client

        addProduct(input: AddProductInput!): Product
        
        updateProduct(input: UpdateProductInput!): Product
        
        deleteProduct(id: ID!): Product

        registerUser(input: AddUserInput!): User
        
        updateUser(id: ID! input: UpdateUserInput): User

        deleteUser(id: ID!): User

        loginUser(username: String!, password: String!): AuthPayload


    }

`
export const resolvers = {
    Date: DateType,
    Query: {
        products: async () => Product.find(),
        clients: async () => Client.find(),
        users: async () => User.find(),

        product: async (parent, {ID}) => {return await Product.findById(ID)},
        client: async (parent, {ID}) => {return await Client.findById(ID)},
        user: async (parent, {ID}) => {return await User.findById(ID)},
        attendance: async (parent, {ID}) => {return await Attendance.findById(ID)},

    },

    Client: {
    product: async (parent) => await Product.findById(parent.productId),
    attendance: async (parent) => {
        const clientAttendance = await Attendance.find({ clientId: parent.id });
    
        // You may need to populate clientId and productId for each Attendance
        // object if they're not automatically populated by Mongoose
        const populatedClientAttendance = clientAttendance.map((attendance) => {
            return {
                ...attendance.toObject(), // Convert to plain object
                clientId: parent.id,     // Populate clientId
            };
        });
    
        return populatedClientAttendance;
    }
    
    },

    Attendance: {
        clientId: async (parent) => await parent.clientId,
        productId: async (parent) => await parent.productId
    },

    Mutation: {
    addAttendance: async (parent, args) => {
        const { clientId, productId } = args;

    // Find the client and product
    const client = await Client.findById(clientId);
    const product = await Product.findById(productId);

    if (!client || !product) {
        throw new Error('Client or product not found');
    }

    if (!client.productId) {
        throw new Error('Client does not have a product');
    }

    // Check if the client's membership status is 'active'
    if (client.membershipStatus !== 'active') {
        throw new Error('Client membership status is not active');
    }

    if (client.productId.toString() !== productId) {
        throw new Error('Invalid productId for the client');
    }
    // // Calculate the expiration date for the product based on its validity
    // const expirationDate = calculateExpirationDate(product.validity);
    // updateMembershipStatus(client, product, expirationDate)


    // Create a new attendance record
    const attendance = new Attendance({
        clientId,
        checkIn: new Date(),
        productId,
    });

    // Save the attendance record
    await attendance.save();
client.attendance.push(attendance._id);

        // Save the client to update the attendance array
        await client.save();
    // Update the client's membership status based on attendance and expiration date
    // updateMembershipStatus(client, product, expirationDate);

    return attendance;

    },

    deleteAttendance: async (parent, { id }) => {
        // Find the attendance record by its ID
        const attendance = await Attendance.findById(id);
    
        if (!attendance) {
          throw new Error('Attendance record not found');
        }
    
        // Remove the attendance record's ID from the client's attendance array
        const client = await Client.findById(attendance.clientId);
        if (client) {
          client.attendance = client.attendance.filter(a => a.toString() !== id);
          await client.save();
        }
    
        // Delete the attendance record
        await Attendance.findByIdAndDelete(id);
    
        return attendance;
      },

        addClient: async (parent, {input}, args) => {
        const existingClient = await findExistingClient(input.name, input.email, input.phone);
        if (existingClient) {
        throw new Error('Client with the same name, email, or phone already exists.');
        }
      const age = validateAge(input.birthdate);
      const membershipStatus = args.productId ? 'active' : 'inactive';

      const client = new Client({
        name: input.name,
        email: input.email,
        phone: input.phone,
        birthdate: input.birthdate,
        age,
        membershipStatus,
        waiver: input.waiver,
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
            try {
                const { id, input, productId } = args;
                
                // Check for duplicates based on name, email, and phone
                if (input.name || input.email || input.phone) {
                  const existingClient = await findExistingClient(input.name, input.email, input.phone);
                  if (existingClient) {
                    throw new Error('Client with the same name, email, or phone already exists.');
                  }
                }
                
                // Fetch the existing client to get its current age and productId
                const existingClient = await Client.findById(id);
                
                if (!existingClient) {
                  throw new Error('Client not found');
                }
                
                // Calculate the age based on the provided birthdate or use the existing age
                const age = input.birthdate ? validateAge(input.birthdate) : existingClient.age;
                
                // Determine the membership status based on the productId or use the existing status
                let membershipStatus = 'inactive';
                
                if (productId) {
                  // If productId is provided, the client should have 'active' membership status
                  membershipStatus = 'active';
                }
                
                // Create an updateFields object to specify the fields to update. Use the existing values if new values are not provided.
                const updateFields = {
                  name: input.name || existingClient.name,
                  email: input.email || existingClient.email,
                  phone: input.phone || existingClient.phone,
                  birthdate: input.birthdate || existingClient.birthdate,
                  age,
                  membershipStatus,
                  waiver: input.waiver !== undefined ? input.waiver : existingClient.waiver,
                  productId: productId || null, // To remove the product, set it to null
                };
                
                // Update and return the updated client
                const updatedClient = await Client.findByIdAndUpdate(id, updateFields, { new: true });
                
                return updatedClient;
              } catch (error) {
                throw new Error(error.message);
              }
        },

        deleteClient: async (parent, args) => {
            const client = await Client.findById(args.id);
        
            if (!client) {
                throw new Error('Client not found');
            }
        
            // Delete all attendance entries associated with the client
            await Attendance.deleteMany({ clientId: args.id });
        
            // Delete the client
            return Client.findByIdAndDelete(args.id)

        },

        addProduct: async (parent, {input})=>{
        const product = new Product ({
            name: input.name,
            description: input.description,
            price: input.price
            })
            return product.save()
            },

        updateProduct: async (parent, {input}) => {
            const { id, name, description, price } = input;
            const product = await Product.findById(id)
            if (!product) {
                throw new Error('Product not found');
              }

        return Product.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    description,
                    price
                }
            }
            ,{new: true}
            )
        },
        deleteProduct: async(parent, {args}) => {
        return Product.findByIdAndDelete(args.id)
        },

        registerUser: async (parent, {input}) => {
        // Check if the username or email is already in use
        const existingUser = await User.findOne({
            $or: [{ username: input.username }, { email: input.email }]
        });

        if (existingUser) {
            throw new Error('User with the same username or email already exists.');
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create a new user
        const user = new User({
            name: input.name,
            username: input.username,
            email: input.email,
            password: hashedPassword,
            isAdmin: input.isAdmin || false
        });

        return user.save();
        },

        updateUser: async (parent, { id, input }) => {
            // Find the user by ID
            const user = await User.findById(id);
      
            if (!user) {
              throw new Error('User not found');
            }
      
            // Update the user fields based on the input
            if (input.name) {
              user.name = input.name;
            }
      
            if (input.username) {
              user.username = input.username;
            }
      
            if (input.email) {
              user.email = input.email;
            }
      
            if (input.password) {
              // Hash the new password before storing it
              const hashedPassword = await bcrypt.hash(input.password, 12);
              user.password = hashedPassword;
            }
      
            if (input.isAdmin !== undefined) {
              user.isAdmin = input.isAdmin;
            }
      
            // Save the updated user
            const updatedUser = await user.save();
      
            return updatedUser;
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

        return {token, user};
        },
        deleteUser: async(parent, args) => {
        return User.findByIdAndDelete(args.id)
        },

    }
};
