import { useAppStore } from '@/store/useAppStore';
import {MOCK_ORGS, AnalyticsChartPlaceholder, ActivityTable, StatCard} from '..';
import { Building2, CreditCard, Users, Star } from 'lucide-react';

const AdminPanel = () => {

    const {currentUser} = useAppStore()

    return (
        // This outer container sets up the full-height flex column. This is correct.
        <div className="h-full flex flex-col gap-6 p-6">
        
        {/* This top section of stat cards should not grow. This is correct. */}
        <div className="flex-shrink-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Organizations" value={MOCK_ORGS.length} change="+5%" changeType="increase" icon={Building2} />
            <StatCard title="Total Revenue" value="$45,231.89" change="+18.1%" changeType="increase" icon={CreditCard} />
            <StatCard title="Active Users" value="1,250" change="+22%" changeType="increase" icon={Users} />
            <StatCard title="Pending Tickets" value="12" change="+5%" changeType="increase" icon={Star} />
            </div>
        </div>

        <div className="flex-1 flex gap-6 md:gap-8 min-h-0">
                {/* 
                - This div now takes up 2/3 of the width.
                - It is also a flex container that will pass its full height down to the ActivityTable.
                */}
                <div className="w-2/3 flex flex-col">
                    <ActivityTable />
                </div>

                {/* This div takes up the remaining 1/3 of the width. */}
                <div className="w-1/3 flex flex-col">
                    <AnalyticsChartPlaceholder 
                        title="Platform Revenue" 
                        value="$25,843.45"
                        performanceText="Your platform performance is excellent ✨"
                    />
                </div>
            </div>
        </div>
    )
};

export default AdminPanel