import { combineReducers } from "redux";
import global from "./global";
import auction from "./auction";

export const rootReducer = combineReducers({
    global: global,
    auction: auction
})

const reducers = (state, action) => rootReducer(state, action);

export default reducers;