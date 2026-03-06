'use client';
import { useEffect, useState } from 'react';
import { useTrialTimer } from '@/lib/useTrialTimer';

interface SessionGuardProps {
  trialStartedAt: string | null;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'past_due';
  children: React.ReactNode;
}

export function SessionGuard({ trialStartedAt, subscriptionStatus, children }: SessionGuardProps) {
  const { timeRemaining, formatted, isExpired, toast, status } = useTrialTimer(trialStartedAt);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isExpired && subscriptionStatus === 'trial') {
      setShowOverlay(true);
    }
  }, [isExpired, subscriptionStatus]);

  if (showOverlay) {
    return (
      <div className="fixed inset-0 bg-void/95 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="glass max-w-sm p-8 text-center">
          <div className="text-3xl mb-4">⏰</div>
          <h2 className="font-orbitron text-2xl font-bold neon-text mb-4">TRIAL EXPIRED</h2>
          <p className="text-neon-cyan/80 mb-6">Your free trial has ended. Subscribe to continue using NEON21.</p>
          <button
            onClick={() => window.location.href = '/subscribe'}
            className="w-full bg-neon-cyan text-void font-orbitron font-bold py-3 rounded hover:bg-neon-cyan/80 transition-all"
          >
            SUBSCRIBE NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <>  
      {subscriptionStatus === 'trial' && (
        <div className={`fixed top-4 right-4 glass px-4 py-2 rounded font-mono text-sm z-40 ${
          status === 'critical' ? 'border-neon-magenta text-neon-magenta' :
          status === 'warning' ? 'border-neon-amber text-neon-amber' :
          'border-neon-cyan text-neon-cyan'
        }`}>  
          <div className="flex items-center gap-2">
            <span>⏱ Trial: {formatted}</span>
          </div>
        </div>
      )}  

      {toast && (
        <div className={`fixed top-20 right-4 glass px-4 py-3 rounded font-mono text-sm z-40 ${
          toast.type === 'error' ? 'border-neon-magenta text-neon-magenta' : 'border-neon-amber text-neon-amber'
        }`}>  
          {toast.message}
        </div>
      )}  

      {isExpired && subscriptionStatus === 'trial' && (
        <div className="pointer-events-none opacity-30">
          {children}
        </div>
      )}  

      {!isExpired || subscriptionStatus !== 'trial' && (
        {children}
      )}  
    </>
  );
}