import React, { useState, useMemo } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { MOCK_USERS } from '../components';

// Import newly created components
import { Sidebar, Header, AdminPanel, OrgDashboard, Organizations } from '../components';
import { useAppStore } from '@/store/useAppStore';

const DashboardPage = () => {

  const{
    currentUser,
    selectedOrg,
    setSelectedOrg,
    currentView,
    setCurrentView
  } = useAppStore()

  const [orgSubView, setOrgSubView] = useState('send-email'); // todo : default set to activity when current org member is orgadmin

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
    // console.log("currentView", currentView)
    switch (currentView) {
      case 'admin-panel':
        return <AdminPanel />;
      case 'org-dashboard':
        return <OrgDashboard orgSubView={orgSubView}/>;
      case 'user-dashboard':
      default:
          return <Organizations />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <ResizablePanelGroup direction="horizontal">
          
        {/* --------- Sidebar Panel ---------- */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
          <Sidebar 
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