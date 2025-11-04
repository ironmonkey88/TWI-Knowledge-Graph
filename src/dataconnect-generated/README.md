# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetItemTypesForUser*](#getitemtypesforuser)
  - [*GetItemsCreatedByUser*](#getitemscreatedbyuser)
- [**Mutations**](#mutations)
  - [*CreateNewItemType*](#createnewitemtype)
  - [*UpdateItemUnitNotes*](#updateitemunitnotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetItemTypesForUser
You can execute the `GetItemTypesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getItemTypesForUser(vars: GetItemTypesForUserVariables): QueryPromise<GetItemTypesForUserData, GetItemTypesForUserVariables>;

interface GetItemTypesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemTypesForUserVariables): QueryRef<GetItemTypesForUserData, GetItemTypesForUserVariables>;
}
export const getItemTypesForUserRef: GetItemTypesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getItemTypesForUser(dc: DataConnect, vars: GetItemTypesForUserVariables): QueryPromise<GetItemTypesForUserData, GetItemTypesForUserVariables>;

interface GetItemTypesForUserRef {
  ...
  (dc: DataConnect, vars: GetItemTypesForUserVariables): QueryRef<GetItemTypesForUserData, GetItemTypesForUserVariables>;
}
export const getItemTypesForUserRef: GetItemTypesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getItemTypesForUserRef:
```typescript
const name = getItemTypesForUserRef.operationName;
console.log(name);
```

### Variables
The `GetItemTypesForUser` query requires an argument of type `GetItemTypesForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetItemTypesForUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetItemTypesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetItemTypesForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetItemTypesForUserData {
  itemTypes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
  } & ItemType_Key)[];
}
```
### Using `GetItemTypesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getItemTypesForUser, GetItemTypesForUserVariables } from '@dataconnect/generated';

// The `GetItemTypesForUser` query requires an argument of type `GetItemTypesForUserVariables`:
const getItemTypesForUserVars: GetItemTypesForUserVariables = {
  userId: ..., 
};

// Call the `getItemTypesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getItemTypesForUser(getItemTypesForUserVars);
// Variables can be defined inline as well.
const { data } = await getItemTypesForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getItemTypesForUser(dataConnect, getItemTypesForUserVars);

console.log(data.itemTypes);

// Or, you can use the `Promise` API.
getItemTypesForUser(getItemTypesForUserVars).then((response) => {
  const data = response.data;
  console.log(data.itemTypes);
});
```

### Using `GetItemTypesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getItemTypesForUserRef, GetItemTypesForUserVariables } from '@dataconnect/generated';

// The `GetItemTypesForUser` query requires an argument of type `GetItemTypesForUserVariables`:
const getItemTypesForUserVars: GetItemTypesForUserVariables = {
  userId: ..., 
};

// Call the `getItemTypesForUserRef()` function to get a reference to the query.
const ref = getItemTypesForUserRef(getItemTypesForUserVars);
// Variables can be defined inline as well.
const ref = getItemTypesForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getItemTypesForUserRef(dataConnect, getItemTypesForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.itemTypes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.itemTypes);
});
```

## GetItemsCreatedByUser
You can execute the `GetItemsCreatedByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getItemsCreatedByUser(vars: GetItemsCreatedByUserVariables): QueryPromise<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;

interface GetItemsCreatedByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemsCreatedByUserVariables): QueryRef<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
}
export const getItemsCreatedByUserRef: GetItemsCreatedByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getItemsCreatedByUser(dc: DataConnect, vars: GetItemsCreatedByUserVariables): QueryPromise<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;

interface GetItemsCreatedByUserRef {
  ...
  (dc: DataConnect, vars: GetItemsCreatedByUserVariables): QueryRef<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
}
export const getItemsCreatedByUserRef: GetItemsCreatedByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getItemsCreatedByUserRef:
```typescript
const name = getItemsCreatedByUserRef.operationName;
console.log(name);
```

### Variables
The `GetItemsCreatedByUser` query requires an argument of type `GetItemsCreatedByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetItemsCreatedByUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetItemsCreatedByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetItemsCreatedByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetItemsCreatedByUserData {
  items: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
    itemType: {
      id: UUIDString;
      name: string;
    } & ItemType_Key;
  } & Item_Key)[];
}
```
### Using `GetItemsCreatedByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getItemsCreatedByUser, GetItemsCreatedByUserVariables } from '@dataconnect/generated';

// The `GetItemsCreatedByUser` query requires an argument of type `GetItemsCreatedByUserVariables`:
const getItemsCreatedByUserVars: GetItemsCreatedByUserVariables = {
  userId: ..., 
};

// Call the `getItemsCreatedByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getItemsCreatedByUser(getItemsCreatedByUserVars);
// Variables can be defined inline as well.
const { data } = await getItemsCreatedByUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getItemsCreatedByUser(dataConnect, getItemsCreatedByUserVars);

console.log(data.items);

// Or, you can use the `Promise` API.
getItemsCreatedByUser(getItemsCreatedByUserVars).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

### Using `GetItemsCreatedByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getItemsCreatedByUserRef, GetItemsCreatedByUserVariables } from '@dataconnect/generated';

// The `GetItemsCreatedByUser` query requires an argument of type `GetItemsCreatedByUserVariables`:
const getItemsCreatedByUserVars: GetItemsCreatedByUserVariables = {
  userId: ..., 
};

