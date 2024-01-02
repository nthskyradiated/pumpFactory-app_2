import type { OperationStore } from '@urql/svelte';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AddAttendanceInput = {
  clientId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
};

export type AddClientDocumentInput = {
  clientId: Scalars['ID']['input'];
  documentName: Scalars['String']['input'];
  documentType: Scalars['String']['input'];
  documentURL: Scalars['String']['input'];
};

export type AddClientInput = {
  birthdate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  waiver: Scalars['Boolean']['input'];
};

export type AddProductInput = {
  description: Scalars['String']['input'];
  expiresIn?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  productType: ProductType;
  sessionCounter?: InputMaybe<Scalars['Int']['input']>;
};

export type AddUserInput = {
  email: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Attendance = {
  __typename?: 'Attendance';
  checkIn: Scalars['Date']['output'];
  client?: Maybe<Client>;
  clientId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  refreshToken?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Client = {
  __typename?: 'Client';
  age: Scalars['Int']['output'];
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  birthdate: Scalars['Date']['output'];
  clientExpiresIn?: Maybe<Scalars['Date']['output']>;
  clientSessionCounter?: Maybe<Scalars['Int']['output']>;
  documents?: Maybe<Array<Maybe<ClientDocument>>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  membershipStatus: MembershipStatus;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  product?: Maybe<Product>;
  waiver: Scalars['Boolean']['output'];
};

export type ClientDocument = {
  __typename?: 'ClientDocument';
  client?: Maybe<Client>;
  clientId: Scalars['ID']['output'];
  documentName: Scalars['String']['output'];
  documentType: DocumentType;
  documentURL: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum DocumentType {
  Identification = 'IDENTIFICATION',
  Photo = 'PHOTO',
  Waiver = 'WAIVER'
}

export enum MembershipStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export type Mutation = {
  __typename?: 'Mutation';
  addAttendance?: Maybe<Attendance>;
  addClient?: Maybe<Client>;
  addClientDocument?: Maybe<ClientDocument>;
  addProduct?: Maybe<Product>;
  deleteAttendance?: Maybe<Attendance>;
  deleteClient?: Maybe<Client>;
  deleteClientDocument?: Maybe<ClientDocument>;
  deleteProduct?: Maybe<Product>;
  deleteUser?: Maybe<User>;
  loginUser?: Maybe<AuthPayload>;
  registerUser?: Maybe<User>;
  updateClient?: Maybe<Client>;
  updateClientDocument?: Maybe<ClientDocument>;
  updateProduct?: Maybe<Product>;
  updateUser?: Maybe<User>;
};


export type MutationAddAttendanceArgs = {
  input: AddAttendanceInput;
};


export type MutationAddClientArgs = {
  input: AddClientInput;
  productId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationAddClientDocumentArgs = {
  input: AddClientDocumentInput;
};


export type MutationAddProductArgs = {
  input: AddProductInput;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  input: AddUserInput;
};


export type MutationUpdateClientArgs = {
  input: UpdateClientInput;
  productId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdateClientDocumentArgs = {
  input: UpdateClientDocumentInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<UpdateUserInput>;
};

export type Product = {
  __typename?: 'Product';
  description: Scalars['String']['output'];
  expiresIn?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  productType: ProductType;
  sessionCounter?: Maybe<Scalars['Int']['output']>;
};

export enum ProductType {
  Event = 'EVENT',
  SessionBased = 'SESSION_BASED',
  TimeBased = 'TIME_BASED'
}

export type Query = {
  __typename?: 'Query';
  activeClients?: Maybe<Array<Maybe<Client>>>;
  attendance?: Maybe<Attendance>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  client?: Maybe<Client>;
  clientByName?: Maybe<Array<Maybe<Client>>>;
  clients?: Maybe<Array<Maybe<Client>>>;
  document?: Maybe<ClientDocument>;
  documents?: Maybe<Array<Maybe<ClientDocument>>>;
  monthlyAttendance?: Maybe<Array<Maybe<Attendance>>>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Maybe<Product>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryActiveClientsArgs = {
  membershipStatus?: InputMaybe<MembershipStatus>;
};


export type QueryAttendanceArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryClientArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryClientByNameArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryMonthlyAttendanceArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryProductArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  ID: Scalars['ID']['input'];
};

export type UpdateClientDocumentInput = {
  clientId: Scalars['ID']['input'];
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentType?: InputMaybe<Scalars['String']['input']>;
  documentURL?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateClientInput = {
  birthdate?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  waiver?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expiresIn?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  productType?: InputMaybe<ProductType>;
  sessionCounter?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type AddAttendanceMutationVariables = Exact<{
  input: AddAttendanceInput;
}>;


export type AddAttendanceMutation = { __typename?: 'Mutation', addAttendance?: { __typename?: 'Attendance', checkIn: any, clientId: string, productId: string } | null };

export type AddClientMutationVariables = Exact<{
  input: AddClientInput;
}>;


export type AddClientMutation = { __typename?: 'Mutation', addClient?: { __typename?: 'Client', id: string, name: string, email: string, phone: string, birthdate: any, age: number, waiver: boolean, membershipStatus: MembershipStatus, product?: { __typename?: 'Product', name: string, description: string, price: number } | null } | null };

export type AddClientDocumentMutationVariables = Exact<{
  input: AddClientDocumentInput;
}>;


export type AddClientDocumentMutation = { __typename?: 'Mutation', addClientDocument?: { __typename?: 'ClientDocument', clientId: string, documentName: string, documentType: DocumentType, documentURL: string } | null };

export type AddProductMutationVariables = Exact<{
  input: AddProductInput;
}>;


export type AddProductMutation = { __typename?: 'Mutation', addProduct?: { __typename?: 'Product', id: string, name: string, description: string, price: number, productType: ProductType, expiresIn?: number | null, sessionCounter?: number | null } | null };

export type DeleteAttendanceMutationVariables = Exact<{
  deleteAttendanceId: Scalars['ID']['input'];
}>;


export type DeleteAttendanceMutation = { __typename?: 'Mutation', deleteAttendance?: { __typename?: 'Attendance', checkIn: any, clientId: string } | null };

export type DeleteClientMutationVariables = Exact<{
  deleteClientId: Scalars['ID']['input'];
}>;


export type DeleteClientMutation = { __typename?: 'Mutation', deleteClient?: { __typename?: 'Client', id: string, name: string } | null };

export type DeleteClientDocumentMutationVariables = Exact<{
  deleteClientDocumentId: Scalars['ID']['input'];
}>;


export type DeleteClientDocumentMutation = { __typename?: 'Mutation', deleteClientDocument?: { __typename?: 'ClientDocument', documentName: string, documentType: DocumentType, documentURL: string } | null };

export type DeleteProductMutationVariables = Exact<{
  deleteProductId: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct?: { __typename?: 'Product', id: string, name: string } | null };

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser?: { __typename?: 'AuthPayload', token?: string | null, refreshToken?: string | null, user?: { __typename?: 'User', id: string, email: string, isAdmin: boolean, name: string, username: string } | null } | null };

export type UpdateClientMutationVariables = Exact<{
  input: UpdateClientInput;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'Client', id: string, name: string, email: string, phone: string, birthdate: any, age: number, waiver: boolean, membershipStatus: MembershipStatus, product?: { __typename?: 'Product', name: string, description: string, price: number } | null } | null };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'Product', id: string, name: string, description: string, price: number, productType: ProductType, expiresIn?: number | null, sessionCounter?: number | null } | null };

export type AttendancesQueryVariables = Exact<{ [key: string]: never; }>;


export type AttendancesQuery = { __typename?: 'Query', attendances?: Array<{ __typename?: 'Attendance', id: string, checkIn: any, client?: { __typename?: 'Client', name: string } | null, product?: { __typename?: 'Product', name: string } | null } | null> | null };

export type ClientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ClientQuery = { __typename?: 'Query', client?: { __typename?: 'Client', id: string, name: string, email: string, phone: string, birthdate: any, age: number, waiver: boolean, membershipStatus: MembershipStatus, clientSessionCounter?: number | null, clientExpiresIn?: any | null, product?: { __typename?: 'Product', id: string, name: string, description: string } | null, attendance?: Array<{ __typename?: 'Attendance', id: string, checkIn: any, productId: string, product?: { __typename?: 'Product', name: string } | null } | null> | null, documents?: Array<{ __typename?: 'ClientDocument', id: string, documentName: string, documentType: DocumentType, documentURL: string } | null> | null } | null };

export type ClientByNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type ClientByNameQuery = { __typename?: 'Query', clientByName?: Array<{ __typename?: 'Client', id: string, name: string, email: string, phone: string, birthdate: any, age: number, waiver: boolean, membershipStatus: MembershipStatus, clientSessionCounter?: number | null, clientExpiresIn?: any | null } | null> | null };

export type ClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientsQuery = { __typename?: 'Query', clients?: Array<{ __typename?: 'Client', id: string, name: string, email: string, phone: string, birthdate: any, age: number, waiver: boolean, membershipStatus: MembershipStatus, clientSessionCounter?: number | null, clientExpiresIn?: any | null } | null> | null };

export type MonthlyAttendanceQueryVariables = Exact<{
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
}>;


export type MonthlyAttendanceQuery = { __typename?: 'Query', monthlyAttendance?: Array<{ __typename?: 'Attendance', id: string, checkIn: any, client?: { __typename?: 'Client', name: string } | null, product?: { __typename?: 'Product', name: string } | null } | null> | null };

export type ProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, description: string, price: number, productType: ProductType, sessionCounter?: number | null, expiresIn?: number | null } | null };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: string, name: string, description: string, price: number, productType: ProductType, expiresIn?: number | null } | null> | null };


