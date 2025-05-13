import React from 'react';
import { Outlet } from 'react-router-dom';
import ServiceSidebar from '../../components/service/ServiceSidebar';

const ServicePage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ServiceSidebar />
      
      <div className="flex-1 p-6 lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default ServicePage;