import React, { useState, useMemo } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { MOCK_USERS } from '../components';

// Import newly created components
import { Sidebar, Header, AdminPanel, OrgDashboard, Organizations } from '../components';

const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.appAdmin);
  const [currentView, setCurrentView] = useState('user-dashboard'); 
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgSubView, setOrgSubView] = useState('send-email');

  const handleSelectOrg = (org) => {
    if (org.id === 'admin-panel') {
      setSelectedOrg(null);
      setCurrentView('admin-panel');
    } else {
      setSelectedOrg(org);
      setCurrentView('org-dashboard');
    }
  };

  const handleBackToUserDashboard = () => {
    setSelectedOrg(null);
    setCurrentView('user-dashboard');
  };

  const dashboardTitle = useMemo(() => {
    if (currentView === 'admin-panel') return "Admin Dashboard";
    if (currentView === 'org-dashboard' && selectedOrg) return selectedOrg.name;
    return "Organizations";
  }, [currentView, selectedOrg]);

  const renderContent = () => {
    switch (currentView) {
      case 'admin-panel':
        return <AdminPanel user={currentUser} />;
      case 'org-dashboard':
        return <OrgDashboard org={selectedOrg} orgSubView={orgSubView}/>;
      case 'user-dashboard':
      default:
          return <Organizations user={currentUser} onSelectOrg={handleSelectOrg} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <ResizablePanelGroup direction="horizontal">
          
        {/* --------- Sidebar Panel ---------- */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
          <Sidebar 
            currentUser={currentUser}
            currentView={currentView}
            selectedOrg={selectedOrg}
            onSelectOrg={handleSelectOrg}
            handleBackToUserDashboard={handleBackToUserDashboard}
            orgSubView={orgSubView}       // for the selected field of organization
            setOrgSubView={setOrgSubView}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-slate-200" />
        
        {/* --------- Main Content Area -----------*/}
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full flex-col">
            <Header
              dashboardTitle={dashboardTitle}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              handleBackToUserDashboard={handleBackToUserDashboard}
            />
            
            <main className="flex-1 overflow-y-auto p-6">
                {renderContent()}
            </main>
          </div>
        </ResizablePanel>

    </ResizablePanelGroup>
    </div>
  );
}
export default DashboardPage