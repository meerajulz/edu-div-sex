import React from 'react';
import Header from './UI/header/Header';
import Sidebar from './UI/sidebar/sidebar';

interface LayoutProps {
    children: React.ReactNode;
    userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userName }) => {
    return (
        <div className="flex flex-col h-screen">
            <Header userName={userName} />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
