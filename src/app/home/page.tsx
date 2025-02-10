import React from 'react';
import RootLayout from '../layout';
import AnimatedSky from '../components/AnimatedSky/page';
import BirdAnimation from '../components/BirdAnimation/page';
import BirdsFlying from '../components/BirdsFlying/page';
import BirdsSoaring from '../components/BirdsSoaring/page';
import OrbitalCarousel from '../components/OrbitalCarousel/page';
import FloatingMenu from '../components/FloatingMenu/page';
import WalkingAlex from '../components/WalkingAlex/page';
import RoomBackground from '../components/RoomBackground/page';
import AnimatedDoor from '../components/AnimatedDoor/page';

const Dashboard: React.FC = () => {
  return (
    <RootLayout>
      <div className='relative min-h-screen'>
        <div className="absolute inset-0 z-0">
          <BirdsFlying count={1} />
        </div>

        <div className='absolute inset-0 z-10'>
          <RoomBackground imagePath='/svg/background-home.svg' />
         
        </div>

        <div className='absolute top-0 left-0 right-0 z-50 flex justify-center'>
          <OrbitalCarousel />
        </div>

        <div className='absolute top-0 right-0  z-50 flex'>
          <FloatingMenu />
        </div>

        {/* <div className="absolute z-50">
                <WalkingAlex />
            </div> */}
        {/* <div className="fixed bottom-4 left-4 z-40">
                <div className="w-24 h-12 rounded-3 bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xl">footer </span>
                </div>
            </div> */}
      </div>
    </RootLayout>
  );
};

export default Dashboard;
