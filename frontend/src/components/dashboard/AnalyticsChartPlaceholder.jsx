import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsChartPlaceholder = ({ title, value, performanceText }) => (
    <Card className="h-full shadow-sm bg-white">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-slate-800">{title}</CardTitle>
                <Button variant="outline" size="sm" className="text-slate-600">Monthly <ChevronDown className="h-4 w-4 ml-2"/></Button>
            </div>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <CardDescription>{performanceText}</CardDescription>
        </CardHeader>
        <CardContent className="h-64 bg-slate-50/70 rounded-b-lg flex items-center justify-center">
            <p className="text-slate-400">Chart would be displayed here</p>
        </CardContent>
    </Card>
);

export default AnalyticsChartPlaceholder