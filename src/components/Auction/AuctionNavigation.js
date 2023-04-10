import React from 'react';

import "./AuctionNavigation.css";

const AuctionNavigation = ({
    isFirstAuction,
    isLastAuction,
    onNextAuctionClick,
    onPrevAuctionClick
}) => {
    return (<div className="">
        <button
            onClick={() => onPrevAuctionClick()}
            className="leftArrowCool"
            disabled={isFirstAuction}
        >
            ←
        </button>
        <button
            onClick={() => onNextAuctionClick()}
            className="rightArrowCool"
            disabled={isLastAuction}
        >
            →
        </button>
    </div>)
}

export default AuctionNavigation;