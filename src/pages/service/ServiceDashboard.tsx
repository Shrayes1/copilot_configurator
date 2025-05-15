import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  BarChart3, 
  KeyRound,  
  ArrowUpRight,
  CalendarClock,
  Check
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockOrganizations, Organization } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

// Define the FormData interface
interface FormData {
  adminName: string;
  adminEmail: string;
  organizationName: string;
  organizationId: string;
  plan: 'basic' | 'professional' | 'growth';
  totalLicenses: number;
  enabledModules?: string[];
}

interface AddOrganizationFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const AddOrganizationForm: React.FC<AddOrganizationFormProps> = ({ onSubmit, onCancel }) => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    adminName: '',
    adminEmail: '',
    organizationName: '',
    organizationId: '',
    plan: 'basic',
    totalLicenses: 0,
  });
  const [modules, setModules] = useState<Record<string, boolean>>({
    'meeting-assistant': false,
    'email-assistant': false,
    'document-assistant': false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalLicenses' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleModuleChange = (moduleId: string) => {
    setModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    const enabledModules = Object.keys(modules).filter((moduleId) => modules[moduleId]);
    onSubmit({
      ...formData,
      enabledModules,
    });
  };

  const availableLicenses: Record<string, { available: number; total: number }> = {};
  if (authState.organization?.licenses?.modules) {
    Object.entries(authState.organization.licenses.modules).forEach(([moduleId, data]) => {
      availableLicenses[moduleId] = {
        available: data.total - data.used,
        total: data.total,
      };
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="organizationId"
          name="organizationId"
          label="Organization ID"
          value={formData.organizationId}
          onChange={handleInputChange}
          required
        />
        <Input
          id="organizationName"
          name="organizationName"
          label="Organization Name"
          value={formData.organizationName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="adminName"
          name="adminName"
          label="Admin Name"
          value={formData.adminName}
          onChange={handleInputChange}
          required
        />
        <Input
          id="adminEmail"
          name="adminEmail"
          label="Admin Email"
          type="email"
          value={formData.adminEmail}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
          Plan
        </label>
        <select
          id="plan"
          name="plan"
          value={formData.plan}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="basic">Basic</option>
          <option value="growth">Growth</option>
          <option value="professional">Professional</option>
        </select>
      </div>
      <Input
        id="totalLicenses"
        name="totalLicenses"
        label="Total Licenses"
        type="number"
        value={formData.totalLicenses.toString()}
        onChange={handleInputChange}
        required
        min="0"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enable Modules
        </label>
        <div className="border border-gray-300 rounded-md p-3 space-y-3">
          {Object.keys(modules).map((moduleId) => {
            const isDisabled = !availableLicenses[moduleId] || availableLicenses[moduleId].available < formData.totalLicenses;
            const moduleName = moduleId
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

const ServiceDashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { organization } = authState;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const managedOrganizations = organizations.filter(
    (org) => org.type === 'customer' && org.serviceProviderId === organization?.id
  );
  
  const providerUsers = mockUsers.filter((user) => user.organizationId === organization?.id);
  
  const customerUsers = mockUsers.filter((user) =>
    managedOrganizations.some((org) => org.id === user.organizationId)
  );
  
  const totalLicenses = managedOrganizations.reduce(
    (acc, org) => acc + org.licenses.total,
    0
  );
  
  const usedLicenses = managedOrganizations.reduce(
    (acc, org) => acc + org.licenses.used,
    0
  );
  
  const licensePercentage = totalLicenses > 0 ? Math.round((usedLicenses / totalLicenses) * 100) : 0;
  
  const getLicenseStatusColor = () => {
    if (licensePercentage > 90) return 'text-red-600';
    if (licensePercentage > 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleAddOrganization = async (formData: FormData) => {
    try {
      console.log('Form data submitted:', formData);
  
      // Step 1: Create the organization and admin user
      const createOrgResponse = await fetch('https://light-nights-sort.loca.lt/create_org', {
        method: 'POST',
        headers: {
          'bypass-tunnel-reminder': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.organizationId,
          name: formData.adminName,
          email: formData.adminEmail,
          role: "admin",
          org_settings_id: formData.organizationId,
        }),
      });
  
      if (!createOrgResponse.ok) {
        const errorData = await createOrgResponse.json();
        console.error('create_org API error:', errorData);
        throw new Error(errorData.message || 'Failed to create organization');
      }
  
      const createOrgData = await createOrgResponse.json();
      console.log('create_org response:', createOrgData);
  
      if (createOrgData.msg !== 'Organization admin created. Send password creation link to email.') {
        throw new Error(createOrgData.msg || 'Unexpected response from server');
      }
  
      // Step 2: Get token and send password set email
      const token = createOrgData.pass_token;
      console.log('Token received:', token);
      console.log('Admin email:', formData.adminEmail);
      console.log('Organization ID:', formData.organizationId);
      console.log('Organization name:', formData.organizationName);
      if (!token) {
        throw new Error('No token received from create_org response');
      }
  
      const sendPasswordResponse = await fetch('https://light-nights-sort.loca.lt/send_password_set', {
        method: 'POST',
        headers: {
          'bypass-tunnel-reminder': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_email: formData.adminEmail,
          user_name: formData.organizationId,
          token: token,
        }),
      });
  
      if (!sendPasswordResponse.ok) {
        const errorData = await sendPasswordResponse.json();
        console.error('send_password_set API error:', errorData);
        throw new Error(errorData.message || 'Failed to send password creation email');
      }
  
      const sendPasswordData = await sendPasswordResponse.json();
      console.log('send_password_set response:', sendPasswordData);
  
      if (sendPasswordData.msg !== 'Password reset email sent') {
        throw new Error(sendPasswordData.msg || 'Unexpected response from password email endpoint');
      }
  
      // Step 3: Update local state
      const newOrganization: Organization = {
        id: formData.organizationId,
        name: formData.organizationName || formData.organizationId,
        type: 'customer',
        serviceProviderId: organization?.id || '',
        plan: formData.plan as 'basic' | 'professional' | 'growth',
        licenses: {
          total: formData.totalLicenses,
          used: 0,
          modules: {
            'meeting-assistant': {
              total: formData.enabledModules?.includes('meeting-assistant') ? formData.totalLicenses : 0,
              used: 0,
            },
            'email-assistant': {
              total: formData.enabledModules?.includes('email-assistant') ? formData.totalLicenses : 0,
              used: 0,
            },
            'document-assistant': {
              total: formData.enabledModules?.includes('document-assistant') ? formData.totalLicenses : 0,
              used: 0,
            },
          },
        },
        adminContact: {
          name: formData.adminName,
          email: formData.adminEmail,
          phone: '',
        },
        settings: {
          autoRecordMeetings: true,
          emailTemplates: true,
          agendaTemplates: true,
        },
        createdAt: new Date().toISOString(),
      };
  
      setOrganizations((prev) => [...prev, newOrganization]);
      setIsModalOpen(false);
      setSuccessMessage(`A link to set the password has been sent to ${formData.adminEmail}`);
  
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error in handleAddOrganization:', errorMessage);
      setSuccessMessage(`Failed to add organization: ${errorMessage}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
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
            onClick={() => setIsModalOpen(true)}
          >
            Add Organization
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <Link 
                to="/service/analytics" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View analytics
                <ArrowUpRight size={16} className="ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  {managedOrganizations.slice(0, 4).map((org) => {
                    const orgUsers = mockUsers.filter((user) => user.organizationId === org.id);
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
                                {org.adminContact?.email || 'No admin contact available'}
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
                          <Link 
                            to={`/service/organizations/${org.id}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
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
                  {managedOrganizations.length > 0 && customerUsers.length > 0 && providerUsers.length > 0 ? (
                    <>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarClock size={16} className="text-blue-500 mr-2" />
                            <span className="text-sm text-gray-900">Meeting scheduled</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {customerUsers[0]?.avatar ? (
                              <img src={customerUsers[0].avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gray-100 mr-2" />
                            )}
                            <span className="text-sm text-gray-900">
                              {customerUsers[0]?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {managedOrganizations[0]?.name || 'Unknown'}
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
                            {customerUsers[1]?.avatar ? (
                              <img src={customerUsers[1].avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gray-100 mr-2" />
                            )}
                            <span className="text-sm text-gray-900">
                              {customerUsers[1]?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {managedOrganizations[1]?.name || 'Unknown'}
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
                            {providerUsers[0]?.avatar ? (
                              <img src={providerUsers[0].avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gray-100 mr-2" />
                            )}
                            <span className="text-sm text-gray-900">
                              {providerUsers[0]?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {managedOrganizations[2]?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          1 day ago
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent activity available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Organization"
        size="lg"
      >
        <AddOrganizationForm
          onSubmit={handleAddOrganization}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ServiceDashboardPage;