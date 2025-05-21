import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building2, 
  User, 
  ChevronRight, 
  KeyRound, 
  Phone, 
  Mail,  

} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockOrganizations, mockUsers } from '../../data/mockData';

const OrganizationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandUsers, setExpandUsers] = useState(false);
  
 
  const organization = mockOrganizations.find(org => org.id === id);
  

  const orgUsers = mockUsers.filter(user => user.organizationId === id);
  

  const adminUsers = orgUsers.filter(user => user.role === 'admin');
  
  if (!organization) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">Organization not found</h1>
        <p className="mt-2 text-gray-600">
          The organization you are looking for does not exist or you don't have permission to view it.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }


  const modules = Object.keys(organization.licenses.modules).map(key => {
    const moduleData = organization.licenses.modules[key];
    return {
      id: key,
      name: key
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      total: moduleData.total,
      used: moduleData.used,
      percentage: Math.round((moduleData.used / moduleData.total) * 100) || 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          {organization.logoUrl ? (
            <img 
              src={organization.logoUrl} 
              alt={organization.name} 
              className="h-12 w-12 rounded-md object-cover" 
            />
          ) : (
            <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
              <Building2 size={24} className="text-blue-800" />
            </div>
          )}
          <div className="ml-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                {organization.plan}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(organization.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 space-x-2">
          <Button
            variant="outline"
          >
            Edit Organization
          </Button>
          <Button
            variant="primary"
          >
            Contact Admin
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User size={18} className="mr-2 text-blue-600" />
              Admin Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Primary Admin Contact</h3>
                <div className="mt-2 flex items-start space-x-3">
                  {adminUsers[0]?.avatar ? (
                    <img 
                      src={adminUsers[0]?.avatar} 
                      alt={adminUsers[0]?.name} 
                      className="h-10 w-10 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 font-medium">
                        {organization.adminContact.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-base font-medium text-gray-900">{organization.adminContact.name}</p>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <Mail size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{organization.adminContact.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{organization.adminContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {adminUsers.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Additional Admins</h3>
                  <div className="mt-2 space-y-3">
                    {adminUsers.slice(1).map(admin => (
                      <div key={admin.id} className="flex items-start space-x-3">
                        {admin.avatar ? (
                          <img 
                            src={admin.avatar} 
                            alt={admin.name} 
                            className="h-8 w-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium text-xs">
                              {admin.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                          <div className="flex items-center mt-0.5">
                            <Mail size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{admin.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Organization Details</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Plan Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{organization.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Meeting Recording</p>
                    <p className="text-sm font-medium text-gray-900">
                      {organization.settings.autoRecordMeetings ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Templates</p>
                    <p className="text-sm font-medium text-gray-900">
                      {organization.settings.emailTemplates && organization.settings.agendaTemplates 
                        ? 'Email & Agenda' 
                        : organization.settings.emailTemplates 
                          ? 'Email Only' 
                          : organization.settings.agendaTemplates 
                            ? 'Agenda Only' 
                            : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* User Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <KeyRound size={18} className="mr-2 text-blue-600" />
              User Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandUsers(!expandUsers)}
            >
              {expandUsers ? 'Collapse' : 'View All'}
              <ChevronRight size={16} className={`ml-1 transform transition-transform ${expandUsers ? 'rotate-90' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Active Users ({orgUsers.length})
              </h3>
              
            </div>
            
            <div className="space-y-4">
              {/* User list */}
              <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
                <ul className="divide-y divide-gray-200">
                  {(expandUsers ? orgUsers : orgUsers.slice(0, 5)).map(user => (
                    <li key={user.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-8 w-8 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-medium text-xs">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {user.role === 'admin' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800 mr-2">
                              Admin
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {(user.modules ?? []).length} module{(user.modules ?? []).length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {!expandUsers && orgUsers.length > 5 && (
                <div className="text-center py-2">
                  <button 
                    onClick={() => setExpandUsers(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                  >
                    Show {orgUsers.length - 5} more users
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound size={18} className="mr-2 text-blue-600" />
            License Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">Total License Usage</h3>
              <p className="text-sm text-gray-500">
                {organization.licenses.used} of {organization.licenses.total} licenses in use
              </p>
            </div>
            
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className={`h-2.5 rounded-full ${
                Math.round((organization.licenses.used / organization.licenses.total) * 100) > 90 
                  ? 'bg-red-600' 
                  : Math.round((organization.licenses.used / organization.licenses.total) * 100) > 70 
                    ? 'bg-yellow-500' 
                    : 'bg-green-600'
              }`} 
              style={{ 
                width: `${Math.round((organization.licenses.used / organization.licenses.total) * 100)}%` 
              }}
            ></div>
          </div>
          
          <h3 className="text-base font-medium text-gray-900 mb-4">Module Licenses</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(module => (
              <div 
                key={module.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{module.name}</h4>
                  <div className="flex space-x-1">
                    
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {module.used} of {module.total} used
                  </span>
                  <span className={`font-medium ${
                    module.percentage > 90 ? 'text-red-600' : 
                    module.percentage > 70 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {module.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full ${
                      module.percentage > 90 ? 'bg-red-600' : 
                      module.percentage > 70 ? 'bg-yellow-500' : 
                      'bg-green-600'
                    }`} 
                    style={{ width: `${module.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDetailPage;