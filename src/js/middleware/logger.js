export default store => next => action => {
  const groupName = typeof action === 'function' ? 'thunk' : action.type;
  console.group(groupName);
  console.log('previous state', store.getState().toJS());
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState().toJS());
  console.groupEnd(action.type);
  return result;
};