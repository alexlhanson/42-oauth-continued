const logger = store => next => action => {
  console.log('__Action__', action);

  try{
    let result = next(action);
    console.log('__State__', store.getState());
    return result;
  } catch(error){
    error.action = action;
    console.error('__Error__', error);
    return error
  }
}

export default logger;