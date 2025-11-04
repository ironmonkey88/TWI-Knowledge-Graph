import { CreateNewItemTypeData, CreateNewItemTypeVariables, GetItemTypesForUserData, GetItemTypesForUserVariables, UpdateItemUnitNotesData, UpdateItemUnitNotesVariables, GetItemsCreatedByUserData, GetItemsCreatedByUserVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewItemType(options?: useDataConnectMutationOptions<CreateNewItemTypeData, FirebaseError, CreateNewItemTypeVariables>): UseDataConnectMutationResult<CreateNewItemTypeData, CreateNewItemTypeVariables>;
export function useCreateNewItemType(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewItemTypeData, FirebaseError, CreateNewItemTypeVariables>): UseDataConnectMutationResult<CreateNewItemTypeData, CreateNewItemTypeVariables>;

export function useGetItemTypesForUser(vars: GetItemTypesForUserVariables, options?: useDataConnectQueryOptions<GetItemTypesForUserData>): UseDataConnectQueryResult<GetItemTypesForUserData, GetItemTypesForUserVariables>;
export function useGetItemTypesForUser(dc: DataConnect, vars: GetItemTypesForUserVariables, options?: useDataConnectQueryOptions<GetItemTypesForUserData>): UseDataConnectQueryResult<GetItemTypesForUserData, GetItemTypesForUserVariables>;

export function useUpdateItemUnitNotes(options?: useDataConnectMutationOptions<UpdateItemUnitNotesData, FirebaseError, UpdateItemUnitNotesVariables>): UseDataConnectMutationResult<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;
export function useUpdateItemUnitNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateItemUnitNotesData, FirebaseError, UpdateItemUnitNotesVariables>): UseDataConnectMutationResult<UpdateItemUnitNotesData, UpdateItemUnitNotesVariables>;

export function useGetItemsCreatedByUser(vars: GetItemsCreatedByUserVariables, options?: useDataConnectQueryOptions<GetItemsCreatedByUserData>): UseDataConnectQueryResult<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
export function useGetItemsCreatedByUser(dc: DataConnect, vars: GetItemsCreatedByUserVariables, options?: useDataConnectQueryOptions<GetItemsCreatedByUserData>): UseDataConnectQueryResult<GetItemsCreatedByUserData, GetItemsCreatedByUserVariables>;
