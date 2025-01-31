import React from 'react';
import RootLayout from '../layout';
import AnimatedSky from '../components/AnimatedSky/page';
import BirdAnimation from '../components/BirdAnimation/page';
import BirdsFlying from '../components/BirdsFlying/page';
import BirdsSoaring from '../components/BirdsSoaring/page';
import OrbitalCarousel from '../components/OrbitalCarousel/page';
import FloatingMenu from '../components/FloatingMenu/page';



const Dashboard: React.FC = () => {
    return (
        <RootLayout>
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-0">
                <AnimatedSky />
            </div>
            <div className="absolute top-0 right-0  z-50 flex">
                 <FloatingMenu />
            </div>
            <div className="absolute top-20 left-0 right-0 z-50 flex justify-center">
                <OrbitalCarousel />
            </div>
            <div className="absolute inset-0 z-30">
                <BirdsFlying count={1} />
                <div className=" z-40"> <BirdsSoaring /></div>
               
            </div>
            <div className="fixed bottom-4 left-4 z-40">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-xl">4</span>
                </div>
            </div>
        </div>
    </RootLayout>
    );
};

export default Dashboard;
