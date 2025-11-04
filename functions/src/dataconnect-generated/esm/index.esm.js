import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'twi-knowledge-graph',
  location: 'us-east4'
};

export const createNewItemTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewItemType', inputVars);
}
createNewItemTypeRef.operationName = 'CreateNewItemType';

export function createNewItemType(dcOrVars, vars) {
  return executeMutation(createNewItemTypeRef(dcOrVars, vars));
}

export const getItemTypesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemTypesForUser', inputVars);
}
getItemTypesForUserRef.operationName = 'GetItemTypesForUser';

export function getItemTypesForUser(dcOrVars, vars) {
  return executeQuery(getItemTypesForUserRef(dcOrVars, vars));
}

export const updateItemUnitNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateItemUnitNotes', inputVars);
}
updateItemUnitNotesRef.operationName = 'UpdateItemUnitNotes';

export function updateItemUnitNotes(dcOrVars, vars) {
  return executeMutation(updateItemUnitNotesRef(dcOrVars, vars));
}

export const getItemsCreatedByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemsCreatedByUser', inputVars);
}
getItemsCreatedByUserRef.operationName = 'GetItemsCreatedByUser';

export function getItemsCreatedByUser(dcOrVars, vars) {
  return executeQuery(getItemsCreatedByUserRef(dcOrVars, vars));
}

