import React from 'react';

import { 
  Users, 
  Building2, 
  BarChart3, 
  KeyRound, 
  ArrowUpRight,
  CalendarClock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockOrganizations } from '../../data/mockData';
import Button from '../../components/ui/Button';

const ServiceDashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { organization } = authState;
  
  // Get all managed organizations
  const managedOrganizations = mockOrganizations.filter(org => 
    org.type === 'customer' && org.serviceProviderId === organization?.id
  );
  
  // Get service provider users
  const providerUsers = mockUsers.filter(user => user.organizationId === organization?.id);
  
  // Get total customer users
  const customerUsers = mockUsers.filter(user => 
    managedOrganizations.some(org => org.id === user.organizationId)
  );
  
  // Calculate total licenses across all customers
  const totalLicenses = managedOrganizations.reduce(
    (acc, org) => acc + org.licenses.total, 0
  );
  
  const usedLicenses = managedOrganizations.reduce(
    (acc, org) => acc + org.licenses.used, 0
  );
  
  // Calculate license usage percentage
  const licensePercentage = Math.round((usedLicenses / totalLicenses) * 100) || 0;
  
  // License status color
  const getLicenseStatusColor = () => {
    if (licensePercentage > 90) return 'text-red-600';
    if (licensePercentage > 70) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Provider Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer organizations and Copilot services
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<Building2 size={16} />}
          >
            Add Organization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Organizations Card */}
        <Card className="transform transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-600">
                {managedOrganizations.length} total
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Organizations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Active customer organizations
            </p>
            
            <div className="mt-4">
              <Link 
                to="/service/organizations" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all organizations
                <ArrowUpRight size={16} className="ml-1" />
              </Link>
              
            </div>
          </CardContent>
        </Card>
        
        {/* License Status Card */}
        <Card className="transform transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <KeyRound size={24} className="text-blue-600" />
              </div>
              <span className={`text-sm font-medium ${getLicenseStatusColor()}`}>
                {licensePercentage}% used
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">License Usage</h3>
            <p className="mt-1 text-sm text-gray-500">
              {usedLicenses} of {totalLicenses} licenses in use
            </p>
            
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  licensePercentage > 90 ? 'bg-red-600' : 
                  licensePercentage > 70 ? 'bg-yellow-500' : 
                  'bg-green-600'
                }`} 
                style={{ width: `${licensePercentage}%` }}
              ></div>
            </div>
            
            <div className="mt-4">
  <Link 
    to="/service/licenses" 
    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    Manage licenses
    <ArrowUpRight size={16} className="ml-1" />
  </Link>
</div>
          </CardContent>
        </Card>
        
        
        
        {/* Analytics Card */}
        <Card className="transform transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-green-600" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Analytics</h3>
            <p className="mt-1 text-sm text-gray-500">
              Monthly active users across platforms
            </p>
            
            <div className="mt-4">
              <a 
                href="/service/analytics" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View analytics
                <ArrowUpRight size={16} className="ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent organizations */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Organizations</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Usage
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managedOrganizations.slice(0, 4).map(org => {
                    const orgUsers = mockUsers.filter(user => user.organizationId === org.id);
                    const licensePercent = Math.round((org.licenses.used / org.licenses.total) * 100);
                    
                    return (
                      <tr key={org.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {org.logoUrl ? (
                              <img 
                                src={org.logoUrl} 
                                alt={org.name} 
                                className="h-10 w-10 rounded-md object-cover" 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-800 font-medium">
                                  {org.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{org.name}</div>
                              <div className="text-sm text-gray-500">
                                {org.adminContact.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                            {org.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {orgUsers.length} users
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  licensePercent > 90 ? 'bg-red-600' : 
                                  licensePercent > 70 ? 'bg-yellow-500' : 
                                  'bg-green-600'
                                }`} 
                                style={{ width: `${licensePercent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">
                              {licensePercent}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href={`/service/organizations/${org.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarClock size={16} className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">Meeting scheduled</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={customerUsers[0]?.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                        <span className="text-sm text-gray-900">{customerUsers[0]?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {managedOrganizations[0]?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      10 minutes ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-900">User added</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={customerUsers[1]?.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                        <span className="text-sm text-gray-900">{customerUsers[1]?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {managedOrganizations[1]?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 hours ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <KeyRound size={16} className="text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-900">Licenses updated</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={providerUsers[0]?.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                        <span className="text-sm text-gray-900">{providerUsers[0]?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {managedOrganizations[2]?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1 day ago
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDashboardPage;