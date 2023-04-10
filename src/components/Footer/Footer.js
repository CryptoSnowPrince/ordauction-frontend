import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return <div className="bg-white w-full">
        <div className="flex max-w-[1120px] mx-auto">
            <div className="flex mx-auto mt-auto mb-0 font-semibold text-[18px] pb-16 pt-8 text-black items-center justify-start">
                <Link to="/" className="my-2 mx-4 no-underline"> Twitter </Link>
                <Link to="/" className="my-2 mx-4 no-underline"> Etherscan </Link>
                <Link to="/" className="my-2 mx-4 no-underline"> Forums </Link>
            </div>
        </div>
    </div>
}

export default Footer;