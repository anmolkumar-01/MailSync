import { Bell} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserIcon } from '..';
import { useAppStore } from '@/store/useAppStore';

const Header = ({ dashboardTitle, currentUser, handleBackToUserDashboard }) => {
    const {selectedOrg} = useAppStore();
    console.log("selected org " ,selectedOrg)

    return (
    <header className="flex h-[60px] items-center gap-4 border-b border-slate-200 bg-white px-6">
        <div className="w-full flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{dashboardTitle}</h1>
        </div>

        {/* -------- notification ------- */}
        {/* <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
            <Bell className="h-5 w-5" />
        </Button> */}

        {selectedOrg && <Badge 
        variant="outline" 
        className="bg-blue-100 text-blue-800 border-blue-200 font-semibold text-sm py-1.5 px-3"
        >
        <span>{selectedOrg?.dailyLimit} emails remaining today</span>
        </Badge>}

        <UserIcon />
    </header>
    )
};

export default Header