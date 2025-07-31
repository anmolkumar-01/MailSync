import { AnalyticsChartPlaceholder,StatCard } from '..';
import { Users, Send, Activity, Star } from 'lucide-react';
import { SendEmailsPage as  SendEmailView} from '../../pages';

const OrgDashboard = ({ org, user, orgSubView }) => {

    // todo : replace with the component containing members table ( with add and remove functionality)
    const MembersView = () => (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold">Member Management</h2>
            <p className="text-slate-500 mt-2">Member list and invitation controls would be displayed here.</p>
        </div>
    );

    // // todo : replace it with send email page
    // const SendEmailView = () => (
    //     <div className="text-center p-10 bg-white rounded-lg shadow-sm">
    //         <h2 className="text-2xl font-bold">Send Email</h2>
    //         <p className="text-slate-500 mt-2">The AI-powered email composer would be displayed here.</p>
    //     </div>
    // );

    // The main Analytics view you already built
    const AnalyticsView = () => (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatCard title="Team Members" value={org.members.length} change="+2" changeType="increase" icon={Users} />
                <StatCard title="Emails Sent" value="1,284" change="+35%" changeType="increase" icon={Send} />
                <StatCard title="Open Rate" value="58.3%" change="-1.2%" changeType="decrease" icon={Activity} />
                <StatCard title="Click Rate" value="12.7%" change="+4.5%" changeType="increase" icon={Star} />
            </div>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
                <AnalyticsChartPlaceholder title="Email Analytics" value="12,120.00" performanceText="Excellent job on your order 👍"/>
                <AnalyticsChartPlaceholder title="Revenue Profile" value="$25,843.45" performanceText="Your performance is excellent ✨"/>
            </div>
        </div>
    );

    // Main return statement for OrgDashboard
    return (
        <div>
            {orgSubView === 'analytics' && <AnalyticsView />}
            {orgSubView === 'members' && <MembersView />}
            {orgSubView === 'send-email' && <SendEmailView />}
        </div>
    );
}

export default OrgDashboard