# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





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