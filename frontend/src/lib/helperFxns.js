import { Globe, Diamond, Zap} from 'lucide-react'

const getPlanStyles = (planName) => {
    switch (planName) {
        case 'premium':
            return {
                badge: 'bg-purple-100 text-purple-800 border-purple-300',
                button: 'bg-purple-600 hover:bg-purple-700',
                iconColor: 'text-purple-500',

                //  make changes
                accentColor: 'text-purple-600',
                borderColor: 'border-purple-600',
                buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
                icon: Globe,
            };
        case 'pro':
            return {
                badge: 'bg-amber-100 text-amber-800 border-amber-300',
                button: 'bg-amber-500 hover:bg-amber-600',
                iconColor: 'text-amber-500',

                accentColor: 'text-amber-500',
                borderColor: 'border-amber-500',
                buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white',
                icon: Diamond,
            };
        case 'free':
        default:
            return {
                badge: 'bg-blue-100 text-blue-800 border-blue-300',
                button: 'bg-blue-600 hover:bg-blue-700',
                iconColor: 'text-blue-600',

                accentColor: 'text-blue-600',
                borderColor: 'border-blue-600',
                buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                icon: Zap,
            };
    }
};

const getStatusButtonClasses = (status) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'rejected':
            return 'bg-red-100 text-red-700 hover:bg-red-200';
        case 'pending':
        default:
            return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    }
};

const truncateName = (name, maxLength = 10) => {
    return name.length > maxLength
    ? name.slice(0, maxLength) + '...'
    : name;
}

export {
    getPlanStyles, 
    truncateName,
    getStatusButtonClasses
}