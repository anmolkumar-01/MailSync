import { MOCK_ORGS } from '..';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

const UserDashboard = ({ user, onSelectOrg }) => (
    <div className="space-y-6">
        <Card className="bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="text-slate-800">Your Organizations</CardTitle>
                <CardDescription>Select an organization to manage its dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_ORGS.map(org => (
                    <Card key={org.id} className="bg-white hover:shadow-lg transition-shadow border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base text-slate-800">
                                {org.name} <Badge variant="secondary" className="bg-blue-100 text-blue-800">{org.plan}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500">{org.members.length} members</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onSelectOrg(org)}>
                                <LayoutDashboard className="mr-2 h-4 w-4"/>
                                Enter Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
        {user.role === 'admin' && (
             <Card className="bg-white shadow-sm border-blue-200">
                <CardHeader>
                    <CardTitle className="text-slate-800">App Administrator</CardTitle>
                    <CardDescription>You have platform-wide administrative privileges.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onSelectOrg({ id: 'admin-panel' })}>Go to Admin Panel</Button>
                </CardFooter>
            </Card>
        )}
    </div>
);

export default UserDashboard