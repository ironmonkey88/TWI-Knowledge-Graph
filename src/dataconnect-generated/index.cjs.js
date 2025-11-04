const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'twi-knowledge-graph',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewItemTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewItemType', inputVars);
}
createNewItemTypeRef.operationName = 'CreateNewItemType';
exports.createNewItemTypeRef = createNewItemTypeRef;

exports.createNewItemType = function createNewItemType(dcOrVars, vars) {
  return executeMutation(createNewItemTypeRef(dcOrVars, vars));
};

const getItemTypesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemTypesForUser', inputVars);
}
getItemTypesForUserRef.operationName = 'GetItemTypesForUser';
exports.getItemTypesForUserRef = getItemTypesForUserRef;

exports.getItemTypesForUser = function getItemTypesForUser(dcOrVars, vars) {
  return executeQuery(getItemTypesForUserRef(dcOrVars, vars));
};

const updateItemUnitNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateItemUnitNotes', inputVars);
}
updateItemUnitNotesRef.operationName = 'UpdateItemUnitNotes';
exports.updateItemUnitNotesRef = updateItemUnitNotesRef;

exports.updateItemUnitNotes = function updateItemUnitNotes(dcOrVars, vars) {
  return executeMutation(updateItemUnitNotesRef(dcOrVars, vars));
};

const getItemsCreatedByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemsCreatedByUser', inputVars);
}
getItemsCreatedByUserRef.operationName = 'GetItemsCreatedByUser';
exports.getItemsCreatedByUserRef = getItemsCreatedByUserRef;

exports.getItemsCreatedByUser = function getItemsCreatedByUser(dcOrVars, vars) {
  return executeQuery(getItemsCreatedByUserRef(dcOrVars, vars));
};
