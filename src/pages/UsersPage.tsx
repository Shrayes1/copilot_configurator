import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, UserPlus } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { User } from '../types';

const UserRow: React.FC<{ user: User; currentUser: User | null }> = ({ user, currentUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.avatar ? (
            <img 
              className="h-10 w-10 rounded-full object-cover"
              src={user.avatar}
              alt={user.name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-medium">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium
            ${user.role === 'cognicor_admin' || user.role === 'org_admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'}`
          }
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
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
                Edit user
              </a>
              {!isCurrentUser && (
                <>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Reset password
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Deactivate
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const UsersPage: React.FC = () => {
  const { authState } = useAuth();
  const [search, setSearch] = useState('');

  if (!authState.isAuthenticated || !authState.user || !authState.organization) {
    return <Navigate to="/login" replace />;
  }

 
  const filteredUsers = mockUsers
    .filter(user => authState.organization?.id && user.organizationId === authState.organization.id)
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users and their access to Copilot
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<UserPlus size={16} />}
          >
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Organization Users</CardTitle>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search users..."
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
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserRow key={user.id} user={user} currentUser={authState.user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>License Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total licenses</p>
                <p className="text-2xl font-semibold text-gray-900">{authState.organization.licenses.total}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Used licenses</p>
                <p className="text-2xl font-semibold text-gray-900">{authState.organization.licenses.used}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-green-600">
                  {authState.organization.licenses.total - authState.organization.licenses.used}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Usage</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((authState.organization.licenses.used / authState.organization.licenses.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${(authState.organization.licenses.used / authState.organization.licenses.total) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Plus size={16} className="mr-2" />
                Provide Additional Licenses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;