import React, { useState } from 'react';
import { Search, Plus, Minus, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { mockOrganizations } from '../../data/mockData';
import { Organization } from '../../types';

const LicensesPage: React.FC = () => {
  const { authState } = useAuth();
  const [search, setSearch] = useState('');


  const [licenseChanges, setLicenseChanges] = useState<{
    [orgId: string]: {
      [moduleId: string]: number;
    };
  }>({});


  const filteredOrganizations = mockOrganizations
    .filter(
      (org) =>
        org.type === 'customer' &&
        org.serviceProviderId === authState.organization?.id
    )
    .filter(
      (org) =>
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.adminContact.email.toLowerCase().includes(search.toLowerCase())
    );

  const adjustLicense = (orgId: string, moduleId: string, amount: number) => {
    setLicenseChanges((prev) => {
      const orgChanges = prev[orgId] || {};
      const currentChange = orgChanges[moduleId] || 0;

   
      const org = mockOrganizations.find((o) => o.id === orgId);
      const moduleData = org?.licenses.modules[moduleId];
      const moduleTotal = moduleData?.total || 0;
      const moduleUsed = moduleData?.used || 0;

     
      if (moduleTotal + currentChange + amount < moduleUsed) {
        return prev;
      }

      return {
        ...prev,
        [orgId]: {
          ...orgChanges,
          [moduleId]: currentChange + amount,
        },
      };
    });
  };


  const hasChanges = Object.keys(licenseChanges).length > 0;

 
  const getModuleChange = (orgId: string, moduleId: string): number => {
    return licenseChanges[orgId]?.[moduleId] || 0;
  };

 
  const resetChanges = () => {
    setLicenseChanges({});
  };

  const saveChanges = () => {

    alert('License changes have been saved!');
    resetChanges();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and distribute licenses to your client organizations
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Client Licenses</CardTitle>
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
        <CardContent>
          {hasChanges && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
              <p className="text-sm text-blue-700">
                You have unsaved license changes. Save your changes to apply them.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={resetChanges}>
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Save size={14} />}
                  onClick={saveChanges}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {filteredOrganizations.map((org) => (
              <OrganizationLicenses
                key={org.id}
                organization={org}
                adjustLicense={adjustLicense}
                getModuleChange={getModuleChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface OrganizationLicensesProps {
  organization: Organization;
  adjustLicense: (orgId: string, moduleId: string, amount: number) => void;
  getModuleChange: (orgId: string, moduleId: string) => number;
}

const OrganizationLicenses: React.FC<OrganizationLicensesProps> = ({
  organization,
  adjustLicense,
  getModuleChange,
}) => {
  const modules = Object.keys(organization.licenses.modules).map((key) => {
    const moduleData = organization.licenses.modules[key];
    const change = getModuleChange(organization.id, key);
    const newTotal = moduleData.total + change;

    let percentage = 0;
    if (newTotal > 0) {
      percentage = Math.min(100, Math.round((moduleData.used / newTotal) * 100));
    } else if (moduleData.used > 0) {
      percentage = 100;
    }

    return {
      id: key,
      name: key
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      total: moduleData.total,
      newTotal,
      used: moduleData.used,
      percentage,
      change,
    };
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          {organization.logoUrl ? (
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="h-8 w-8 rounded-md object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-medium">
                {organization.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">{organization.name}</h3>
            <p className="text-xs text-gray-500">{organization.adminContact.email}</p>
          </div>
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
            {organization.plan}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{module.name}</h4>
                <div className="flex space-x-1">
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={() => adjustLicense(organization.id, module.id, -1)}
                    disabled={module.newTotal <= module.used} 
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={() => adjustLicense(organization.id, module.id, 1)}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {module.used} of {module.newTotal} used
                </span>
                {module.change !== 0 && (
                  <span className={`font-medium ${module.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {module.change > 0 ? '+' : ''}{module.change}
                  </span>
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    module.percentage > 90
                      ? 'bg-red-600'
                      : module.percentage > 70
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${module.percentage}%`, maxWidth: '100%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LicensesPage;