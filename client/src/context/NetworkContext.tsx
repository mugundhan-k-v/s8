import React, { createContext, useContext, useEffect, useState } from 'react';

interface NetworkContextType {
    isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType>({ isOnline: true });

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check (in case of Electron weirdness or fast switching)
        // Optional: Poll or check via specific API if generic navigator check fails

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ isOnline }}>
            {children}
        </NetworkContext.Provider>
    );
};
