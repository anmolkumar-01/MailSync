import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, LayoutDashboard, Building2, PanelLeft, Activity, Send, Users, LineChart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const Sidebar = ({handleBackToUserDashboard, orgSubView, setOrgSubView }) => {
    
    const {
        currentUser,
        currentView,
        selectedOrg,
        handleSelectOrg,
        orgCurrentUser, fetchOrgCurrentUser} = useAppStore()

    // console.log("selected org", selectedOrg)
    // console.log("role of current user in current org", orgCurrentUser)
    
    useEffect(() => {
        if (selectedOrg?._id) {
            fetchOrgCurrentUser(selectedOrg._id);
        }
    },[selectedOrg])

    const sidebarContent = useMemo(() => {
        
        // --- sidebar options ---
        let baseItems = [
            { 
                label: 'Organizations', 
                icon: Building2, 
                view: 'user-dashboard',
                // This button should take the user back to the main organization list
                onClick: handleBackToUserDashboard 
            },
        ];


        // If the user is an admin, add the "Admin Dashboard" option to the start of the list.
        if (currentUser?.role === 'admin') {
            baseItems.unshift({
                label: 'Admin Dashboard',
                icon: LayoutDashboard,
                view: 'admin-panel',
                // This button specifically triggers the switch to the admin panel view
                onClick: () => handleSelectOrg({ id: 'admin-panel' })
            });
        }

        // --- Logic for contextual menu items remains the same ---
        let orgMenuItems = [];
        if (currentView === 'org-dashboard' && selectedOrg) {
            orgMenuItems = [
                { label: 'Send Email', icon: Send, viewId: 'send-email', onClick: () => setOrgSubView('send-email') },
            ];
            if (orgCurrentUser?.role === 'orgAdmin') {
                orgMenuItems.unshift({ label: 'Members', icon: Users, viewId: 'members', onClick: () => setOrgSubView('members') });
                orgMenuItems.unshift({ label: 'Analytics', icon: LineChart, viewId: 'analytics', onClick: () => setOrgSubView('analytics') });
            }

            // make item active whose viewId = orgSubView
            orgMenuItems.forEach(item => {
                item.active = item.viewId === orgSubView;
            });
        }
        
        return (
            <nav className="flex flex-col gap-1 p-2">

                <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</h3>
                
                {/* ---------- Sidebar main options --------- */}
                {baseItems.map(item => (
                    <Button 
                        key={item.label} 
                        variant={currentView === item.view ? 'secondary' : 'ghost'} 
                        className="w-full justify-start" 
                        onClick={item.onClick} // Use the specific onClick for each item
                    >
                        <item.icon className="mr-2 h-4 w-4" /> {item.label}
                    </Button>
                ))}
                
                {/* ----------- Items related to each organizations ----------- */}
                {orgMenuItems.length > 0 && <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{selectedOrg?.name || 'Platform'}</h3>}
                
                {orgMenuItems.map(item => (
                    <Button key={item.label} variant={item.active ? 'secondary' : 'ghost'} className="w-full justify-start"
                    onClick={item.onClick}>
                        <item.icon className="mr-2 h-4 w-4" /> {item.label}
                    </Button>
                ))}
            </nav>
        );
    }, [currentView, selectedOrg, currentUser?.role, orgCurrentUser?.role, handleBackToUserDashboard, handleSelectOrg]);

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex h-[60px] items-center border-b border-slate-200 px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold text-slate-800">
                <img src="./logo.png" alt="MailSync" className="w-6 h-6 "/>
                <span>MailSync</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 min-h-0">{sidebarContent}</ScrollArea>
        </div>
    );
};

export default Sidebar;