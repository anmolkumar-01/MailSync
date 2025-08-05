import React from 'react'
import { AnalyticsChartPlaceholder,StatCard } from '@/components';
import { Users, Send, Activity, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

function OrgAnalyticsPage() {

    const {
        orgs,
        selectedOrg
    } = useAppStore();

    console.log(selectedOrg)

    const tierMaxEmail = {
        free: 25,
        pro: 250,
        premium: 500
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">

                {/* todo: organization members .length */}
                <StatCard title="Team Members" value={orgs.length} change="+2" changeType="increase" icon={Users} />
                <StatCard title="Emails Sent" value={tierMaxEmail[selectedOrg?.tier] - selectedOrg?.dailyLimit} change="+35%" changeType="increase" icon={Send} />
                <StatCard title="Open Rate" value="58.3%" change="-1.2%" changeType="decrease" icon={Activity} />
                <StatCard title="Click Rate" value="12.7%" change="+4.5%" changeType="increase" icon={Star} />
            </div>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
                <AnalyticsChartPlaceholder title="Email Analytics" value="12,120.00" performanceText="Excellent job on your order 👍"/>
                <AnalyticsChartPlaceholder title="Revenue Profile" value="$25,843.45" performanceText="Your performance is excellent ✨"/>
            </div>
        </div>
    )
}

export default OrgAnalyticsPage