import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const newSocket = io(backendUrl, {
                reconnection: true,
            });

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user.id || user._id);
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            // Global socket events for toast notifications
            newSocket.on('emergency_created', (data) => {
                toast.error(`CRITICAL: Blood request for ${data.request.bloodGroup} nearby!`, {
                    duration: 6000,
                    icon: '🚨',
                });
            });

            newSocket.on('request_accepted', (data) => {
                toast.success(`Donor ${data.request.matchedDonor?.name || 'found'} accepted your request!`, {
                    duration: 5000,
                });
            });

            newSocket.on('request_completed', (data) => {
                if (data.request.status === 'cancelled') {
                    toast('Emergency request was cancelled by the medical staff.', {
                        duration: 5000,
                        icon: '⚠️',
                    });
                } else {
                    toast.success('Your donation has been confirmed. Thank you!', {
                        duration: 5000,
                        icon: '❤️',
                    });
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
