import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';
import { PricingDialog, OrgsTabs } from '..'; 

// Helper function for styling plans, todo : move this to utility functions 
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

const Organizations = () => {

    // --- STATE MANAGEMENT ---

    const {
        orgs,
        fetchUserOrgs,
        createOrg,
        deleteOrg,
        updateOrg,
        currentUser
    } = useAppStore();

    const [isPricingDialogOpen, setPricingDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgDescription, setNewOrgDescription] = useState('');
    const [editingOrg, setEditingOrg] = useState(null);

    const myOrgExists = orgs.filter(o => o.email === currentUser.email).length

    // ----- fetching the all organizations or a user -------
    useEffect(() => {
        if (currentUser && orgs.length === 0) {
            fetchUserOrgs();
        }
    }, [currentUser]);

    // --- EVENT HANDLERS ---
    const handlePlanSelect = (planName) => {
        setSelectedPlan(planName);
        setPricingDialogOpen(false);
        setDetailsDialogOpen(true);
    };

    const handleCreateOrg = async () => {
        if (!newOrgName?.trim()) return;
        
        const data = await createOrg({
            name: newOrgName.trim(),
            email: currentUser.email,
            description: newOrgDescription,
            tier: selectedPlan.toLowerCase(),
        });
        if (!data) {
            setDetailsDialogOpen(false);
            setNewOrgName('');
            setNewOrgDescription('');
        }
    };
    
    const handleSaveChanges = async () => {
        if (!editingOrg || !editingOrg.name.trim()) return;
        await updateOrg(editingOrg._id, {
            name: editingOrg.name,
            description: editingOrg.description,
        });
        setEditDialogOpen(false);
    };

    return (

        <>

            {/* ------------- Organization Card ( tabs )---------------- */}
            <Tabs defaultValue="accepted-orgs">

                <TabsList className="grid  grid-cols-2">
                    <TabsTrigger value="accepted-orgs">All Organizations</TabsTrigger>
                    <TabsTrigger value="invited-orgs">Invited Organizations</TabsTrigger>
                </TabsList>

                {/* --- Tab 1 Content : Accepted organizations --- */}
                <TabsContent value="accepted-orgs" >
                    <Card className="bg-white shadow-sm border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    {/* <CardTitle className="text-slate-800">Your Organizations</CardTitle> */}
                                    <CardDescription>Select an organization to manage its dashboard.</CardDescription>
                                </div>
                                {!myOrgExists && <Button size="sm" onClick={() => setPricingDialogOpen(true)}>
                                    <Plus className="mr-2 h-3 w-4" /> Add New
                                </Button>}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-2">
                                <OrgsTabs inviteStatus="accepted" setEditingOrg={setEditingOrg} setEditDialogOpen={setEditDialogOpen}/>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Tab 2 Content : Invited organizations --- */}
                <TabsContent value="invited-orgs">
                    <Card className="bg-white shadow-sm border">
                        <CardHeader>
                            <CardDescription className="my-2"
                            >Accept or decline the invite from an organization.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-2">
                                <OrgsTabs inviteStatus="invited"/>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* ------------ Pricing dialog box ---------------- */}
            <PricingDialog
                open={isPricingDialogOpen}
                onOpenChange={setPricingDialogOpen}
                onPlanSelect={handlePlanSelect}
            />

            {/*  ------------- Create New Organization dialog box ------------- */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Organization</DialogTitle>
                        <DialogDescription>
                            You've selected the <span className={`font-bold ${getPlanStyles(selectedPlan).iconColor}`}>{selectedPlan}</span> plan. Now, give your organization a name.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input placeholder="Organization Name" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} />
                        <Textarea placeholder="Organization Description (Optional)" value={newOrgDescription} onChange={(e) => setNewOrgDescription(e.target.value)} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setDetailsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleCreateOrg}>Create Organization</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ------------------ Edit the existing organization (dialog) --------- */}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Organization</DialogTitle>
                        <DialogDescription>Make changes to your organization's details here.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input value={editingOrg?.name || ''} onChange={(e) => setEditingOrg({...editingOrg, name: e.target.value})} />
                        <Textarea value={editingOrg?.description || ''} onChange={(e) => setEditingOrg({...editingOrg, description: e.target.value})} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Organizations;