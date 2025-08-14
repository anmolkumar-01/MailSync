import { SendEmailsPage, OrgMembersPage, OrgAnalyticsPage} from '../../pages';
import { useAppStore } from '@/store/useAppStore';

const OrgDashboard = () => {

    const {orgSubView, currentView} = useAppStore()
    console.log("currentView:", currentView)

    return (
        <div className="h-full">
            {orgSubView === 'analytics' && <OrgAnalyticsPage />}
            {orgSubView === 'members' && <OrgMembersPage />}
            {orgSubView === 'send-email' && <SendEmailsPage />}
        </div>
    );
}

export default OrgDashboard