import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../../components/customer/CustomerSidebar';

const CustomerPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />
      
      <div className="flex-1 p-6 lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerPage;