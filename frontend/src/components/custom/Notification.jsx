import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore'; // Import the store

const Notification = ({ notification }) => {
    const { id, message, status } = notification;

    const {closeNotification} = useAppStore();
    
    const [isEntering, setIsEntering] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef(null);

    // setting icons and col on success/error
    const config = {
        success: { icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, barColor: 'bg-green-500' },
        notify: { icon: <CheckCircle2 className="h-6 w-6 text-blue-500" />, barColor: 'bg-blue-500'},
        error: { icon: <XCircle className="h-6 w-6 text-red-500" />, barColor: 'bg-red-500' },
    };
    const { icon, barColor } = config[status];

    const handleClose = () => {
        clearTimer();
        setIsExiting(true);
        setTimeout(() => {
        // Call the store's action to remove this notification by its ID
        
        closeNotification(id);
        }, 300);
    };

    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const startTimer = () => {
        clearTimer();
        timerRef.current = setTimeout(handleClose, 4000);
    };
  
    useEffect(() => {
        startTimer();
        return () => clearTimer();
    }, []);

    useEffect(() => {
        const enterTimeout = setTimeout(() => setIsEntering(false), 10); // allow browser to apply initial state
        startTimer();
        return () => {
            clearTimeout(enterTimeout);
            clearTimer();
        };
    }, []);

  return (
    <div
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={`transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 translate-x-full' :
            isEntering?
            'opacity-0 translate-x-full'   // Start off-screen when mounting
            : 'opacity-100 translate-x-0'    // Slide in when isEntering is false
        }`}
    >
      <Card className="w-80 shadow-lg overflow-hidden">
        <div className="flex">
          <div className={`w-2 ${barColor}`}></div>
          
          <CardContent className="p-4 flex items-center space-x-3 flex-grow">
            
            {/*status icon */}
            <div>{icon}</div>
            
            {/* message text */}
            <p className="text-sm font-medium text-gray-700 flex-grow">{message}</p>
            
            {/* close button */}
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 focus:outline-none">
              <X className="h-5 w-5" />
            </button>

          </CardContent>
        
        </div>
      </Card>
      
    </div>
  );
};

export default Notification;