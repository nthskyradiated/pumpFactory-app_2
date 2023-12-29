import Client from '../models/clientModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Attendance from '../models/attendanceModel.js'
import ClientDocument from '../models/clientDocumentModel.js'
import {authenticateUser, createAccessToken, createRefreshToken, authenticateAdmin} from '../utils/userAuth.js'
import { findExistingClient, validateAge, calculateExpirationDate, updateMembershipStatus } from '../utils/clientUtils.js';
import { isValidFileExtension, isValidURL} from '../utils/clientDocumentUtils.js';
import { GraphQLScalarType, Kind } from 'graphql';
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
        product: Product
        client: Client
    }

    type Product {
        id: ID!
        name: String!
        description: String!
        price: Int!
        productType: ProductType!
        sessionCounter: Int
        expiresIn: Int
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
        clientSessionCounter: Int
        clientExpiresIn: Date
        attendance: [Attendance]
        documents: [ClientDocument]
    }

    type ClientDocument {
        id: ID!
        clientId: ID!
        documentName: String!
        documentType: DocumentType!
        documentURL: String!
        client: Client
    }

    type User {
        id: ID!
        name: String!
        email: String!
        username: String!
        password: String!
        isAdmin: Boolean!
    }

    input AddAttendanceInput {
        clientId: ID!
        productId: ID!
    }

    input AddProductInput {
        name: String!
        description: String!
        price: Int!
        productType: ProductType!
        sessionCounter: Int
        expiresIn: Int
    }

    input UpdateProductInput {
        id: ID!
        name: String
        description: String
        price: Int
        productType: ProductType
        sessionCounter: Int
        expiresIn: Int
    }

    input AddClientInput {
        name: String!
        email: String!
        phone: String!
        birthdate: String!
        waiver: Boolean!
    }
    input UpdateClientInput {
        id: ID!
        name: String
        email: String
        phone: String
        birthdate: String
        waiver: Boolean
    }

    input AddClientDocumentInput {
        clientId: ID!
        documentName: String!
        documentType: String!
        documentURL: String!
    }
    input UpdateClientDocumentInput {
        id: ID!
        clientId: ID!
        documentName: String
        documentType: String
        documentURL: String
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
        documents: [ClientDocument]
        users: [User]
        attendances: [Attendance]
        attendance(ID: ID!) : Attendance
        product(ID: ID!) : Product
        client(ID: ID!) : Client
        document(ID: ID!) : ClientDocument
        user(ID: ID!) : User
    }

    enum MembershipStatus {
        active
        inactive
    }
    enum ProductType {
        EVENT
        SESSION_BASED
        TIME_BASED
    }
    enum DocumentType {
        WAIVER
        IDENTIFICATION
        PHOTO
    }

    type AuthPayload {
        token: String
        user: User
        refreshToken: String
    }


    type Mutation { 
        
        addAttendance(input: AddAttendanceInput!): Attendance

        deleteAttendance(id: ID!): Attendance
        
        addClient(input: AddClientInput! productId: ID): Client

        updateClient(input: UpdateClientInput! productId: ID): Client
        
        deleteClient(id: ID!): Client

        addClientDocument(input: AddClientDocumentInput!): ClientDocument

        updateClientDocument(input: UpdateClientDocumentInput!): ClientDocument

        deleteClientDocument(id: ID!): ClientDocument

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
        products: async (parent, args, context) => {
            await authenticateUser(context)
            return Product.find()
        },
        clients: async (parent, args, context) => {
            await authenticateUser(context)
            return Client.find()
        },
        documents: async (parent, args, context) => {
            await authenticateUser(context)
            return ClientDocument.find()
        },
        attendances: async (parent, args, context) => {
            await authenticateUser(context);
            return Attendance.find();
          },
        users: async (parent, args, context) => {
            await authenticateAdmin(context)
            return User.find()
        },

        product: async (parent, {ID}, context) => {
            await authenticateUser(context)
            return await Product.findById(ID)
        },
        client: async (parent, {ID}, context) => {
            await authenticateUser(context)
            return await Client.findById(ID)
        },
        document: async (parent, {ID}, context) => {
            await authenticateUser(context)
            return await ClientDocument.findById(ID)
        },
        user: async (parent, {ID}, context) => {
            await authenticateAdmin(context)
            return await User.findById(ID)
        },
        attendance: async (parent, {ID}, context) => {
            await authenticateUser(context)
            return await Attendance.findById(ID)
        },

    },

    Client: {
        product: async (parent) => await Product.findById(parent.productId),
        attendance: async (parent) => {
            console.log(parent.attendance);
            const clientAttendance = await Attendance.find({ clientId: parent.id });
        
            const populatedClientAttendance = clientAttendance.map((attendance) => {
                return {
                    ...attendance.toObject(), // Convert to plain object
                    clientId: parent.id,     // Populate clientId
                };
            });
        
            return populatedClientAttendance;
        },
        documents: async (parent) => {
            console.log(parent.documents);
            const clientDocuments = await ClientDocument.find({ clientId: parent.id });
        
            const populatedClientDocuments = clientDocuments.map((document) => {
                return {
                    ...document.toObject(), // Convert to plain object
                    clientId: parent.id,     // Populate clientId
                };
            });
        
            return populatedClientDocuments;
        }
    
    },

    ClientDocument: {
        clientId: async (parent) => await parent.clientId,
        client: async (parent) => await Client.findById(parent.clientId)
    },

    Attendance: {
        clientId: async (parent) => await parent.clientId,
        productId: async (parent) => await parent.productId,
        product: async (parent) => await Product.findById(parent.productId),
        client: async (parent) => await Client.findById(parent.clientId)
    },

    Mutation: {
        addAttendance: async (parent, {input}, context) => {
        await authenticateUser(context)

                    const { clientId, productId } = input;

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
                    // Update client session and check expiration
                    if (product.productType === 'SESSION_BASED') {
                      if (client.clientSessionCounter >= 0 && client.clientExpiresIn > new Date()) {
                        client.clientSessionCounter -= 1;
                        if (client.clientSessionCounter === 0){
                          client.membershipStatus = 'inactive'
                          client.productId = null;
                          client.clientSessionCounter = 0;
                          client.clientExpiresIn = null;
                        }
                      } else {
                        await client.save();
                        throw new Error('Invalid client session or expiration date');
                      }
                    } else if (product.productType === 'TIME_BASED' && client.clientExpiresIn <= new Date()) {
                      client.membershipStatus = 'inactive';
                      client.productId = null;
                      client.clientSessionCounter = 0;
                      client.clientExpiresIn = null;
                      await client.save();
                      throw new Error('Invalid client expiration date');
                    }

                    // Create a new attendance record
                    const attendance = new Attendance({
                        clientId,
                        checkIn: new Date(),
                        productId,
                    });
            
                    // Save the attendance record
                    await attendance.save();
                        client.sessions.push(attendance.id);
            
                        // Save the client to update the attendance array
                        await client.save();
            
                    return attendance;
        },
        

        deleteAttendance: async (parent, { id }, context) => {
        await authenticateAdmin(context)
        // Find the attendance record by its ID
        const attendance = await Attendance.findOne({id});
    
        if (!attendance) {
          throw new Error('Attendance record not found');
        }
        
    
        // Delete the attendance record
        await attendance.removeSession();
    
        return attendance;
        },

        addClient: async (parent, args, context) => {
        const currUser = await authenticateUser(context)
        const {input} = args;
        const existingClient = await findExistingClient(input.name, input.email, input.phone);
        if (existingClient) {
        throw new Error('Client with the same name, email, or phone already exists.');
        }

        if (args.productId) {
            const product = await Product.findById(args.productId);
            if (!product) {
                throw new Error('Product does not exist');
            }
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
              if (product.productType === 'SESSION_BASED') {
                savedClient.clientSessionCounter = product.sessionCounter;
                savedClient.clientExpiresIn = calculateExpirationDate(product.expiresIn)
            } else if (product.productType === 'TIME_BASED') {
                savedClient.clientSessionCounter = null; // Assuming time-based doesn't have session count
                savedClient.clientExpiresIn = calculateExpirationDate(product.expiresIn);
            }
                savedClient.save();
            }
          }
      
          return savedClient;
        },

        updateClient: async (parent, args, context) => {
            await authenticateUser(context)
            try {
                const { input, productId } = args;

                        // Check if productId is provided and validate if the product exists
        if (productId) {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product does not exist');
            }
        }
                
                // Check for duplicates based on name, email, and phone
                if (input.name || input.email || input.phone) {
                  const existingClient = await findExistingClient(input.name, input.email, input.phone);
                  if (existingClient) {
                    throw new Error('Client with the same name, email, or phone already exists.');
                  }
                }
                
                // Fetch the existing client to get its current age and productId
                const existingClient = await Client.findById(input.id);
                
                if (!existingClient) {
                  throw new Error('Client not found');
                }
                
                // Calculate the age based on the provided birthdate or use the existing age
                const age = input.birthdate ? validateAge(input.birthdate) : existingClient.age;
                
                // Determine the membership status based on the productId or use the existing status
                let membershipStatus = 'inactive';
                let clientSessionCounter = existingClient.clientSessionCounter;
                let clientExpiresIn = existingClient.clientExpiresIn;

                if (productId) {
                  // If productId is provided, the client should have 'active' membership status
                  membershipStatus = 'active';
                  const product = await Product.findById(productId);
                    if (product) {
                      if (product.productType === 'SESSION_BASED') {
                        clientSessionCounter = product.sessionCounter;
                        clientExpiresIn = calculateExpirationDate(product.expiresIn);
                      } else if (product.productType === 'TIME_BASED') {
                        // Assuming time-based doesn't have session count
                        clientSessionCounter = null;
                        clientExpiresIn = calculateExpirationDate(product.expiresIn);
                      }else if (product.productType === 'EVENT') {
                        // Set clientExpiresIn to null for EVENT productType
                        clientExpiresIn = null;
                      }
                    }
                  
                } else {
                  // If productId is null, reset counters to default values
                  clientSessionCounter = 0;
                  clientExpiresIn = null;
                }
                console.log("input", input)
                // Create an updateFields object to specify the fields to update. Use the existing values if new values are not provided.
                const updateFields = {
                  name: input.name || existingClient.name,
                  email: input.email || existingClient.email,
                  phone: input.phone || existingClient.phone,
                  birthdate: input.birthdate || existingClient.birthdate,
                  age,
                  membershipStatus,
                  waiver: input.waiver !==undefined ? input.waiver : existingClient.waiver,
                  productId: productId || null, // To remove the product, set it to null
                  clientSessionCounter,
                  clientExpiresIn,
                };
                
                // Update and return the updated client
                const updatedClient = await Client.findOneAndUpdate({_id: input.id}, updateFields, { new: true });
    

                return updatedClient;
              } catch (error) {
                throw new Error(error.message);
              }
        },

        deleteClient: async (parent, args, context) => {
            await authenticateAdmin(context)
            const client = await Client.findById(args.id);
        
            if (!client) {
                throw new Error('Client not found');
            }
        
            // Delete all attendance entries associated with the client
            await Attendance.deleteMany({ clientId: args.id });
        
            // Delete the client
            return Client.findByIdAndDelete(args.id)

        },

        addProduct: async (parent, { input }, context) => {
            await authenticateAdmin(context)
            const { name, description, price, productType, sessionCounter, expiresIn } = input;
        
            // Check if a product with the same name and description already exists
            const existingProduct = await Product.findOne({ $or: [{ name }, { description }] });
        
            if (existingProduct) {
                throw new Error('A product with the same name or description already exists.');
            }
            if (price === null || price === undefined || price <= 100) {
              throw new Error('Invalid value for price (Price must not fall below 100)');
            }
            if (expiresIn === null && productType !== "EVENT") {
              throw new Error('Invalid value for expiresIn');
            }
          
            if (sessionCounter === null && productType !== "EVENT") {
              throw new Error('Invalid value for sessionCounter');
            }
            // If no existing product found, create and save the new product
              if ( productType !== 'EVENT') {
                if (productType === 'SESSION_BASED' && (sessionCounter === undefined || expiresIn === undefined)) {
                    throw new Error('Counter and expiry is required for SESSION_BASED products');
                } else if (productType === 'SESSION_BASED' && (sessionCounter <= 0 || expiresIn <= 0)){
                  throw new Error('negative and 0 values not allowed');
                }
                
                else if (productType === 'TIME_BASED' && expiresIn === undefined) {
                    throw new Error('Expiry is required for TIME_BASED products');
                }
                else if (productType === 'TIME_BASED' && expiresIn <= 0) {
                    throw new Error('negative and 0 values not allowed');
                }
              }
            const product = new Product({
              name,
              description,
              price,
              productType,
              sessionCounter: productType === 'SESSION_BASED' ? sessionCounter : null,
              expiresIn: productType === 'SESSION_BASED' ? expiresIn : (productType === 'TIME_BASED' ? expiresIn : null),
            });
        
            return await product.save();
        },
        
        updateProduct: async (parent, {input}, context) => {
            await authenticateAdmin(context)
            const { id, name, description, price, productType, expiresIn, sessionCounter } = input;
            const product = await Product.findById(id)
            if (!product) {
                throw new Error('Product not found');
            }

            const existingProduct = await Product.findOne({ $or: [{ name }, { description }] });

            if (existingProduct) {
              throw new Error('A product with the same name or description already exists.');
            }
            if (expiresIn === null && productType !== "EVENT") {
              throw new Error('Invalid value for expiresIn');
            }
          
            if (sessionCounter === null && productType !== "EVENT") {
              throw new Error('Invalid value for sessionCounter');
            }
          // Ensure that at least one counter is provided when switching between SESSION_BASED and TIME_BASED
            if (product.productType !== productType && productType !== 'EVENT') {
              if (productType === 'SESSION_BASED' && (sessionCounter === undefined || expiresIn === undefined)) {
                  throw new Error('Counter and expiry is required when switching to SESSION_BASED product type');
              } else if (productType === 'SESSION_BASED' && (sessionCounter <= 0 || expiresIn <= 0)){
                throw new Error('negative and 0 values not allowed');
              }
              else if (productType === 'TIME_BASED' && (expiresIn === undefined)) {
                  throw new Error('Counter is required when switching to TIME_BASED product type');
              }
              else if (productType === 'TIME_BASED' && expiresIn <= 0) {
                throw new Error('negative and 0 values not allowed');
            }
            }
            const updateFields = {
              name: name !== undefined ? name : (existingProduct?.name || product.name),
              description: description !== undefined ? description : (existingProduct?.description || product.description),
              price: price !== undefined ? price : (existingProduct?.price || product.price),
              productType: productType !== undefined ? productType : (existingProduct?.productType || product.productType),
              sessionCounter: null,
              expiresIn: null,
            };
            
            // Update sessionCounter and expiresIn based on the product type
            if (productType === 'SESSION_BASED') {
              if (productType === 'SESSION_BASED' && (sessionCounter <= 0 || expiresIn <= 0)){
                throw new Error('negative and 0 values not allowed')}
              updateFields.sessionCounter = (sessionCounter !== undefined) ? sessionCounter : product.sessionCounter;
              updateFields.expiresIn = (expiresIn !== undefined) ? expiresIn : product.expiresIn;
            } else if (productType === 'TIME_BASED' && expiresIn <= 0) {
              throw new Error('negative and 0 values not allowed');
          }
            else if (productType === 'TIME_BASED') {
              updateFields.expiresIn = (expiresIn !== undefined && !expiresIn <= 0) ? expiresIn : product.expiresIn;
            }
            return Product.findByIdAndUpdate(id, updateFields, { new: true });
            
        },

        deleteProduct: async (parent, { id }, context) => {
            await authenticateAdmin(context)
            try {
              // Find the product to be deleted
              const product = await Product.findById(id);
          
              if (!product) {
                throw new Error('Product not found');
              }
          
              // Find clients with this product ID and update their membershipStatus
              await Client.updateMany({ productId: id }, { $set: { membershipStatus: 'inactive', productId: null } });
          
              // Delete the product
              return Product.findByIdAndDelete(id);
          
            } catch (error) {
              throw new Error(error.message);
            }
        
        },

        registerUser: async (parent, {input}, context) => {
         await authenticateAdmin(context)
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

        updateUser: async (parent, { id, input }, context) => {
        await authenticateAdmin(context)
            // Find the user by ID
            const user = await User.findById(id);
      
            if (!user) {
              throw new Error('User not found');
            }

            // Check for duplicates in the database
            if (input.name || input.username || input.email) {
              const duplicateUser = await User.findOne({
                $or: [
                  { name: input.name },
                  { username: input.username },
                  { email: input.email },
                ],
                _id: { $ne: id }, // Exclude the current user
              });
        
              if (duplicateUser) {
                throw new Error('A user with the same name, username, or email already exists.');
              }
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

        loginUser: async (parent, args, context) => {
        const user = await User.findOne({ username: args.username });

        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(args.password, user.password);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const refreshToken = await createRefreshToken(user)
        context.res.cookie('refreshToken', refreshToken, {httpOnly: true,} )

        const token = await createAccessToken(user)

        return {user, token, refreshToken};
        
        },

        deleteUser: async(parent, args, context) => {
        await authenticateAdmin(context)
        return User.findByIdAndDelete(args.id)
        },
        addClientDocument: async (parent, {input}, context) => {
            await authenticateUser(context)
    
                        const { clientId, documentName, documentType, documentURL } = input;
                        const client = await Client.findById(clientId);
                
                        if (!client) {
                            throw new Error('Client not found');
                        }

                        if (!isValidURL(documentURL)) {
                            throw new Error('Invalid document URL');
                        }

                        if (!isValidFileExtension(documentType, documentName)) {
                            throw new Error('Invalid document name or type');
                        }
                  try {
                                 // Create a new document record
                                 const document = new ClientDocument({
                                     clientId,
                                     documentName,
                                     documentType,
                                     documentURL
                                 });
                        
                                 // Save the document record
                                 await document.save();
                                     client.documents.push(document.id);
                        
                                     await client.save();
                        
                                 return document;
                } catch (error) {
                    if (error.code === 11000) {
                      // Mongoose error code for duplicate key (index) violation
                      throw new Error('Document with the same name or URL already exists');
                    }
                    throw error;
                  }

                  
            },
            updateClientDocument: async (parent, { input }, context) => {
                await authenticateUser(context);
              
                const { id, clientId, documentName, documentType, documentURL } = input;
                const client = await Client.findById(clientId);
              
                if (!client) {
                  throw new Error('Client not found');
                }
              
                if (!isValidURL(documentURL)) {
                  throw new Error('Invalid document URL');
                }
              
                if (!isValidFileExtension(documentType, documentName)) {
                  throw new Error('Invalid document name or type');
                }
              
                // Check for duplicate entries based on documentName and documentType
                const existingDocument = await ClientDocument.findOne({
                  clientId,
                  documentName,
                  documentType,
                });
              
                if (existingDocument && existingDocument.id !== id) {
                  throw new Error('Duplicate document entry');
                }
              
                // Find the existing document by ID
                const documentToUpdate = await ClientDocument.findById(id);
              
                if (!documentToUpdate) {
                  throw new Error('Document not found');
                }
                console.log('documentToUpdate.clientId:', documentToUpdate.clientId);
                console.log('provided clientId:', clientId);

                if (!documentToUpdate.clientId.equals(clientId)) {
                    throw new Error('Document does not belong to the specified client');
                  }
              
                try {
                    // Update the document fields
                    documentToUpdate.documentName = documentName;
                    documentToUpdate.documentType = documentType;
                    documentToUpdate.documentURL = documentURL;
                  
                    // Save the updated document
                    await documentToUpdate.save();
                    return documentToUpdate;
                } catch (error) {
                    if (error.code === 11000) {
                        // Mongoose error code for duplicate key (index) violation
                        throw new Error('Document with the same name or URL already exists');
                      }
                      throw error;
                }
              },
              deleteClientDocument: async (parent, { id }, context) => {
                await authenticateAdmin(context)
                // Find the attendance record by its ID
                const document = await ClientDocument.findOne({id});
            
                if (!document) {
                  throw new Error('Document not found');
                }
            
                // Remove the attendance record's ID from the client's attendance array

                // Delete the attendance record
                await document.removeDocument();
            
                return document;
                },

    }
};
