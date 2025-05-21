import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { mockOrganizations, mockUsers } from '../../data/mockData';
import { Organization } from '../../types';

const OrganizationRow: React.FC<{ organization: Organization }> = ({ organization }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  

  const orgUsers = mockUsers.filter(user => user.organizationId === organization.id);
  

  const licensePercentage = Math.round((organization.licenses.used / organization.licenses.total) * 100);
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {organization.logoUrl ? (
            <img 
              src={organization.logoUrl} 
              alt={organization.name} 
              className="h-10 w-10 rounded-md object-cover" 
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-medium">
                {organization.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{organization.name}</div>
            <div className="text-sm text-gray-500">
              {organization.adminContact.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
          {organization.plan}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {orgUsers.length} users
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-24">
            <div 
              className={`h-2.5 rounded-full ${
                licensePercentage > 90 ? 'bg-red-600' : 
                licensePercentage > 70 ? 'bg-yellow-500' : 
                'bg-green-600'
              }`} 
              style={{ width: `${licensePercentage}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">
            {licensePercentage}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative flex items-center justify-end">
          <Link 
            to={`/service/organizations/${organization.id}`} 
            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
          >
            View
            <ArrowUpRight size={16} className="ml-1" />
          </Link>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
          
          {showDropdown && (
            <div 
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit organization
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Manage licenses
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Deactivate
              </a>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const OrganizationsPage: React.FC = () => {
  const { authState } = useAuth();
  const [search, setSearch] = useState('');
  
 
  const filteredOrganizations = mockOrganizations
    .filter(org => 
      org.type === 'customer' && 
      org.serviceProviderId === authState.organization?.id
    )
    .filter(org => 
      org.name.toLowerCase().includes(search.toLowerCase()) || 
      org.adminContact.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Organizations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client organizations and their Copilot access
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
          >
            Add Organization
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>All Organizations</CardTitle>
          <div className="w-full sm:w-64">
            <Input
              id="search"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <OrganizationRow key={org.id} organization={org} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No organizations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsPage;