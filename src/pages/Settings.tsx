import { useState } from 'react';
import { Settings as Bell, Globe, Clock, LayoutDashboard, Mic2, Volume2 } from 'lucide-react';
import RoleManagement from '../components/RoleManagement';
import DashboardCustomization from '../components/DashboardCustomization';
import { VoiceManagement } from '../components/admin/VoiceManagement';
import { VoiceTesting } from '../components/admin/VoiceTesting';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useUser } from '@/hooks/useUser';


const Settings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState({
    notifications: true,
    emailReports: false,
    language: 'en',
    timezone: 'UTC',
  });

  const [isDashboardCustomizationOpen, setIsDashboardCustomizationOpen] = useState(false);

  const handleSettingChange = (setting: string, value: any) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your application settings and preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Role Management */}
        <section aria-labelledby="role-management">
          <RoleManagement />
        </section>

        {/* Voice Management */}
        <section aria-labelledby="voice-management">
          <Accordion type="single" collapsible>
            <AccordionItem value="voice-settings">
              <AccordionTrigger className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Mic2 className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Voice Management
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage text-to-speech voices and settings
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-5 bg-white space-y-4">
                  {user?.schoolId ? (
                    <VoiceManagement 
                      schoolId={user.schoolId} 
                      userRole={user.role as 'SCHOOL_LEADER' | 'SCHOOL_PRINCIPAL'} 
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      You need to be associated with a school to manage voices.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voice-testing" className="mt-6">
              <AccordionTrigger className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Volume2 className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Voice Testing
                    </h3>
                    <p className="text-sm text-gray-500">
                      Test and preview available voices
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-5 bg-white space-y-4">
                  {user?.schoolId ? (
                    <VoiceTesting schoolId={user.schoolId} />
                  ) : (
                    <p className="text-sm text-gray-500">
                      You need to be associated with a school to test voices.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Dashboard Customization */}
        <section aria-labelledby="dashboard-customization">
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LayoutDashboard className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Dashboard Customization
                  </h3>
                  <p className="text-sm text-gray-500">
                    Customize your dashboard layout and widgets
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDashboardCustomizationOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Customize Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section aria-labelledby="notifications-settings">
          <Accordion type="single" collapsible>
            <AccordionItem value="notifications">
              <AccordionTrigger className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Bell className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage your notification preferences
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-5 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Push Notifications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive real-time updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) =>
                          handleSettingChange('notifications', e.target.checked)
                        }
                        className="sr-only peer"
                        aria-label="Enable push notifications"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Email Reports
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive weekly summary reports
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailReports}
                        onChange={(e) =>
                          handleSettingChange('emailReports', e.target.checked)
                        }
                        className="sr-only peer"
                        aria-label="Enable email reports"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Other Settings */}
        <section aria-labelledby="general-settings">
          <Accordion type="single" collapsible>
            <AccordionItem value="localization" className="mt-6">
              <AccordionTrigger className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Globe className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Localization
                    </h3>
                    <p className="text-sm text-gray-500">
                      Language and regional settings
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-5 bg-white space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="language-select"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      aria-label="Select language"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="timezone" className="mt-6">
              <AccordionTrigger className="bg-white px-4 py-5 shadow sm:rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Time Zone
                    </h3>
                    <p className="text-sm text-gray-500">
                      Configure your time zone settings
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-5 bg-white space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time Zone
                    </label>
                    <select
                      id="timezone-select"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      aria-label="Select timezone"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="CST">Central Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
      
      {isDashboardCustomizationOpen && (
        <DashboardCustomization onClose={() => setIsDashboardCustomizationOpen(false)} />
      )}
    </div>
  );
};

export default Settings;