export const AddAttendanceDocument = gql`
    mutation AddAttendance($input: AddAttendanceInput!) {
  addAttendance(input: $input) {
    checkIn
    clientId
    productId
  }
}
    `;
export const AddClientDocument = gql`
    mutation AddClient($input: AddClientInput!) {
  addClient(input: $input) {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    product {
      name
      description
      price
    }
  }
}
    `;
export const AddClientDocumentDocument = gql`
    mutation AddClientDocument($input: AddClientDocumentInput!) {
  addClientDocument(input: $input) {
    clientId
    documentName
    documentType
    documentURL
  }
}
    `;
export const AddProductDocument = gql`
    mutation AddProduct($input: AddProductInput!) {
  addProduct(input: $input) {
    id
    name
    description
    price
    productType
    expiresIn
    sessionCounter
  }
}
    `;
export const DeleteAttendanceDocument = gql`
    mutation DeleteAttendance($deleteAttendanceId: ID!) {
  deleteAttendance(id: $deleteAttendanceId) {
    checkIn
    clientId
  }
}
    `;
export const DeleteClientDocument = gql`
    mutation DeleteClient($deleteClientId: ID!) {
  deleteClient(id: $deleteClientId) {
    id
    name
  }
}
    `;
export const DeleteClientDocumentDocument = gql`
    mutation DeleteClientDocument($deleteClientDocumentId: ID!) {
  deleteClientDocument(id: $deleteClientDocumentId) {
    documentName
    documentType
    documentURL
  }
}
    `;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId) {
    id
    name
  }
}
    `;
export const LoginUserDocument = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    token
    refreshToken
    user {
      id
      email
      isAdmin
      name
      username
    }
  }
}
    `;
