import React from 'react';
import { useAppStore } from '@/store/useAppStore'; // Import the store
import Notification from './Notification';

const NotificationContainer = () => {

  const {notifications} = useAppStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2">

      {/* showing all the notifications , preventing them overriding*/}
      {notifications.map((n) => (
        <Notification key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default NotificationContainer;