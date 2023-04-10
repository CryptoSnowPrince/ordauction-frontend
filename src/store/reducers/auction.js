import { getType } from "typesafe-actions";
import * as actions from "../actions"

export const initialState = {
    activeAuctionId: -1,
    activeAuction: {
        auctionId: -1,
        inscriptionId: "",
        bidCounts: 0,
        state: 0,
        winnerOrdWallet: "",
        amount: "",
        auctionStart: 0,
        auctionEnd: 0,
    },
    bids: [],
    lastAuctionId: -1
};

const states = (state = initialState, action) => {
    switch(action.type) {
        case getType(actions.setActiveAuctionId):
            return {...state, activeAuctionId: action.payload};
        case getType(actions.setActiveAuction):
            return {...state, activeAuction: action.payload};
        case getType(actions.setActiveBids):
            return {...state, bids: action.payload};
        case getType(actions.setLastAuctionId):
            return {...state, lastAuctionId: action.payload};
        default:
            return state;        
    }
}

export default states;