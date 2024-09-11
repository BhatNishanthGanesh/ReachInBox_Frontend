'use client';

import React from 'react';
import BasicLayout from '../components/basicLayout';
import { useToken } from './tokenContext';

const Dashboard = () => {
  const { token } = useToken();
  console.log('Token in Dashboard:', token); 

  return (
    <div>
     <BasicLayout/>
    </div>
  );
};

export default Dashboard;
