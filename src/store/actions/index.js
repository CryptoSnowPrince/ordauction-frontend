import { createAction as action } from "typesafe-actions"

/// Global
export const setUserInfo = action("global/SET_USER_INFO")();
export const setWalletConnected = action("global/SET_WALLET_CONNECTED")();
export const setSignedMessage = action("global/SET_SIGNED_MESSAGE")();
export const setUserProfile = action("global/SET_USER_PROFILE")();

export const setAlertMessage = action("global/SET_ALERT_MESSAGE")();
export const setNotifications = action("global/SET_NOTIFICATIONS")();
export const setClearNotifications = action("global/CLEAR_NOTIFICATIONS")();

export const setCollections = action("global/SET_COLLETIONS")();
export const setUpdateCollectionFlag = action("global/SET_UPDATE_COLLECTION_FLAG")();

export const setInscriberId = action("global/SET_INSCRIBER_ID")();


/// Auction
export const setActiveAuctionId = action("auction/SET_ACTIVE_AUCTION_ID")();
export const setActiveAuction = action("auction/SET_ACTIVE_AUCTION")();
export const setActiveBids = action("auction/SET_ACTIVE_BIDS")();
export const setLastAuctionId = action("auction/SET_LAST_AUCTION_ID")();

export const setPrevAuctionId = action("auction/SET_PREV_AUCTON_ID")();
export const setNextAuctionId = action("auction/SET_NEXT_AUCTON_ID")();