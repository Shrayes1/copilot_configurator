import React, { useState } from 'react';
import { Save, Video, Mail, FileText, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { authState } = useAuth();
  const [orgName, setOrgName] = useState(authState.organization?.name || '');
  const [settings, setSettings] = useState(authState.organization?.settings || {
    autoRecordMeetings: false,
    emailTemplates: false,
    agendaTemplates: false,
    customBranding: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const isAdmin = authState.user?.role === 'admin';

  const handleSettingToggle = (setting: keyof typeof settings) => {
    if (!isAdmin) return;
    
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization settings and Copilot configuration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Organization Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Organization Settings
            </CardTitle>
            <SettingsIcon size={16} className="text-gray-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <form className="space-y-4">
              <div>
                <Input
                  label="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Plan
                </label>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {authState.organization?.plan || 'No Plan'} Plan
                  </span>
                  {isAdmin && (
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                      Upgrade
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization ID
                </label>
                <div className="flex items-center">
                  <code className="block w-full px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-md">
                    {authState.organization?.id || 'Not available'}
                  </code>
                </div>
              </div>
            </form>
          </CardContent>
          {isAdmin && (
            <CardFooter className="flex justify-end">
              <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
                {!isSaving && <Save size={16} className="mr-2" />}
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feature Configuration
            </CardTitle>
            <div className="text-xs text-gray-500">
              {isAdmin ? 'Toggle features' : 'View features'}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                    <Video size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto Meeting Recording</p>
                    <p className="text-xs text-gray-500">Automatically record all meetings</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.autoRecordMeetings}
                    onChange={() => handleSettingToggle('autoRecordMeetings')}
                    disabled={!isAdmin}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer ${settings.autoRecordMeetings ? 'after:translate-x-full after:border-white bg-green-600' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${!isAdmin ? 'opacity-60' : ''}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                    <Mail size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Templates</p>
                    <p className="text-xs text-gray-500">Custom email templates for follow-ups</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.emailTemplates}
                    onChange={() => handleSettingToggle('emailTemplates')}
                    disabled={!isAdmin}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer ${settings.emailTemplates ? 'after:translate-x-full after:border-white bg-green-600' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${!isAdmin ? 'opacity-60' : ''}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
                    <FileText size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Agenda Templates</p>
                    <p className="text-xs text-gray-500">Predefined meeting agendas</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.agendaTemplates}
                    onChange={() => handleSettingToggle('agendaTemplates')}
                    disabled={!isAdmin}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer ${settings.agendaTemplates ? 'after:translate-x-full after:border-white bg-green-600' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${!isAdmin ? 'opacity-60' : ''}`}></div>
                </label>
              </div>

              
            </div>
          </CardContent>
          {isAdmin && (
            <CardFooter className="flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Settings saved successfully
                  </span>
                )}
              </div>
              <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
                {!isSaving && <Save size={16} className="mr-2" />}
                Save Settings
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;