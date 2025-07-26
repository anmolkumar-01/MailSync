import cron from 'node-cron';
import { Organization } from '../models/organizationSchema';

// Default limits per plan
const tierLimits = {
    free: 25,
    pro: 250,
    premium: 500
};

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily organization limit reset at 00:00');

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
});
