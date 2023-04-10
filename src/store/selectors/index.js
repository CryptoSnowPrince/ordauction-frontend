/// global
export const getAlertMessage = (state) => state.global.alertMessage;
export const getNotifications = (state) => state.global.notifications;
export const getCollections = (state) => state.global.collections;
export const getUpdateCollectionFlag = (state) => state.global.updateCollectionFlag;
export const getInscriberId = (state) => state.global.inscriberId;
export const getUserState = (state) => state.global.user;
export const getUserProfile = (state) => state.global.userProfile;
export const getWalletConnected = (state) => state.global.connected;
export const getSignInfo = (state) => state.global.signInfo;

/// auction
export const getActiveAuctionId = (state) => state.auction.activeAuctionId;
export const getActiveAuction = (state) => state.auction.activeAuction;
export const getActiveBids = (state) => state.auction.bids;
export const getLastAuctionId = (state) => state.auction.lastAuctionId;
