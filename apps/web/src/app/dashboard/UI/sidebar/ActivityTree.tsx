'use client'

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

const ActivityTree: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="text-pink-600 font-medium text-sm uppercase block mb-2">
        Actividades Educativas
      </div>
      
      <div className="space-y-1">
        <Link
          href="/home"
          className="flex items-center w-full text-left text-gray-600 hover:text-pink-600 text-sm py-2 px-2 rounded hover:bg-pink-50 transition-colors"
        >
          <Home className="h-4 w-4 mr-2 flex-shrink-0 text-pink-500" />
          <span>Ir a Página Principal</span>
        </Link>
      </div>
    </div>
  );
};

export default ActivityTree;