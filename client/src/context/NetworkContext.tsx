import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CENTRAL_SERVER_URL = 'http://localhost:5000';
const POLL_INTERVAL_MS = 10_000; // Check every 10 seconds

interface NetworkContextType {
    isOnline: boolean;        // true = Central Server is reachable
    isCentralUp: boolean;     // alias for isOnline, more semantic
}

const NetworkContext = createContext<NetworkContextType>({ isOnline: false, isCentralUp: false });

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCentralUp, setIsCentralUp] = useState(false);

    const checkCentralServer = useCallback(async () => {
        try {
            const res = await fetch(`${CENTRAL_SERVER_URL}/`, {
                method: 'GET',
                signal: AbortSignal.timeout(4000), // 4s timeout
                cache: 'no-store',
            });
            setIsCentralUp(res.ok);
        } catch {
            setIsCentralUp(false);
        }
    }, []);

    useEffect(() => {
        // Check immediately on mount
        checkCentralServer();

        // Then poll every 10 seconds
        const interval = setInterval(checkCentralServer, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [checkCentralServer]);

    return (
        <NetworkContext.Provider value={{ isOnline: isCentralUp, isCentralUp }}>
            {children}
        </NetworkContext.Provider>
    );
};
