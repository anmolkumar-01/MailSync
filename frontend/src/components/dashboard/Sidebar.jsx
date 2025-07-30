import React, { useMemo } from 'react';
import {Link} from 'react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, LayoutDashboard, Building2, PanelLeft, Activity, Send, Users, LineChart } from 'lucide-react';

const Sidebar = ({ currentUser, currentView, selectedOrg, handleBackToUserDashboard }) => {
    const sidebarContent = useMemo(() => {
        const baseItems = [
            { label: 'Dashboard', icon: LayoutDashboard, view: 'user-dashboard' },
            { label: 'Organizations', icon: Building2, view: 'user-dashboard' },

        ];

        let orgMenuItems = [];
        if (currentView === 'org-dashboard' && selectedOrg) {
            orgMenuItems = [
                { label: 'Activity', icon: Activity, active: true },
                { label: 'Send Email', icon: Send },
            ];
            if (currentUser.role === 'orgAdmin') {
                orgMenuItems.push({ label: 'Members', icon: Users });
                orgMenuItems.push({ label: 'Analytics', icon: LineChart });
            }
        } else if (currentView === 'admin-panel') {
            orgMenuItems = [{ label: 'Admin Panel', icon: PanelLeft, active: true }];
        }

        return (
            <nav className="flex flex-col gap-1 p-2">
                {currentView !== 'user-dashboard' && (
                    <Button variant="ghost" className="mb-2 justify-start text-blue-600 hover:text-blue-700" onClick={handleBackToUserDashboard}>
                        ← All Organizations
                    </Button>
                )}
                <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</h3>
                {baseItems.map(item => (
                    <Link key={item.label} href="#">
                        <Button variant={currentView === item.view ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={handleBackToUserDashboard}>
                            <item.icon className="mr-2 h-4 w-4" /> {item.label}
                        </Button>
                    </Link>
                ))}
                {orgMenuItems.length > 0 && <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{selectedOrg?.name || 'Platform'}</h3>}
                {orgMenuItems.map(item => (
                    <Button key={item.label} variant={item.active ? 'secondary' : 'ghost'} className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" /> {item.label}
                    </Button>
                ))}
            </nav>
        );
    }, [currentView, selectedOrg, currentUser.role, handleBackToUserDashboard]);

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex h-[60px] items-center border-b border-slate-200 px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
                    <Mail className="h-6 w-6 text-blue-500" />
                    <span>MailSync</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 min-h-0">{sidebarContent}</ScrollArea>
        </div>
    );
};

export default Sidebar