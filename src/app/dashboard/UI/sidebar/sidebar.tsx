import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
        <div className="h-full w-64 bg-blue-100 text-grey p-5">
            <ul className="space-y-2">
                <li><Link href="/dashboard/add-user" className="block">Add User</Link></li>
                <li>
                  <a href="#" className="block">Download List</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
