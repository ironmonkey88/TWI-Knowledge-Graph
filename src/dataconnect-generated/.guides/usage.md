# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateNewItemType, useGetItemTypesForUser, useUpdateItemUnitNotes, useGetItemsCreatedByUser } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateNewItemType(createNewItemTypeVars);

const { data, isPending, isSuccess, isError, error } = useGetItemTypesForUser(getItemTypesForUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateItemUnitNotes(updateItemUnitNotesVars);

const { data, isPending, isSuccess, isError, error } = useGetItemsCreatedByUser(getItemsCreatedByUserVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewItemType, getItemTypesForUser, updateItemUnitNotes, getItemsCreatedByUser } from '@dataconnect/generated';


// Operation CreateNewItemType:  For variables, look at type CreateNewItemTypeVars in ../index.d.ts
const { data } = await CreateNewItemType(dataConnect, createNewItemTypeVars);

// Operation GetItemTypesForUser:  For variables, look at type GetItemTypesForUserVars in ../index.d.ts
const { data } = await GetItemTypesForUser(dataConnect, getItemTypesForUserVars);

// Operation UpdateItemUnitNotes:  For variables, look at type UpdateItemUnitNotesVars in ../index.d.ts
const { data } = await UpdateItemUnitNotes(dataConnect, updateItemUnitNotesVars);

// Operation GetItemsCreatedByUser:  For variables, look at type GetItemsCreatedByUserVars in ../index.d.ts
const { data } = await GetItemsCreatedByUser(dataConnect, getItemsCreatedByUserVars);


```