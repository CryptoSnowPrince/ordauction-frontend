import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ALERT_ERROR, SUCCESS } from '../../utils/constants';
import * as actions from "../../store/actions";
import * as selectors from "../../store/selectors";
import { axiosPost } from '../../utils/utils';

const Auction = (props) => {
    let params = useParams();
    const initialAuctionId = params.id;

    const dispatch = useDispatch();

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
    
    return <div className="Auction pb-4">

    </div>
}

export default Auction;