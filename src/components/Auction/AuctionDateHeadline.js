import React from 'react';

import "./AuctionDateHeadline.css";

const AuctionDateHeadline = (props) => {
    const { startTime } = props;
    const _date = new Date(startTime);
    const _year = _date.getFullYear();
    const _month = _date.getMonth() + 1;
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const _day = _date.getDate();
    const headLineStr = `${months[_month]} ${_day > 9 ? "":"0"}${_day}, ${_year}`;
    // console.log(">>>>AuctionDateHeadline: date=", _date, headLineStr);

    return(<div className="ml-0 sm:ml-20 w-auto">
        <h4 className="date text-[#2a7aa1]">
            {headLineStr}
        </h4>
    </div>)
}

export default AuctionDateHeadline;