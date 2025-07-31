// src/lib/data.js

export const MOCK_USERS = {
  appAdmin: { id: 'user-1', name: 'Alex Reid', role: 'admin', email: 'alex.reid@platform.com' },
  orgAdmin: { id: 'user-2', name: 'Casey Jordan', role: 'orgAdmin', email: 'casey.jordan@company-a.com' },
  orgMember: { id: 'user-3', name: 'Taylor Morgan', role: 'orgMember', email: 'taylor.morgan@company-a.com' },
};

export const MOCK_ORGS = [
  { id: 'org-1', name: 'Innovate Inc.', plan: 'Free', members: [MOCK_USERS.orgAdmin, MOCK_USERS.orgMember] },
  { id: 'org-2', name: 'Synergy Corp.', plan: 'Pro' , members: []},
  { id: 'org-3', name: 'Quantum Solutions', plan: 'Premium', members: [] },
];

export const MOCK_ACTIVITIES = [
  { id: '#3210', restaurant: 'Al Baik Fast Food Shop', customer: 'Olivia Martin', date: '2024-07-29 10:42', items: 150, amount: '$3,467.00', status: 'Approved' },
  { id: '#3209', restaurant: 'Taza Bukari House', customer: 'Ava Wilson', date: '2024-07-28 14:00', items: 1050, amount: '$5,576.90', status: 'Approved' },
  { id: '#3204', restaurant: 'Al Tazaz Fast Food Shop', customer: 'Liam Anderson', date: '2024-07-27 11:30', items: 200, amount: '$2,400.50', status: 'Rejected' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3203', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
  { id: '#3204', restaurant: 'Pizza Palace', customer: 'Noah Garcia', date: '2024-07-26 09:15', items: 300, amount: '$1,230.00', status: 'Pending' },
];