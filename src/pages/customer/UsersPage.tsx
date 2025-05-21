import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

const AddUserForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { authState } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [modules, setModules] = useState<Record<string, boolean>>({
    'meeting-assistant': false,
    'email-assistant': false,
    'document-assistant': false
  });
  
  const handleModuleChange = (moduleId: string) => {
    setModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
   
    alert(`User added: ${firstName} ${lastName} (${email})`);
    onClose();
  };
  

  const availableLicenses: Record<string, { available: number, total: number }> = {};
  
  if (authState.organization) {
    Object.entries(authState.organization.licenses.modules).forEach(([moduleId, data]) => {
      availableLicenses[moduleId] = {
        available: data.total - data.used,
        total: data.total
      };
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              
              <Input
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Licenses
              </label>
              <div className="border border-gray-300 rounded-md p-3 space-y-3">
                {Object.keys(modules).map(moduleId => {
                  const isDisabled = !availableLicenses[moduleId] || availableLicenses[moduleId].available === 0;
                  const moduleName = moduleId
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                    <div key={moduleId} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id={`module-${moduleId}`}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={modules[moduleId]}
                          onChange={() => handleModuleChange(moduleId)}
                          disabled={isDisabled && !modules[moduleId]}
                        />
                        <label htmlFor={`module-${moduleId}`} className="ml-2 block text-sm text-gray-900">
                          {moduleName}
                        </label>
                      </div>
                      <div className="text-xs text-gray-500">
                        {availableLicenses[moduleId] ? (
                          <span>
                            {availableLicenses[moduleId].available} of {availableLicenses[moduleId].total} available
                          </span>
                        ) : (
                          <span>No licenses</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
          ${user.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'}`
        }>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {(user.modules ?? []).map(module => {
            const moduleName = module
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
              
            return (
              <span 
                key={module} 
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800"
              >
                {moduleName}
              </span>
            );
          })}
        </div>
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
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit licenses
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

const CustomerUsersPage: React.FC = () => {
  const { authState } = useAuth();
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
 
  const filteredUsers = mockUsers
    .filter(user => user.organizationId === authState.organization?.id)
    .filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  
  const isAdmin = authState.user?.role === 'admin';

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
            leftIcon={<Plus size={16} />}
            onClick={() => setShowAddForm(true)}
            disabled={!isAdmin}
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
              id="search"
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
                    Licenses
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
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total licenses</p>
                <p className="text-2xl font-semibold text-gray-900">{authState.organization?.licenses.total || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Used licenses</p>
                <p className="text-2xl font-semibold text-gray-900">{authState.organization?.licenses.used || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-green-600">
                  {authState.organization 
                    ? authState.organization.licenses.total - authState.organization.licenses.used 
                    : 0}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Usage</span>
                <span className="text-sm font-medium text-gray-700">
                  {authState.organization ? 
                    Math.round((authState.organization.licenses.used / authState.organization.licenses.total) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: authState.organization ? 
                      `${(authState.organization.licenses.used / authState.organization.licenses.total) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Module Licenses</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {authState.organization && Object.entries(authState.organization.licenses.modules).map(([moduleId, data]) => {
                const percentage = Math.round((data.used / data.total) * 100);
                const moduleName = moduleId
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                  
                return (
                  <div 
                    key={moduleId} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{moduleName}</h4>
                      <span className={`text-xs font-medium ${
                        percentage > 90 ? 'text-red-600' : 
                        percentage > 70 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {data.used} of {data.total} used
                      </span>
                      <span className="text-gray-500">
                        {data.total - data.used} available
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          percentage > 90 ? 'bg-red-600' : 
                          percentage > 70 ? 'bg-yellow-500' : 
                          'bg-green-600'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showAddForm && <AddUserForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
};

export default CustomerUsersPage;