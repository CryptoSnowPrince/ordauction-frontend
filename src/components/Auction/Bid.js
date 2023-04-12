import React from 'react';
import { useSelector } from 'react-redux';
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { getBTCfromSats, getShortAddress } from '../../utils/utils';

import * as actions from "../../store/actions";
import * as selectors from "../../store/selectors";

const Bid = (props) => {
    const { bids } = props;
    // const activeBids = useSelector(selectors.getActiveBids);
    // console.log("Bid components");
    //     console.log("data image: ", activeBids)
    // const mockData = [
    //     {
    //         auctionId: 1,
    //         inscriptionId: "4644eb1d2894b81c1af25fff82382636e0fc4864336617ae97b51636c1cc786ci0", 
    //         ordWallet: "tb1q8zcn0ackfwq0jd7fjrxgc0k07x2sv3cf0lh4s6",
    //         bidNumber: 2,
    //         amount: 0.03,
    //         bidDate: 1681143403452
    //     },
    //     {
    //         auctionId: 1,
    //         inscriptionId: "4644eb1d2894b81c1af25fff82382636e0fc4864336617ae97b51636c1cc786ci0", 
    //         ordWallet: "tb1q8zcn0ackfwq0jd7fjrxgc0k07x2sv3cabcdefg",
    //         bidNumber: 1,
    //         amount: 0.01,
    //         bidDate: 1681143403452
    //     }
    // ]
    
    return <div className=' w-full'>
        <ul className="my-2">
        {bids && bids.map((item, key) => {
            return (<li className="pt-3 px-3 pb-2 border-b border-bottom-[#cfbdba] text-[0.95rem] no-underline" key={key}>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row'>
                        <Jazzicon diameter={32} seed={jsNumberForAddress(item.ordWallet)} />
                        <span className='text-black text-lg font-bold pl-2'>{getShortAddress(item.ordWallet, 8)}</span>
                    </div>
                    <div className='flex flex-row gap-3 text-black text-lg font-bold'>
                        <span><i className='fa-brands fa-bitcoin'></i><span className="pl-2">{getBTCfromSats(item.amount)}</span></span>
                        <span><i className='fa-solid fa-up-right-from-square'></i></span>
                    </div>
                </div>
            </li>)
        })}
        </ul>
    </div>
}

export default Bid;