// Call the `getItemsCreatedByUserRef()` function to get a reference to the query.
const ref = getItemsCreatedByUserRef(getItemsCreatedByUserVars);
// Variables can be defined inline as well.
const ref = getItemsCreatedByUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getItemsCreatedByUserRef(dataConnect, getItemsCreatedByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.items);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.items);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewItemType
You can execute the `CreateNewItemType` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewItemType(vars: CreateNewItemTypeVariables): MutationPromise<CreateNewItemTypeData, CreateNewItemTypeVariables>;

interface CreateNewItemTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewItemTypeVariables): MutationRef<CreateNewItemTypeData, CreateNewItemTypeVariables>;
}
export const createNewItemTypeRef: CreateNewItemTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewItemType(dc: DataConnect, vars: CreateNewItemTypeVariables): MutationPromise<CreateNewItemTypeData, CreateNewItemTypeVariables>;

interface CreateNewItemTypeRef {
  ...
  (dc: DataConnect, vars: CreateNewItemTypeVariables): MutationRef<CreateNewItemTypeData, CreateNewItemTypeVariables>;
}
export const createNewItemTypeRef: CreateNewItemTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewItemTypeRef:
```typescript
const name = createNewItemTypeRef.operationName;
console.log(name);
```

### Variables
The `CreateNewItemType` mutation requires an argument of type `CreateNewItemTypeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewItemTypeVariables {
  userId: UUIDString;
  name: string;
  description: string;
}
```
### Return Type
Recall that executing the `CreateNewItemType` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewItemTypeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewItemTypeData {
  itemType_insert: ItemType_Key;
}
```
### Using `CreateNewItemType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewItemType, CreateNewItemTypeVariables } from '@dataconnect/generated';

// The `CreateNewItemType` mutation requires an argument of type `CreateNewItemTypeVariables`:
const createNewItemTypeVars: CreateNewItemTypeVariables = {
  userId: ..., 
  name: ..., 
  description: ..., 
};

// Call the `createNewItemType()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewItemType(createNewItemTypeVars);
// Variables can be defined inline as well.
const { data } = await createNewItemType({ userId: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewItemType(dataConnect, createNewItemTypeVars);

console.log(data.itemType_insert);

// Or, you can use the `Promise` API.
createNewItemType(createNewItemTypeVars).then((response) => {
  const data = response.data;
  console.log(data.itemType_insert);
});
```

### Using `CreateNewItemType`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewItemTypeRef, CreateNewItemTypeVariables } from '@dataconnect/generated';

// The `CreateNewItemType` mutation requires an argument of type `CreateNewItemTypeVariables`:
const createNewItemTypeVars: CreateNewItemTypeVariables = {
  userId: ..., 
  name: ..., 
  description: ..., 
};

// Call the `createNewItemTypeRef()` function to get a reference to the mutation.
const ref = createNewItemTypeRef(createNewItemTypeVars);
// Variables can be defined inline as well.
const ref = createNewItemTypeRef({ userId: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewItemTypeRef(dataConnect, createNewItemTypeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.itemType_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.itemType_insert);
});
```

## UpdateItemUnitNotes
You can execute the `UpdateItemUnitNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateItemUnitNotes(vars: UpdateItemUnitNotesVariables): MutationPromise<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;

interface UpdateItemUnitNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateItemUnitNotesVariables): MutationRef<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
}
export const updateItemUnitNotesRef: UpdateItemUnitNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateItemUnitNotes(dc: DataConnect, vars: UpdateItemUnitNotesVariables): MutationPromise<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;

interface UpdateItemUnitNotesRef {
  ...
  (dc: DataConnect, vars: UpdateItemUnitNotesVariables): MutationRef<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
}
export const updateItemUnitNotesRef: UpdateItemUnitNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateItemUnitNotesRef:
```typescript
const name = updateItemUnitNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateItemUnitNotes` mutation requires an argument of type `UpdateItemUnitNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateItemUnitNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateItemUnitNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateItemUnitNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateItemUnitNotesData {
  itemUnit_update?: ItemUnit_Key | null;
}
```
### Using `UpdateItemUnitNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateItemUnitNotes, UpdateItemUnitNotesVariables } from '@dataconnect/generated';

// The `UpdateItemUnitNotes` mutation requires an argument of type `UpdateItemUnitNotesVariables`:
const updateItemUnitNotesVars: UpdateItemUnitNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateItemUnitNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateItemUnitNotes(updateItemUnitNotesVars);
// Variables can be defined inline as well.
const { data } = await updateItemUnitNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateItemUnitNotes(dataConnect, updateItemUnitNotesVars);

console.log(data.itemUnit_update);

// Or, you can use the `Promise` API.
updateItemUnitNotes(updateItemUnitNotesVars).then((response) => {
  const data = response.data;
  console.log(data.itemUnit_update);
});
```

### Using `UpdateItemUnitNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateItemUnitNotesRef, UpdateItemUnitNotesVariables } from '@dataconnect/generated';

// The `UpdateItemUnitNotes` mutation requires an argument of type `UpdateItemUnitNotesVariables`:
const updateItemUnitNotesVars: UpdateItemUnitNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateItemUnitNotesRef()` function to get a reference to the mutation.
const ref = updateItemUnitNotesRef(updateItemUnitNotesVars);
// Variables can be defined inline as well.
const ref = updateItemUnitNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateItemUnitNotesRef(dataConnect, updateItemUnitNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.itemUnit_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.itemUnit_update);
});
```

