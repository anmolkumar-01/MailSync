import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <Card className="shadow-sm bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      <Icon className="h-4 w-4 text-slate-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <p className="text-xs text-slate-500 flex items-center">
        {changeType === 'increase' ? (
          <ArrowUpCircle className="h-4 w-4 mr-1 text-emerald-500" />
        ) : (
          <ArrowDownCircle className="h-4 w-4 mr-1 text-red-500" />
        )}
        {change} vs last month
      </p>
    </CardContent>
  </Card>
);

export default StatCard