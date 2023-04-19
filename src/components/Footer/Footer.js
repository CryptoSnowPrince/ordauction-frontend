import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return <div className="bg-white w-full fixed bottom-0">
        <div className="flex max-w-[1120px] mx-auto">
            <div className="flex mx-auto mt-auto mb-0 font-semibold text-[18px] pb-16 pt-8 text-black items-center justify-start">
                <Link to="/" className="my-2 mx-4 no-underline"> Twitter </Link>
                <a href="https://ordinals.com" target="_blank" className="my-2 mx-4 no-underline"> Ordscan </a>
            </div>
        </div>
    </div>
}

export default Footer;