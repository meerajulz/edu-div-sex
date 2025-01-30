import React from 'react';
import { CloudSVGProps } from './types';
import Nube1 from './svg/nube-1.svg';
import Nube2 from './svg/nube-2.svg';


export const CloudSVG: React.FC<CloudSVGProps> = ({ className, variant = 1 }) => {
  return (
    <img
      src={variant === 1 ? "/svg/nube-1.svg" : "/svg/nube-2.svg"}
      className={`w-48 h-auto opacity-90 ${className || ''}`}
      alt={`Cloud ${variant}`}
    />
  );
};
