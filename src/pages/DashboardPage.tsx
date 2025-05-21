import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { RocketIcon, UsersIcon } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '24',
    change: '+12% from last month',
    icon: <UsersIcon className="w-5 h-5 text-indigo-500" />,
  },
  {
    title: 'Active Licenses',
    value: '156',
    change: '98% utilization',
    icon: <RocketIcon className="w-5 h-5 text-purple-500" />,
  },
];

export default function DashboardPage() {
  const [orgData, setOrgData] = useState({
    organizationName: 'Initech', // Default fallback
    adminName: 'Emily Davis', // Default fallback
  });

  useEffect(() => {
    // Function to fetch organization data
    const fetchOrgData = async () => {
      try {
        const response = await fetch('https://19a7-14-143-149-238.ngrok-free.app/get_org', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            // Include authorization token if required
            // 'Authorization': `Bearer ${yourToken}`,
          },
        });
        const data = await response.json();
        setOrgData({
          organizationName: data.username || 'Initech', // Use username as org name
          adminName: data.name || 'Emily Davis', // Use name as admin name
        });
      } catch (error) {
        console.error('Error fetching org data:', error);
      }
    };

    fetchOrgData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Welcome back, {orgData.adminName}
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
              </div>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Organization Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Organization Overview</h2>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Organization Name</span>
            <span className="font-medium">{orgData.organizationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Organization Type</span>
            <span className="font-medium">Customer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
}