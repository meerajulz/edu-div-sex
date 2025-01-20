import React from 'react';
import Layout from './layout';


const Dashboard: React.FC = () => {
    return (
        <Layout userName="John Doe">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Content Here</h1>
                {/* Dashboard specific content goes here */}
            </div>
        </Layout>
    );
};

export default Dashboard;
