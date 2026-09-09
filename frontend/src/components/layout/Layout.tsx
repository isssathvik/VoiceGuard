import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer, ToastMessage } from '../common/Toast';

interface LayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSafeDemo: () => void;
  onOpenFakeDemo: () => void;
  onOpenSIHDemo: () => void;
  onOpenScenarioModal: () => void;
  onOpenNewAnalysis: () => void;
  onOpenNewReport: () => void;
  onGoToLanding: () => void;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  totalCalls?: number;
  blockedCalls?: number;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentView,
  onNavigate,
  onOpenSafeDemo,
  onOpenFakeDemo,
  onOpenSIHDemo,
  onOpenScenarioModal,
  onOpenNewAnalysis,
  onOpenNewReport,
  onGoToLanding,
  toasts,
  onDismissToast,
  totalCalls,
  blockedCalls,
  children,
}) => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative selection:bg-purple-500 selection:text-white">
      {/* Background Cyber Grid / Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_50%_at_90%_90%,rgba(6,182,212,0.06),rgba(0,0,0,0))]" />

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenSafeDemo={onOpenSafeDemo}
        onOpenFakeDemo={onOpenFakeDemo}
        onOpenSIHDemo={onOpenSIHDemo}
        onOpenScenarioModal={onOpenScenarioModal}
        onGoToLanding={onGoToLanding}
        totalCalls={totalCalls}
        blockedCalls={blockedCalls}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          currentView={currentView}
          onNavigate={onNavigate}
          onOpenNewAnalysis={onOpenNewAnalysis}
          onOpenNewReport={onOpenNewReport}
          onOpenSIHDemo={onOpenSIHDemo}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
};
