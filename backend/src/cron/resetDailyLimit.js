import { CronJob } from 'cron';
import { Organization } from '../models/organizationSchema.js';

// Default limits per plan
const tierLimits = {
    free: 25,
    pro: 250,
    premium: 500
};

const resetDailyLimit = new CronJob(
    '0 0 * * *', // 
    async () => {
        try {
            const organizations = await Organization.find();

            for (const org of organizations) {
                const newLimit = tierLimits[org.tier] || tierLimits.free;
                org.dailyLimit = newLimit;
                await org.save();
            }

            console.log('Daily limits reset successfully.');
        } catch (err) {
            console.error('Error resetting daily limits:', err);
        }
    },
    null,
    true,
    'Asia/Kolkata'
);

export {resetDailyLimit}
