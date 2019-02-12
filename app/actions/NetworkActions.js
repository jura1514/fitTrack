const actionTypes = {
  networkChangeAction: 'NETWORK_CHANGE',
};

const networkChange = (isConnected) => {
  return {
    type: actionTypes.networkChangeAction,
    payload: isConnected,
  };
};

export default networkChange;
