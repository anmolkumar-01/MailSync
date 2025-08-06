import React, { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LayoutDashboard, Pencil, Trash2, Check, X, LogOut } from 'lucide-react';
import { getPlanStyles } from '@/lib/helperFxns';

// todo : move this to utility functions 

// todo: move to utility
function truncateName(name, maxLength = 10) {
    return name.length > maxLength
    ? name.slice(0, maxLength) + '...'
    : name;
}

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
                        <CardTitle className="text-lg font-semibold text-slate-900">{truncateName(org.name, 20)}</CardTitle>
                        <Badge variant="outline" className={`font-semibold border-2 ${planStyles.badge}`}>{org.tier}</Badge>

                    </CardHeader>

                    <CardContent className="flex-1">
                        <p className="text-sm text-slate-500 line-clamp-2">{org.description}</p>

                        {/*  todo : show members number */}
                        {/* <p className="text-sm text-slate-500 line-clamp-2">{org.members?.length} members</p> */}
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                        {org.status !== 'approved'?
                        (   <>
                                {org.status === 'pending' && <Badge variant="outline" className={`font-semibold bg-blue-100 text-blue-800`}>pending</Badge>}
                                {org.status === 'rejected' && <Badge variant="outline" className={`font-semibold bg-red-100 text-red-800`}>rejected</Badge>}
                                {/* ---- delete or leave */}
                                {org.owner === currentUser._id?
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteOrg(org._id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                    : 
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLeftOrg(org._id)}>
                                        <LogOut className="h-4 w-4 text-red-500" />
                                    </Button>

                                }
                            </>
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
                        <CardTitle className="text-lg font-semibold text-slate-900">{truncateName(org.name, 20)}</CardTitle>
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