import {createStore, applyMiddleware} from 'redux';
import reducer from '../reducer/reducer.js';
import thunk from './middleware/redux-thunk';
import logger from './middleware/logger.js';

export default () => createStore(reducer, applyMiddleware(
  logger,
  thunk
));