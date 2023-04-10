import { Fragment, ussEffect, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { useDispatch, useSelector } from "react-redux";
import { validate } from "uuid";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import * as actions from "../../store/actions";
import * as selectors from "../../store/selectors";

import { axiosGet, axiosPost, setInscriberId, useShortAddress } from "../../utils/utils";
import { ALERT_ERROR, ALERT_SUCCESS, ALERT_WARN, MESSAGE_LOGIN, SUCCESS } from "../../utils/constants";

// import NotificationModal from "../Notification/NotificationModal";

import logoImg from "../../images/logo.png";
import closeImg from "../../images/close.svg";
import openerImg from "../../images/opener.svg";
import "./Header.css";
import useBitcoinWallet from "../../hooks/useBitcoinWallet";

setDefaultBreakpoints([
  {xs: 0},
  {l: 769},
  {xl: 1024}
]);

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { connect, disconnect, signMessage } = useBitcoinWallet();
    const connected = useSelector(selectors.getWalletConnected);
    const user = useSelector(selectors.getUserState);
    const userProfile = useSelector(selectors.getUserProfile);    
    const shortAddress = useShortAddress(user.address);

    const notifications = useSelector(selectors.getNotifications);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const sign = async () => {
        try{
          const res = await signMessage(MESSAGE_LOGIN);
          console.log(">>> signed message res=", res);
          dispatch(actions.setSignedMessage({signed: true, signedMessage: res.signedMessage}));
          // res.signedMessage, res.publicKey
        } catch(err) {
          console.log(">>> Wallet connect error:", err);
          if(err.code === 4001) {
            dispatch(actions.setAlertMessage({type: ALERT_ERROR, message: err.message}));
            dispatch(actions.setUserInfo({address: "", publicKey: ""}));
            dispatch(actions.setWalletConnected(false));
          }
        }
      }
      if(connected) {
        sign();
      }
    }, [connected])

    const onClickBell = (e) => {
      setIsOpen(true);
    }
    
    // const renderNotifications = () => {
    //   return (<div>
    //     {notifications.map((notification) => (
    //       <div>
    //         {notification.content} <a href={`${notification.link}`}>Link</a>
    //       </div>
    //     ))}
    //   </div>)
    // }

    const onClickUser = (e) => {
      console.log(">>> onClickUser");
    }

    const handleClearAll = async (e) => {
      e.preventDefault();
      /// removeNotify
      // const params = {
      //   uuid: inscriberId,
      //   removeAll: true
      // }
      // try {
      //   const res = await axiosPost("/users/removeNotify", params);
      //   if(res.success && res.data.status === SUCCESS) {
      //     console.log("Removed all notification successfully!");
      //     dispatch(actions.setAlertMessage({
      //       type: ALERT_SUCCESS,
      //       message: "Removed successfully!"
      //     }))
      //   }
      // } catch(err) {
      //   console.log("Remove Notify error: ", err);
      //   dispatch(actions.setAlertMessage({
      //     type: ALERT_ERROR,
      //     message: ""
      //   }))
      // }
    }
    const onClickConnect = async (e) => { 
      console.log(">>>>>>>>> onClickConnect <<<<<<<<<<< connected=", connected);
      e.preventDefault();
      if(!connected)
        await connect();
    }

    const onClickDisconnect = async (e) => {
      e.preventDefault();
      console.log(">>>>>>>> onClickDisconnect <<<<<<<< connected=", connected);
      if(connected)
        await disconnect();
    }

    return (
    <header id="myHeader" className="top-0 left-0 flex items-center w-full py-4 bg-white">
      <div className="flex items-center justify-end py-2 px-8 w-full">
        {/* <BreakpointProvider> */}
          <div className="flex items-center justify-between w-full">
            <div className="lgoo px-0">
              <img src={logoImg} alt="logo" width="56px"/>
            </div>
          </div>
          <div className="flex flex-row gap-6 text-xl justify-end">
            {connected && <div className="cursor-pointer hover:bg-[#0003] hover:rounded-3xl text-black flex items-center justify-center relative px-4">
              <i className="fa-brands fa-bitcoin"></i> <span className="pl-2 pb-1">{userProfile.btcBalance}</span>
            </div>}
            {/* <span className="cursor-pointer hover:bg-[#fff3] hover:rounded-3xl w-[32px] h-[32px] flex items-center justify-center"><i className="fab fa-twitter"/></span>
            <span className="cursor-pointer hover:bg-[#fff3] hover:rounded-3xl w-[32px] h-[32px] flex items-center justify-center"><i className="fab fa-discord"/></span> */}
            {/* <span className="cursor-pointer hover:bg-[#fff3] hover:rounded-3xl w-[32px] h-[32px] flex items-center justify-center"><i className="fa fa-wallet"/></span> */}
            <span className="cursor-pointer hover:bg-[#0003] hover:rounded-3xl w-[32px] h-[32px] text-black flex items-center justify-center relative" onClick={onClickBell}>
              {notifications && notifications.length > 0 && (<div className="notification-bell">{notifications.length}</div>)}
              <i className="fa fa-bell"/>
            </span>
            <span className="cursor-pointer hover:bg-[#0003] hover:rounded-3xl w-[32px] h-[32px] text-black flex items-center justify-center" onClick={onClickUser}><i className="fa fa-user"/></span>
            { connected ?
              <Popover className="relative">
                <Popover.Button>
                  <span
                    className="cursor-pointer hover:bg-[#0003] hover:rounded-3xl h-[32px] text-black flex items-center justify-center border rounded-full px-4 border-[#000]"
                  >
                    <i className="fa-solid fa-wallet"></i>
                    <span className="pl-2 pb-1">{shortAddress}</span>
                    <ChevronDownIcon
                      className={`text-opacity-70 ml-2 h-5 w-5 text-black transition duration-150 ease-in-out group-hover:text-opacity-80`}
                      aria-hidden="true"
                    />
                  </span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-3 w-[350px] max-w-sm transform px-4 sm:px-0 lg:max-w-3xl">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="bg-gray-50 p-2">
                        <div
                          className="flow-root cursor-pointer rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Wallet Account
                            </span>
                          </span>
                          <span className="block text-sm text-gray-500">
                            {userProfile.btcAccount}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2">
                        <div
                          className="flow-root cursor-pointer rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Wallet Balance
                            </span>
                          </span>
                          <span className="block text-sm text-gray-500">
                            {userProfile.btcBalance}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2" onClick={onClickDisconnect}>
                        <div
                          className="flow-root cursor-pointer rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="flex items-center">
                            <i className="fa-solid fa-right-from-bracket text-black"></i>
                            <span className="text-sm font-medium text-gray-900 pl-2">
                              Disconnect
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
              :
              <span
                className="cursor-pointer hover:bg-[#0003] hover:rounded-3xl h-[32px] text-black flex items-center justify-center border rounded-full px-4 border-[#000]"
                onClick={onClickConnect}
              >
                <i className="fa-solid fa-wallet"></i><span className="pl-2 pb-1">{"Connect"}</span>
              </span>
            }
            {/* <Breakpoint l down>
              <Popover>
                <Popover.Button>
                  <span className="cursor-pointer hover:bg-[#fff3] hover:rounded-3xl w-[32px] h-[32px] flex items-center justify-center"><i className="fa-solid fa-bars"></i></span>
                </Popover.Button>
              </Popover>
            </Breakpoint> */}
          </div>
        {/* </BreakpointProvider> */}
      </div>
      {isOpen && 
      <div className="relative z-10">
          <div className="w-full h-full bg-[#00000099] fixed left-0 top-0" onClick={() => setIsOpen(false)}>
            <div className="w-[320px] h-full bg-[#5ec1f3] absolute right-0 p-6 flex flex-col notification-container">
              <div className="flex flex-row justify-between"><span className="font-semibold text-2xl text-[#04313e]">Notifications</span><i className="fa fa-times my-auto text-[#04313e] hover:text-[#fff]" onClick={() => setIsOpen(false)}></i></div>
              <div className="pt-3 border-b border-[#3b98c7] mx-[-1.5rem]"></div>
              <div className="pt-4 flex flex-col gap-4"> 
                {notifications.map((notification, index) => (
                  <div className="rounded-md p-3 bg-[#3b98c787] hover:text-white text-[#04313e]" key={index}>
                    <a href={`${notification.link}`} target="_blank">
                    {notification.content}
                    </a>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 pb-6 pt-2 w-full text-center border-t border-[#5ec1f3] mx-[-1.5rem]">
                <button className="mx-auto bg-[#5ec1f3] hover:bg-[#2c7fa9] p-3 rounded-md text-[#04313e]" onClick={handleClearAll} > Clear All</button>
              </div>
            </div>
          </div>
      </div>}
    </header>
    )
}

export default Header;