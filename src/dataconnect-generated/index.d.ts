import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateNewItemTypeData {
  itemType_insert: ItemType_Key;
}

export interface CreateNewItemTypeVariables {
  userId: UUIDString;
  name: string;
  description: string;
}

export interface CustomField_Key {
  id: UUIDString;
  __typename?: 'CustomField_Key';
}

export interface GetItemTypesForUserData {
  itemTypes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    createdAt: TimestampString;
  } & ItemType_Key)[];
}

export interface GetItemTypesForUserVariables {
  userId: UUIDString;
}

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

export interface GetItemsCreatedByUserVariables {
  userId: UUIDString;
}

export interface ItemHistory_Key {
  id: UUIDString;
  __typename?: 'ItemHistory_Key';
}

export interface ItemType_Key {
  id: UUIDString;
  __typename?: 'ItemType_Key';
}

export interface ItemUnit_Key {
  id: UUIDString;
  __typename?: 'ItemUnit_Key';
}

export interface Item_Key {
  id: UUIDString;
  __typename?: 'Item_Key';
}

export interface UpdateItemUnitNotesData {
  itemUnit_update?: ItemUnit_Key | null;
}

export interface UpdateItemUnitNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewItemTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewItemTypeVariables): MutationRef<CreateNewItemTypeData, CreateNewItemTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewItemTypeVariables): MutationRef<CreateNewItemTypeData, CreateNewItemTypeVariables>;
  operationName: string;
}
export const createNewItemTypeRef: CreateNewItemTypeRef;

export function createNewItemType(vars: CreateNewItemTypeVariables): MutationPromise<CreateNewItemTypeData, CreateNewItemTypeVariables>;
export function createNewItemType(dc: DataConnect, vars: CreateNewItemTypeVariables): MutationPromise<CreateNewItemTypeData, CreateNewItemTypeVariables>;

interface GetItemTypesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemTypesForUserVariables): QueryRef<GetItemTypesForUserData, GetItemTypesForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetItemTypesForUserVariables): QueryRef<GetItemTypesForUserData, GetItemTypesForUserVariables>;
  operationName: string;
}
export const getItemTypesForUserRef: GetItemTypesForUserRef;

export function getItemTypesForUser(vars: GetItemTypesForUserVariables): QueryPromise<GetItemTypesForUserData, GetItemTypesForUserVariables>;
export function getItemTypesForUser(dc: DataConnect, vars: GetItemTypesForUserVariables): QueryPromise<GetItemTypesForUserData, GetItemTypesForUserVariables>;

interface UpdateItemUnitNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateItemUnitNotesVariables): MutationRef<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateItemUnitNotesVariables): MutationRef<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
  operationName: string;
}
export const updateItemUnitNotesRef: UpdateItemUnitNotesRef;

export function updateItemUnitNotes(vars: UpdateItemUnitNotesVariables): MutationPromise<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
export function updateItemUnitNotes(dc: DataConnect, vars: UpdateItemUnitNotesVariables): MutationPromise<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;

interface GetItemsCreatedByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemsCreatedByUserVariables): QueryRef<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetItemsCreatedByUserVariables): QueryRef<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
  operationName: string;
}
export const getItemsCreatedByUserRef: GetItemsCreatedByUserRef;

export function getItemsCreatedByUser(vars: GetItemsCreatedByUserVariables): QueryPromise<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
export function getItemsCreatedByUser(dc: DataConnect, vars: GetItemsCreatedByUserVariables): QueryPromise<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;

