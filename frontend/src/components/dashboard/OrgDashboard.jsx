import { SendEmailsPage, OrgMembersPage, OrgAnalyticsPage} from '../../pages';
import { useAppStore } from '@/store/useAppStore';

const OrgDashboard = () => {

    const {orgSubView} = useAppStore()
    // console.log("orgsubview:", orgSubView)

    return (
        <div>
            {orgSubView === 'analytics' && <OrgAnalyticsPage />}
            {orgSubView === 'members' && <OrgMembersPage />}
            {orgSubView === 'send-email' && <SendEmailsPage />}
        </div>
    );
}

export default OrgDashboard