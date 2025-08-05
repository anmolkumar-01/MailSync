import React, { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LayoutDashboard, Pencil, Trash2, Check, X, LogOut } from 'lucide-react';


// todo : move this to utility functions 
const getPlanStyles = (plan) => {
    switch (plan) {
        case 'premium':
            return {
                badge: 'bg-purple-100 text-purple-800 border-purple-300',
                button: 'bg-purple-600 hover:bg-purple-700',
                iconColor: 'text-purple-500',
            };
        case 'pro':
            return {
                badge: 'bg-amber-100 text-amber-800 border-amber-300',
                button: 'bg-amber-500 hover:bg-amber-600',
                iconColor: 'text-amber-500',
            };
        case 'free':
        default:
            return {
                badge: 'bg-blue-100 text-blue-800 border-blue-300',
                button: 'bg-blue-600 hover:bg-blue-700',
                iconColor: 'text-blue-600',
            };
    }
};

const OrgsTabs= ({inviteStatus = "accepted", setEditingOrg, setEditDialogOpen}) => {

    const {orgs, invitedOrgs, handleSelectOrg, currentUser , deleteOrg, acceptInvite, rejectInvite, leftOrg} = useAppStore()

    const handleDeleteOrg = async(orgId) => {
        await deleteOrg(orgId);
    };

    const handleRejectInvite = async(orgId) => {
        await rejectInvite(orgId);
    }

    const handleAcceptInvite = async (orgId) => {
        await acceptInvite(orgId);
    }

    const handleLeftOrg = async (orgId) => {
        await leftOrg(orgId);
    }

    // ------------------ accepted organizations
    const accepted = useMemo(()=>{

        return orgs.map(org => {
            // console.log(org)
            const planStyles = getPlanStyles(org.tier);
            return (
                //  ------- Each organizaion card ------
                <Card key={org._id} className="bg-white flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900">{org.name}</CardTitle>
                        <Badge variant="outline" className={`font-semibold border-2 ${planStyles.badge}`}>{org.tier}</Badge>

                        
                    </CardHeader>

                    <CardContent className="flex-1">
                        <p className="text-sm text-slate-500 line-clamp-2">{org.description}</p>

                        {/*  todo : show members number */}
                        {/* <p className="text-sm text-slate-500 line-clamp-2">{org.members?.length} members</p> */}
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                        {org.status === 'pending'?
                        (
                            <Badge variant="outline" className={`font-semibold border-2 bg-green-100 text-green-800 border-green-300`}>pending</Badge>
                        ):
                        (   <>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* console.log(org, currentUser) */}
                                {org.owner === currentUser._id ? (

                                <>
                                    {/* ----- edit  */}
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingOrg({ ...org }); setEditDialogOpen(true); }}>
                                        <Pencil className="h-4 w-4 text-slate-500" />
                                    </Button>

                                    {/* ---- delete */}
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteOrg(org._id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </>
                                ) : 
                                (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLeftOrg(org._id)}>
                                        <LogOut className="h-4 w-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                            
                            <Button 
                                size="sm" 
                                className={`w-fit text-white ${planStyles.button}`} 
                            onClick={() =>{
                                handleSelectOrg(org);
                            }}>
                                <LayoutDashboard className="mr-2 h-4 w-4"/> Enter
                            </Button>
                            </>
                            
                        )
                        }

                    </CardFooter>
                </Card>
            );
        })
    }, [orgs])

    // ------------------- invited organizations 
    const invited = useMemo(()=>{
        return invitedOrgs.map(org => {
            // console.log(org)
            const planStyles = getPlanStyles(org.tier);
            return (
                //  ------- Each organizaion card ------
                <Card key={org._id} className="bg-white flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-900">{org.name}</CardTitle>
                        <Badge variant="outline" className={`font-semibold border-2 ${planStyles.badge}`}>{org.tier}</Badge>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <p className="text-sm text-slate-500 line-clamp-2">{org.description}</p>

                        {/*  todo : show members number */}
                        {/* <p className="text-sm text-slate-500 line-clamp-2">{org.members?.length} members</p> */}
                    </CardContent>

                    
                    <CardFooter className="flex items-center justify-end"> 

                        <div className="flex items-center gap-2">

                            {/* ------------ decline an invite ------------- */}
                            <Button 
                                size="sm" 
                                className="bg-red-100 text-red-700 hover:bg-red-200"
                                onClick={() => handleRejectInvite((org._id))}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Decline
                            </Button>

                            {/* --------------- accept an invite ----------- */}
                            <Button 
                                size="sm" 
                                className="bg-green-100 text-green-700 hover:bg-green-200"
                                onClick={() => handleAcceptInvite(org._id)}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Accept
                            </Button>
                        </div>
                        
                    </CardFooter>
                </Card>
            );
        })
    }, [orgs])

    return (
        inviteStatus ==='accepted'? <> {accepted } </> : <>{invited}</>
    )
}


export default OrgsTabs