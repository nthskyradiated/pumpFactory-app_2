export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export type AddClientInput = {
  birthdate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  waiver: Scalars['Boolean']['input'];
};

export type AddProductInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
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
  clientId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Client = {
  __typename?: 'Client';
  age: Scalars['Int']['output'];
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  birthdate: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  membershipStatus: MembershipStatus;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  product?: Maybe<Product>;
  waiver: Scalars['Boolean']['output'];
};

export enum MembershipStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export type Mutation = {
  __typename?: 'Mutation';
  addAttendance?: Maybe<Attendance>;
  addClient?: Maybe<Client>;
  addProduct?: Maybe<Product>;
  deleteAttendance?: Maybe<Attendance>;
  deleteClient?: Maybe<Client>;
  deleteProduct?: Maybe<Product>;
  deleteUser?: Maybe<User>;
  loginUser?: Maybe<AuthPayload>;
  registerUser?: Maybe<User>;
  updateClient?: Maybe<Client>;
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


export type MutationAddProductArgs = {
  input: AddProductInput;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
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
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  attendance?: Maybe<Attendance>;
  client?: Maybe<Client>;
  clients?: Maybe<Array<Maybe<Client>>>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Maybe<Product>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryAttendanceArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryClientArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  ID: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  ID: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
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
