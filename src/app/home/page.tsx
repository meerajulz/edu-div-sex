import React from 'react';
import RootLayout from '../layout';
import AnimatedSky from '../components/AnimatedSky/page';
import BirdAnimation from '../components/BirdAnimation/page';
import BirdsFlying from '../components/BirdsFlying/page';
import BirdsSoaring from '../components/BirdsSoaring/page';
import OrbitalCarousel from '../components/OrbitalCarousel/page';
import FloatingMenu from '../components/FloatingMenu/page';
import WalkingAlex from '../components/FullAlex/page';
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

      </div>
    </RootLayout>
  );
};

export default Dashboard;
