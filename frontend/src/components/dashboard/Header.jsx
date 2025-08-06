import { Bell, ChevronDown, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserIcon } from '..';

const Header = ({ dashboardTitle, currentUser, handleBackToUserDashboard }) => (
    <header className="flex h-[60px] items-center gap-4 border-b border-slate-200 bg-white px-6">
        <div className="w-full flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{dashboardTitle}</h1>
        </div>

        {/* -------- notification ------- */}
        {/* <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
            <Bell className="h-5 w-5" />
        </Button> */}

        <UserIcon />
    </header>
);

export default Header