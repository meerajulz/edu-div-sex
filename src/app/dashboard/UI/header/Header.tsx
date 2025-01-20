import React from 'react';

interface HeaderProps {
    userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
    return (
        <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
            <img src="/logo.png" alt="Logo" className="h-8" /> {/* Adjust logo path as needed */}
            <span>{userName}</span>
        </div>
    );
};

export default Header;
