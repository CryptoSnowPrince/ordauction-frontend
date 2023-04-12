import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { ALERT_ERROR, ALERT_SUCCESS, ALERT_WARN, MESSAGE_LOGIN, SUCCESS } from '../../utils/constants';
import * as actions from "../../store/actions";
import * as selectors from "../../store/selectors";
import { axiosPost, getBTCfromSats, getShortAddress } from '../../utils/utils';

import tempImg from "../../images/nft/nft1.png";
import AuctionNavigation from '../../components/Auction/AuctionNavigation';
import AuctionDateHeadline from '../../components/Auction/AuctionDateHeadline';

import "./index.css";
import Bid from '../../components/Auction/Bid';

const Auction = (props) => {
    let params = useParams();
    const initialAuctionId = params.id;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const connected = useSelector(selectors.getWalletConnected);
    const activeAuctionId = useSelector(selectors.getActiveAuctionId);
    const activeAuction = useSelector(selectors.getActiveAuction);
    const lastAuctionId = useSelector(selectors.getLastAuctionId);
    const activeBids = useSelector(selectors.getActiveBids);
    const user = useSelector(selectors.getUserState);
    const userProfile = useSelector(selectors.getUserProfile);
    const signInfo = useSelector(selectors.getSignInfo);

    const [bidAmount, setBidAmount] = useState(0);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    console.log("isLoading====", isLoading);

    useEffect(() => {
        if(initialAuctionId != activeAuctionId) {
            dispatch(actions.setActiveAuctionId(initialAuctionId));
        }
    }, []);

    useEffect(() => {
        const fetchAuctionData = async (_auctionID) => {
            try {
              const params = {
                auctionID: _auctionID ?? -1
              }
              console.log(">>> /auction/getAuctionData, params=", params);
              const res = await axiosPost("/auction/getAuctionData", params);
              console.log(">>> res=", res);
              if(res.success && res.data.status === SUCCESS) {
                const _result = res.data.result;
                console.log(">>> auction/getAuctionData <<< res=", _result);
                if(_result.length == 0) {
                    dispatch(actions.setActiveAuctionId(-1));
                    dispatch(actions.setActiveAuction({
                        auctionId: -1,
                        inscriptionId: "-",
                        bidCounts: 0,
                        state: 0,
                        winnerOrdWallet: "",
                        amount: 0,
                        auctionStart: Date.now(),
                        auctionEnd: Date.now()
                    }))
                    dispatch(actions.setActiveBids([]));
                    return;
                }
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
        setIsLoading(false);
        if(initialAuctionId && initialAuctionId != activeAuctionId) {
            navigate(`/ord/${activeAuctionId}`);
        } else if(initialAuctionId) {
            fetchAuctionData(initialAuctionId);
            // fetchAuctionData(activeAuctionId);
        }
    }, [initialAuctionId, activeAuctionId, reload])

    const onPrevAuctionClick = () => {
    //     dispatch(setPrevOnDisplayAuctionNounId());
    // currentAuction && history.push(`/ord/${currentAuction.auctionID.toNumber() - 1}`);
        console.log("onPrevAuctionClick");
        setIsLoading(true);
        dispatch(actions.setPrevAuctionId());
    }

    const onNextAuctionClick = () => {
        console.log("onNextAuctionClick");
        setIsLoading(true);
        dispatch(actions.setNextAuctionId());
    }

    const onBidAmountChanged = async (_bidAmount) => {
        /*
        {
            auctionId: 1,
            inscriptionId: "4644eb1d2894b81c1af25fff82382636e0fc4864336617ae97b51636c1cc786ci0", 
            ordWwallet: "tb1q8zcn0ackfwq0jd7fjrxgc0k07x2sv3cabcdefg",
            bidNumber: 1,
            amount: 0.01,
            bidDate: 1681143403452
        }
        */
        setBidAmount(_bidAmount * 100000000);
    }

    const onPlaceABid = async () => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>> Place A Bid <<<<<<<<<<<<<<<<<<<<<<<<<");
        if(activeAuctionId == -1) return;
        if(!connected) {
            dispatch(actions.setAlertMessage({
                type: ALERT_WARN,
                message: "Please connect your wallet to the website."
            }))
            return;
        }
        if(bidAmount == 0) {
            dispatch(actions.setAlertMessage({
                type: ALERT_WARN,
                message: `Place a bid amount.`
            }))
            return;
        }
        if(activeBids.length > 0 && parseFloat(activeBids[0].amount) >= parseFloat(bidAmount)) {
            dispatch(actions.setAlertMessage({
                type: ALERT_WARN,
                message: `You should place bigger than ${getBTCfromSats(activeBids[0].amount)} BTC. Please charge your balance to your account.`
            }))
            return;
        }
        // if(parseFloat(bidAmount) > parseFloat(userProfile.btcBalance)) {
        //     dispatch(actions.setAlertMessage({
        //         type: ALERT_WARN,
        //         message: "You should deposit the balance to the website."
        //     }))
        //     return;
        // }
        try {
            const params = {
                auctionID: activeAuctionId,
                ordWallet: user.address,
                amount: parseFloat(bidAmount),
                actionDate: Date.now(),
                plainText: MESSAGE_LOGIN,
                publicKey: user.publicKey,
                signData: signInfo.signedMessage
            }
            console.log("params=", params)
            const res = await axiosPost("/auction/bid", params);
            console.log(">>>>> api/auction/bid result <<<<< res=", res);
            if(res.success && res.data.status === SUCCESS) {
                dispatch(actions.setAlertMessage({
                    type: ALERT_SUCCESS,
                    message: "Successfully bid your place."
                }));
                setReload((prevState) => !prevState);
            } else {
                dispatch(actions.setAlertMessage({
                    type: ALERT_WARN,
                    message: "Placing a bid error occured."
                }));
            }
        } catch(err) {
            console.log("bid error");
        }
    }

    const isFirstAuction = activeAuctionId == 1;
    const isLastAuction = activeAuctionId == lastAuctionId
    const auctionEnd = activeAuction.auctionEnd
    const auctionEnded = activeAuction.auctionEnd < Date.now();
    
    const Winner = ({winner}) => {
        return (<div className='flex flex-col pb-2 sm:mr-2 border-b sm:border-b-0'>
            <div className="px-0 justify-center pl-2 bid-amount-text">
                <h4 className='text-[#2a7aa1]'>Held by</h4>
            </div>
            <div className="">
                <h2 className="mr-2 text-white bid-amount">
                    <Jazzicon diameter={32} seed={jsNumberForAddress(winner)} /> {isLoading ? "" : getShortAddress(winner)}
                </h2>
            </div>
        </div>)
    }

    const Holder = ({winner}) => {
        return (<div className='flex flex-col pb-2 sm:mr-2 border-b sm:border-b-0'>
            <div className="px-0 justify-center pl-2 bid-amount-text">
                <h4 className='text-[#2a7aa1]'>Held by</h4>
            </div>
            <div className="">
                <h2 className="mr-2 text-white bid-amount">
                <Jazzicon diameter={32} seed={jsNumberForAddress(winner)} /> {isLoading ? "" : getShortAddress(winner)}
                </h2>
            </div>
        </div>)
    }

    const AuctionTimer = ({auction}) => {
        const [auctionTimer, setAuctionTimer] = useState(0);
        const auctionTimerRef = useRef(auctionTimer);
        auctionTimerRef.current = auctionTimer;

        useEffect(() => {
            const timeLeft = auction && Math.floor((auction.auctionEnd - Date.now()) / 1000);
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

        const hours = Math.floor(auctionTimer / 3600);
        const minutes = Math.floor((auctionTimer % 3600)/60);
        const seconds = Math.floor(auctionTimer % 60);

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
                    {(isLoading || activeAuctionId != -1 && activeAuctionId != undefined) ? `${hours}h ${minutes}m ${seconds}s` : "--:--:--"}
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
                <div className="flex flex-col sm:flex-row">
                    <AuctionNavigation
                        isFirstAuction={isFirstAuction}
                        isLastAuction={isLastAuction}
                        onNextAuctionClick={onNextAuctionClick}
                        onPrevAuctionClick={onPrevAuctionClick}
                    />
                    <AuctionDateHeadline startTime={activeAuction.auctionStart} />
                </div>
                <div className="flex flex-row ord-item-title">
                    Ord {activeAuctionId != -1 && activeAuctionId != undefined ? activeAuctionId : "-"}
                </div>
                <div className="grid sm:grid-cols-3">
                    <div className='flex flex-col pb-2 sm:mr-2 border-b sm:border-r sm:border-b-0'>
                        <div className="px-0 justify-center pl-2 bid-amount-text">
                            <h4 className='text-[#2a7aa1]'>{auctionEnded ? "Winning bid" : "Current bid"}</h4>
                        </div>
                        <div className="">
                            <h2 className="mr-2 text-white bid-amount">
                                <i className='fa-brands fa-bitcoin'></i> {(isLoading || Number.isNaN(parseFloat(activeAuction.amount))) ? "-" : getBTCfromSats(activeAuction.amount)}
                            </h2>
                        </div>
                    </div>
                    <div className='pt-2 sm:pt-0 sm:col-span-2 sm:ml-2'>
                        {auctionEnded ? (
                            isLastAuction ? (
                                <Winner winner={activeAuction.winnerOrdWallet} />
                            ) : (
                                <Holder winner={activeAuction.winnerOrdWallet} />
                            )
                        ):(
                            <AuctionTimer auction={activeAuction}/>
                        )}
                    </div>
                </div>
                <div className='flex flex-col md:flex-row mt-6'>
                    <input type="number" min={0} className="bid-amount-input" placeholder='0.01 or more' onChange={(e) => onBidAmountChanged(e.target.value)}/>
                    <button className="rounded-xl md:ml-3 mt-3 mx-auto md:mt-1 w-1/2 md:w-auto px-4 py-3 h-12 font-bold text-sm sm:text-[19px] bg-gray-500 flex items-center justify-center" onClick={(e) => onPlaceABid()}>Place a bid</button>
                </div>
                <div className='flex mt-6'>
                    <Bid bids={activeBids} auction={activeAuction} auctionEnded={auctionEnded} />
                </div>
            </div>
        </div>
    </div>)
}

export default Auction;