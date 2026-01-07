import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }) => {
    const [activeRequests, setActiveRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setActiveRequests(prev => {
            const newCount = prev + 1;
            setIsLoading(newCount > 0);
            return newCount;
        });
    };

    const stopLoading = () => {
        setActiveRequests(prev => {
            const newCount = Math.max(0, prev - 1);
            setIsLoading(newCount > 0);
            return newCount;
        });
    };

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
            {/* Global Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
                        {/* Spinner */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        {/* Text */}
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">Processing...</p>
                            <p className="text-sm text-slate-500 mt-1">Please wait</p>
                        </div>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};
