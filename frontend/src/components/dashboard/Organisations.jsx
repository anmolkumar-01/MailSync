import React, { useState } from 'react';
import { MOCK_ORGS as initialOrgs } from '..';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LayoutDashboard, Plus, Pencil, Trash2 } from 'lucide-react';

// Import the PricingDialog component
import { PricingDialog } from '..'; 

// Helper function for styling plans
const getPlanStyles = (plan) => {
    switch (plan) {
        case 'Premium':
            return {
                badge: 'bg-purple-100 text-purple-800 border-purple-300',
                button: 'bg-purple-600 hover:bg-purple-700',
                iconColor: 'text-purple-500',
            };
        case 'Pro':
            return {
                badge: 'bg-amber-100 text-amber-800 border-amber-300',
                button: 'bg-amber-500 hover:bg-amber-600',
                iconColor: 'text-amber-500',
            };
        case 'Free':
        default:
            return {
                badge: 'bg-blue-100 text-blue-800 border-blue-300',
                button: 'bg-blue-600 hover:bg-blue-700',
                iconColor: 'text-blue-600',
            };
    }
};

// The main Organizations component
const Organizations = ({ user, onSelectOrg }) => {

    // --- STATE MANAGEMENT ---
    const [orgs, setOrgs] = useState(initialOrgs);
    const [isPricingDialogOpen, setPricingDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgDescription, setNewOrgDescription] = useState('');
    const [editingOrg, setEditingOrg] = useState(null);

    // --- EVENT HANDLERS ---
    const handlePlanSelect = (planName) => {
        setSelectedPlan(planName);
        setPricingDialogOpen(false);
        setDetailsDialogOpen(true);
    };

    const handleCreateOrg = () => {
    
        if (!newOrgName?.trim()) return;
        const newOrg = {
            id: `org-${Date.now()}`,
            name: newOrgName.trim(),
            plan: selectedPlan,
            members: [],
            description: newOrgDescription,
        };
        setOrgs([newOrg, ...orgs]);
        setDetailsDialogOpen(false);
        setNewOrgName('');
        setNewOrgDescription('');
    };
    
    const handleDeleteOrg = (orgId) => {
        setOrgs(orgs.filter(org => org.id !== orgId));
    };
    
    const handleSaveChanges = () => {
        if (!editingOrg) return;
        setOrgs(orgs.map(org => org.id === editingOrg.id ? editingOrg : org));
        setEditDialogOpen(false);
    };

    return (

        <div>

            {/* ------------- Organization Card ---------------- */}
            <Card className="bg-white shadow-sm border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-slate-800">Your Organizations</CardTitle>
                            <CardDescription>Select an organization to manage its dashboard.</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => setPricingDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-2">
                        {orgs.map(org => {
                            const planStyles = getPlanStyles(org.plan);
                            return (
                                //  ------- Each organizaion card ------
                                <Card key={org.id} className="bg-white flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200">
                                    <CardHeader className="flex flex-row items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-slate-900">{org.name}</CardTitle>
                                        
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* ----- edit  */}
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingOrg({ ...org }); setEditDialogOpen(true); }}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>

                                            {/* ---- delete */}
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteOrg(org.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1">
                                        <p className="text-sm text-slate-500 line-clamp-2">{org.description || `${org.members.length} members`}</p>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between">
                                        <Badge variant="outline" className={`font-semibold border-2 ${planStyles.badge}`}>{org.plan}</Badge>
                                        <Button size="sm" className={`w-fit text-white ${planStyles.button}`} onClick={() => onSelectOrg(org)}>
                                            <LayoutDashboard className="mr-2 h-4 w-4"/> Enter
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

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

            {/* ------------------ Edit the existing organization dialog --------- */}
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
        </div>
    );
};

export default Organizations;