import { getType } from "typesafe-actions";
import { ALERT_EMPTY } from "../../utils/constants";
import * as actions from "../actions"

export const initialState = {
    user: {
        address: "",
        publicKey: ""
    },
    alertMessage: {
        type: ALERT_EMPTY,
        message: ""
    },
    connected: false,
    signInfo: {
        signed: false,
        signedMessage: ""
    },
    userProfile: {
        btcAccount: "",
        btcBalance: 0
    },
    notifications: [],
    collections: [],
    updateCollectionFlag: false,
    inscriberId: "",
};

const states = (state = initialState, action) => {
    switch(action.type) {
        case getType(actions.setUserInfo):
            return {...state, user: action.payload};
        case getType(actions.setWalletConnected):
            return {...state, connected: action.payload};
        case getType(actions.setUserProfile):
            return {...state, userProfile: action.payload};
        case getType(actions.setSignedMessage):
            return {...state, signInfo: action.payload};
        case getType(actions.setAlertMessage):
            return {...state, alertMessage: action.payload};
        case getType(actions.setNotifications):
            return {...state, notifications: action.payload};
        case getType(actions.setClearNotifications):
            return {...state, notifications: []}
        case getType(actions.setCollections):
            return {...state, collections: action.payload};
        case getType(actions.setInscriberId):
            return {...state, inscriberId: action.payload};
        case getType(actions.setUpdateCollectionFlag):
            return {...state, updateCollection: action.payload};
        default:
            return state;
    }
}

export default states;