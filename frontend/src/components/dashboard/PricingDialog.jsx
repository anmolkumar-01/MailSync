import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Zap, Diamond, Globe, ChevronRight } from 'lucide-react';
import { getPlanStyles } from '@/lib/helperFxns';

// --- DATA & STYLING HELPERS ---

// Updated to provide styles for the new light-themed, color-coded design


// Data remains the same, but we will use the new `icon` from the style helper
const pricingPlans = {
    monthly: [
        { name: 'free', price: '$0', description: "Ideal for new investors or those with smaller portfolios.", features: ['Market data and news', 'Basic portfolio tracking', 'Limited customer support'] },
        { name: 'pro', price: '$59', description: "A comprehensive plan for investors seeking more advanced features.", features: ['All features from Free', 'Advanced portfolio analysis', 'Personalized recommendations', 'Priority customer support'], highlighted: true },
        { name: 'premium', price: '$299', description: "Tailored for experienced investors and companies with complex needs.", features: ['All features from Pro', 'Exclusive research & analysis', 'Dedicated account manager', 'Exclusive investment opportunities'] }
    ],
    annually: [
        { name: 'free', price: '$0', description: "Ideal for new investors or those with smaller portfolios.", features: ['Market data and news', 'Basic portfolio tracking', 'Limited customer support'] },
        { name: 'pro', price: '$590', description: "A comprehensive plan for investors seeking more advanced features.", features: ['All features from Free', 'Advanced portfolio analysis', 'Personalized recommendations', 'Priority customer support'], highlighted: true },
        { name: 'premium', price: '$2990', description: "Tailored for experienced investors and companies with complex needs.", features: ['All features from Pro', 'Exclusive research & analysis', 'Dedicated account manager', 'Exclusive investment opportunities'] }
    ]
};

// --- HELPER SUB-COMPONENT for the individual plan cards ---

const PricingPlan_Card = ({ plan, onSelect, billingCycle, isHighlighted, onHighlight }) => {
    const styles = getPlanStyles(plan.name);
    const Icon = styles.icon;

    return (
        <div 
            onMouseEnter={() => onHighlight(plan.name)}
            className={`p-6 rounded-2xl flex flex-col h-full bg-white transition-all duration-300
            ${isHighlighted 
                ? `shadow-2xl border-1 ${styles.borderColor}` 
                : 'border border-slate-200'}`
        }>
            <div className="flex items-center gap-3 mb-4">
                <Icon className={`h-6 w-6 ${styles.accentColor}`} />
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            </div>
            
            <p className="text-2xl font-bold mb-2 text-slate-900">
                {plan.price}
                <span className="text-base font-medium text-slate-500">/{billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
            </p>
            
            <p className="text-sm mb-6 flex-grow text-slate-600">
                {plan.description}
            </p>
            
            <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 ${styles.accentColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                ))}
            </ul>
            
            <Button onClick={() => onSelect(plan.name)} className={`w-full mt-auto text-base py-5 rounded-lg ${styles.buttonClass}`}>
                {plan.name === 'free' ? 'Register For Free' : 'Get Started'}
                {plan.name !== 'free' && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
        </div>
    );
};


// --- MAIN DIALOG COMPONENT ---

export const PricingDialog = ({ open, onOpenChange, onPlanSelect }) => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [highlightedPlan, setHighlightedPlan] = useState('pro');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-auto bg-white border-none shadow-2xl p-8 sm:p-10 lg:w-4xl max-w-lg lg:max-w-7xl flex flex-col max-h-[90vh]">
                
                {/* 👇 Header is now a flex row with items spaced apart */}
                <DialogHeader className="flex-col justify-between items-center flex-shrink-0">
                    <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
                        Choose <span className="text-blue-600">The Plan</span> That's Right For You!
                    </DialogTitle>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="billing-cycle" className="font-medium text-sm text-slate-700">Monthly</label>
                        <Switch 
                            id="billing-cycle" 
                            checked={billingCycle === 'annually'} 
                            onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
                        />
                        <label htmlFor="billing-cycle" className="font-medium text-sm text-slate-700">Annually</label>
                    </div>
                </DialogHeader>

                {/* Scrollable content area */}
                <div 
                    className="flex-1 overflow-y-auto min-h-0 pt-1 mt-2 -mx-4 px-4"
                    onMouseLeave={() => setHighlightedPlan('pro')}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {pricingPlans[billingCycle].map(plan => (
                            <PricingPlan_Card 
                                key={plan.name} 
                                plan={plan} 
                                onSelect={onPlanSelect} 
                                billingCycle={billingCycle}
                                isHighlighted={highlightedPlan === plan.name}
                                onHighlight={setHighlightedPlan}
                            />
                        ))}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default PricingDialog;