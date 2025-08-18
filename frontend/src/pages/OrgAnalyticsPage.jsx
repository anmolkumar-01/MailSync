import React, {useEffect} from 'react'
import { StatCard, EmailAnalyticsChart } from '@/components';
import { Users, Send, UserPlus, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

function OrgAnalyticsPage() {

    const {
        orgs,
        selectedOrg,
        currentOrgMembers,
        fetchCurrentOrgMembers,
        onlineUsers
    } = useAppStore();

    // console.log(selectedOrg)

    useEffect(()=>{
        fetchCurrentOrgMembers(selectedOrg._id)
    },[selectedOrg, currentOrgMembers?.length])

    const currentOrgMembersLength = currentOrgMembers.filter(m => m.status === 'accepted').length
    const onlineMembers = currentOrgMembers.filter(m=> onlineUsers.includes(m.userId._id));
    // console.log("online Members: ", onlineMembers)

    const tierMaxEmail = {
        free: 25,
        pro: 250,
        premium: 500
    };

    return (
        <div className=" h-full flex flex-col space-y-6">
            <div className="flex-shrink-0">
                <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <StatCard title="Team Members" value={currentOrgMembersLength} change="+2" changeType="increase" icon={Users} />
                    <StatCard title="Emails Sent" value={selectedOrg?.totalEmailsSent || 0} change="+35%" changeType="increase" icon={Send} />
                    <StatCard title="Online members" value={onlineMembers?.length} change="-1.2%" changeType="decrease" icon={UserPlus} />
                    <StatCard title="Click Rate" value="12.7%" change="+4.5%" changeType="increase" icon={Star} />
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <EmailAnalyticsChart />
            </div>
        </div>
    )
}

export default OrgAnalyticsPage

//  Two sections 
{/* <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
    <AnalyticsChartPlaceholder title="Email Analytics" value="12,120.00" performanceText="Excellent job on your order 👍"/>
    <AnalyticsChartPlaceholder title="Revenue Profile" value="$25,843.45" performanceText="Your performance is excellent ✨"/>
</div> */}