export const UpdateClientDocument = gql`
    mutation UpdateClient($input: UpdateClientInput!) {
  updateClient(input: $input) {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    product {
      name
      description
      price
    }
  }
}
    `;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    id
    name
    description
    price
    productType
    expiresIn
    sessionCounter
  }
}
    `;
export const AttendancesDocument = gql`
    query Attendances {
  attendances {
    id
    checkIn
    client {
      name
    }
    product {
      name
    }
  }
}
    `;
export const ClientDocument = gql`
    query Client($id: ID!) {
  client(ID: $id) {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    clientSessionCounter
    clientExpiresIn
    product {
      id
      name
      description
    }
    attendance {
      id
      checkIn
      productId
      product {
        name
      }
    }
    documents {
      id
      documentName
      documentType
      documentURL
    }
  }
}
    `;
export const ClientByNameDocument = gql`
    query ClientByName($name: String) {
  clientByName(name: $name) {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    clientSessionCounter
    clientExpiresIn
  }
}
    `;
export const ClientsDocument = gql`
    query Clients {
  clients {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    clientSessionCounter
    clientExpiresIn
  }
}
    `;
export const MonthlyAttendanceDocument = gql`
    query MonthlyAttendance($month: Int!, $year: Int!) {
  monthlyAttendance(month: $month, year: $year) {
    id
    checkIn
    client {
      name
    }
    product {
      name
    }
  }
}
    `;
export const ProductDocument = gql`
    query Product($id: ID!) {
  product(ID: $id) {
    id
    name
    description
    price
    productType
    sessionCounter
    expiresIn
  }
}
    `;
export const ProductsDocument = gql`
    query Products {
  products {
    id
    name
    description
    price
    productType
    expiresIn
  }
}
    `;
export type AddAttendanceMutationStore = OperationStore<AddAttendanceMutation, AddAttendanceMutationVariables>;
export type AddClientMutationStore = OperationStore<AddClientMutation, AddClientMutationVariables>;
export type AddClientDocumentMutationStore = OperationStore<AddClientDocumentMutation, AddClientDocumentMutationVariables>;
export type AddProductMutationStore = OperationStore<AddProductMutation, AddProductMutationVariables>;
export type DeleteAttendanceMutationStore = OperationStore<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>;
export type DeleteClientMutationStore = OperationStore<DeleteClientMutation, DeleteClientMutationVariables>;
export type DeleteClientDocumentMutationStore = OperationStore<DeleteClientDocumentMutation, DeleteClientDocumentMutationVariables>;
export type DeleteProductMutationStore = OperationStore<DeleteProductMutation, DeleteProductMutationVariables>;
export type LoginUserMutationStore = OperationStore<LoginUserMutation, LoginUserMutationVariables>;
export type UpdateClientMutationStore = OperationStore<UpdateClientMutation, UpdateClientMutationVariables>;
export type UpdateProductMutationStore = OperationStore<UpdateProductMutation, UpdateProductMutationVariables>;
export type AttendancesQueryStore = OperationStore<AttendancesQuery, AttendancesQueryVariables>;
export type ClientQueryStore = OperationStore<ClientQuery, ClientQueryVariables>;
export type ClientByNameQueryStore = OperationStore<ClientByNameQuery, ClientByNameQueryVariables>;
export type ClientsQueryStore = OperationStore<ClientsQuery, ClientsQueryVariables>;
export type MonthlyAttendanceQueryStore = OperationStore<MonthlyAttendanceQuery, MonthlyAttendanceQueryVariables>;
export type ProductQueryStore = OperationStore<ProductQuery, ProductQueryVariables>;
export type ProductsQueryStore = OperationStore<ProductsQuery, ProductsQueryVariables>;