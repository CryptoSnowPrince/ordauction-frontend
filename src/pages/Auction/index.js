import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ALERT_ERROR, SUCCESS } from '../../utils/constants';
import * as actions from "../../store/actions";
import * as selectors from "../../store/selectors";
import { axiosPost } from '../../utils/utils';

import tempImg from "../../images/nft/nft1.png";
import AuctionNavigation from '../../components/Auction/AuctionNavigation';
import AuctionDateHeadline from '../../components/Auction/AuctionDateHeadline';

import "./index.css";
import Bid from '../../components/Auction/Bid';

const Auction = (props) => {
    let params = useParams();
    const initialAuctionId = params.id;

    const dispatch = useDispatch();
    const activeAuctionId = useSelector(selectors.getActiveAuctionId);
    const activeAuction = useSelector(selectors.getActiveAuction);
    const lastAuctionId = useSelector(selectors.getLastAuctionId);

    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
              const params = {
                auctionID: initialAuctionId ?? -1
              }
              console.log(">>> /auction/getAuctionData, params=", params);
              const res = await axiosPost("/auction/getAuctionData", params);
              if(res.success && res.data.status === SUCCESS) {
                const _result = res.data.result;
                console.log(">>> auction/getAuctionData <<< res=", _result);
                const _auction = {
                  auctionId: _result.auctionID,
                  inscriptionId: _result.inscriptionID,
                  bidCounts: _result.bidCounts,
                  state: _result.state,
                  winnerOrdWallet: _result.winnerOrdWallet,
                  amount: _result.amount,
                  auctionStart: new Date(_result.startDate).getTime(),
                  auctionEnd: new Date(_result.endDate).getTime()
                }
                // dispatch(actions.setLastAuctionInfo(_auction));
                dispatch(actions.setActiveAuctionId(_result.auctionID));
                dispatch(actions.setActiveAuction(_auction));
                dispatch(actions.setActiveBids(_result.bids));
              } else {
                dispatch(actions.setAlertMessage({
                  type: ALERT_ERROR,
                  message: res.data.message
                }))
              }
            } catch(err) {
              console.log("'fetchAuctionData=", err);
            }
          }
          fetchAuctionData();
    }, [initialAuctionId])

    const onPrevAuctionClick = () => {
    //     dispatch(setPrevOnDisplayAuctionNounId());
    // currentAuction && history.push(`/ord/${currentAuction.auctionID.toNumber() - 1}`);
    }

    const onNextAuctionClick = () => {

    }

    const onBidAmountChanged = async (bidAmount) => {

    }

    const onPlaceABid = async () => {
        
    }

    const isFirstAuction = activeAuctionId == 1;
    const isLastAuction = activeAuctionId == lastAuctionId
    const auctionEnd = new Date(activeAuction.endDate).getTime();
    const auctionEnded = auctionEnd < Date.now();

    const Winner = (winner) => {
        return (<div>{winner}</div>)
    }

    const Holder = (ordId) => {
        return (<div>{ordId}</div>)
    }

    const AuctionTimer = (auction) => {
        const [auctionTimer, setAuctionTimer] = useState(0);
        const auctionTimerRef = useRef(auctionTimer);
        auctionTimerRef.current = auctionTimer;

        const endTimeUnix = Math.floor((Date.now() - auctionEnd) / 1000);

        useEffect(() => {
            const timeLeft = auction && auction.auctionEnd - (Date.now() / 1000)
            setAuctionTimer(auction && timeLeft);
            if(auction && timeLeft <= 0) {
                setAuctionTimer(0);
            } else {
                const timer = setTimeout(() => {
                    setAuctionTimer(auctionTimerRef.current - 1);
                }, 1000);

                return () => {
                    clearTimeout(timer);
                }
            }
        }, [auction, auctionTimer])

        const auctionContentLong = auctionEnded ? (
            <span>Auction ended</span>
        ) : (
            <span>Auction ends in</span>
        );
        const auctionContentShort = auctionEnded ? (
            <span>Auction ended</span>
        ) : (
            <span>Time left</span>
        );

        return (<div className='flex flex-col'>
            <div className="px-0 justify-center pl-2 auction-info-text">
                <h4 className='text-[#2a7aa1]'>{window.innerWidth < 992 ? auctionContentShort : auctionContentLong}</h4>
            </div>
            <div className="">
                <h2 className="mr-2 text-white auction-info">
                    01H:00M:10S
                </h2>
            </div>
        </div>)
    }

    return (<div className="Auction pb-4 min-h-[550px]">
        <div className="container flex flex-col md:flex-row justify-between">
            <div className="w-full">
                <div className="image-wrapper p-4">
                    <img src={tempImg} className="ml-auto mt-auto" alt={activeAuctionId} width="90%" height="90%" />
                    {/* <img src={activeAuction.imageUrl} alt={activeAuctionId} width="450px" height="450px" /> */}
                </div>
            </div>
            <div className="w-full p-4 flex flex-col">
                <div className="flex flex-row">
                    <AuctionNavigation
                        isFirstAuction={isFirstAuction}
                        isLastAuction={isLastAuction}
                        onNextAuctionClick={onNextAuctionClick}
                        onPrevAuctionClick={onPrevAuctionClick}
                    />
                    <AuctionDateHeadline startTime={activeAuction.auctionStart} />
                </div>
                <div className="flex flex-row ord-item-title">
                    Ord {activeAuctionId}
                </div>
                <div className="grid grid-cols-3">
                    <div className='flex flex-col mr-2 border-r'>
                        <div className="px-0 justify-center pl-2 bid-amount-text">
                            <h4 className='text-[#2a7aa1]'>{auctionEnded ? "Winning bid" : "Current bid"}</h4>
                        </div>
                        <div className="">
                            <h2 className="mr-2 text-white bid-amount">
                                <i className='fa-brands fa-bitcoin'></i> {activeAuction.amount}
                            </h2>
                        </div>
                    </div>
                    <div className='col-span-2 ml-2'>
                        {auctionEnded ? (
                            isLastAuction ? (
                                <Winner winner={activeAuction.winnerOrdWallet} />
                            ) : (
                                <Holder ordId={lastAuctionId} />
                            )
                        ):(
                            <AuctionTimer auction={activeAuction}/>
                        )}
                    </div>
                </div>
                <div className='flex flex-col md:flex-row mt-6'>
                    <input type="number" min={0} className="bid-amount-input" placeholder='0.01 or more' onChange={(e) => onBidAmountChanged(e.target.value)}/>
                    <button className="rounded-xl md:ml-3 mt-3 mx-auto md:mt-1 w-1/2 md:w-auto px-4 py-3 h-12 font-bold text-[19px] bg-gray-500 flex items-center justify-center" onClick={(e) => onPlaceABid()}>Place a bid</button>
                </div>
                <div className='flex mt-6'>
                    <Bid auction={activeAuction} auctionEnded={auctionEnded} />
                </div>
            </div>
        </div>
    </div>)
}

export default Auction;