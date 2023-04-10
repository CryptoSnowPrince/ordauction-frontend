import React, { useState, useCallback, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer";

import Layout from "./pages/Layout";
import Inscribe from "./pages/Inscribe";
import Auction from "./pages/Auction";

import * as actions from "./store/actions";
import * as selectors from "./store/selectors";

import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { axiosGet, axiosPost, getInscriberId, getNewInscriberId, setInscriberId } from "./utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { ALERT_DELAY, ALERT_EMPTY, ALERT_ERROR, ALERT_POSITION, ALERT_REFETCH, ALERT_SUCCESS, ALERT_WARN, MESSAGE_LOGIN, SUCCESS } from "./utils/constants";


function App() {
  const dispatch = useDispatch();
  const alertMessage = useSelector(selectors.getAlertMessage);
  const user = useSelector(selectors.getUserState);
  const signInfo = useSelector(selectors.getSignInfo);
  
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    const timerID = setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      })
    }, ALERT_REFETCH);

    return () => {
      clearInterval(timerID);
    };
  }, [])

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     if(inscriberId) {
  //       try {
  //         const res = await axiosGet(`/users/getNotify?uuid=${inscriberId}`);
  //         if(res.data.status === SUCCESS) {
  //           dispatch(actions.setNotifications(res.data.result));
  //         }
  //       } catch (err) {
  //         console.log("error:", err);
  //       }
  //     }
  //   }
  //   fetchNotifications();
  // }, [refetch, dispatch, inscriberId]);

  useEffect(() => {
    console.log(">>>>>> fetchUserInfo signInfo=", signInfo)
    const fetchUserInfo = async () => {
      try {
        const params = {
          ordWallet: user.address,
          actionDate: Date.now(),
          plainText: MESSAGE_LOGIN,
          publicKey: user.publicKey,
          signData: signInfo.signedMessage
        }
        console.log(">>>>>>>>> api/users/setUserInfo params=", params);
        const res = await axiosPost("/users/setUserInfo", params);
        console.log(">>>[result]<<< res=", res);
        if(res.success && res.data.status === SUCCESS) {
        //   result: {
        //     ordWallet: ordWallet,
        //     btcAccount: fetchItem.btcAccount,
        //     btcBalance: balance
        // }, status: SUCCESS, message: "Create Success"
          const _userProfile = res.data.result;
          console.log(">>> userProfile =", _userProfile);
          dispatch(actions.setUserProfile({
            btcAccount: _userProfile.btcAccount,
            btcBalance: _userProfile.btcBalance,
          }))
          
        } else {
          dispatch(actions.setAlertMessage({
            type: ALERT_WARN,
            message: "Load user info failed"
          }));
        }
      } catch(err) {
        console.log(">>> fetchUserInfo error=", err);
        dispatch(actions.setAlertMessage({
          type: ALERT_ERROR,
          message: `Something went wrong! errCode: ${err}`
      }));
      }
    }
    if(signInfo.signed) {
      fetchUserInfo();
    }
  }, [signInfo]);

  useEffect(() => {
    const fetchAuctioinData = async () => {
      try {
        const params = {
          auctionID: -1
        }
        const res = await axiosPost("/auction/getAuctionData", params);
        if(res.success && res.data.status === SUCCESS) {
          const _result = res.data.result;
          console.log(">>> 1----auction/getAuctionData <<< res=", _result);
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
          dispatch(actions.setLastAuctionId(_result.auctionID));
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
  }, [])


  const handleClose = useCallback(() => {
    dispatch(actions.setAlertMessage({ type: ALERT_EMPTY, message: ""}));
  }, [dispatch])

  const notifySuccess = useCallback(() => {
    toast.success(alertMessage.message, {
      position: ALERT_POSITION,
      delay: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: "alert-message-success",
    });
  }, [alertMessage.message, handleClose]);

  const notifyError = useCallback(() => {
    toast.error(alertMessage.message, {
      position: ALERT_POSITION,
      delay: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: "alert-message-error",
    })
  }, [alertMessage.message, handleClose]);

  const notifyWarn = useCallback(() => {
    toast.warn(alertMessage.message, {
      position: ALERT_POSITION,
      delay: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: "alert-message-warn",
    })
  }, [alertMessage.message, handleClose]);

  useEffect(() => {
    switch(alertMessage.type) {
      case ALERT_ERROR:
        notifyError();
        return;
      case ALERT_SUCCESS:
        notifySuccess();
        return;
      case ALERT_WARN:
        notifyWarn();
        return;
      case ALERT_EMPTY:
        return;
      default:
        handleClose();
        return;
    }
  }, [alertMessage, notifyError, notifySuccess, notifyWarn, handleClose]);

  return (
    <>
      <Header />
      <Layout>
        <Routes>
          <Route path="/admin" element={<Inscribe />}></Route>
          <Route path="/" element={<Auction />}></Route>
          <Route path="/ord/:id" element={<Auction />} />
        </Routes>
      </Layout>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
