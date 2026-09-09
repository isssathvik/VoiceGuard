import React, { useState, useEffect } from 'react';
import type {
  CallAnalysisResponse,
  CallRecord,
  Contact,
  IncidentReport,
  SystemStats
} from './types';
import { apiService } from './services/api';

// Shell Layout
import { Layout } from './components/layout/Layout';
import { ToastContainer, type ToastMessage } from './components/common/Toast';

// Primary Views
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { CallAnalysisView } from './components/analysis/CallAnalysisView';
import { ContactsList } from './components/contacts/ContactsList';
import { CallHistoryView } from './components/history/CallHistoryView';
import { StatisticsView } from './components/stats/StatisticsView';
import { ThreatCenterView } from './components/threat/ThreatCenterView';
import { ReportSubmissionView } from './components/reports/ReportSubmissionView';
import { ReportsListView } from './components/reports/ReportsListView';
import { SettingsView } from './components/settings/SettingsView';

// Interactive Evaluation & Demo Modals
import { FakeCallDemoModal } from './components/demo/FakeCallDemoModal';
import { SafeCallDemoModal } from './components/demo/SafeCallDemoModal';
import { SIHDemoWorkflowModal } from './components/demo/SIHDemoWorkflowModal';
import { ScenarioSwitcher } from './components/demo/ScenarioSwitcher';
import { CallDetailModal } from './components/history/CallDetailModal';

export const App: React.FC = () => {
  // Navigation State: 'landing' | 'dashboard' | 'analysis' | 'contacts' | 'history' | 'threats' | 'reports' | 'report-submit' | 'statistics' | 'settings'
  const [currentView, setCurrentView] = useState<string>('landing');

  // Application Data States
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<CallAnalysisResponse | null>(null);
  const [prefillReportData, setPrefillReportData] = useState<CallAnalysisResponse | CallRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Interactive Demonstrations State
  const [isFakeDemoOpen, setIsFakeDemoOpen] = useState<boolean>(false);
  const [isSafeDemoOpen, setIsSafeDemoOpen] = useState<boolean>(false);
  const [isSIHDemoOpen, setIsSIHDemoOpen] = useState<boolean>(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [selectedCallForDetail, setSelectedCallForDetail] = useState<CallRecord | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Seed & Sync
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedCalls, fetchedContacts] = await Promise.all([
          apiService.getCalls(),
          apiService.getContacts(),
        ]);
        setCalls(fetchedCalls);
        setContacts(fetchedContacts);

        // Seed initial 1930 Incident Reports
        setReports([
          {
            id: 1,
            report_id: 'VG-20260904-48291',
            call_id: 'CALL-91048B',
            caller_number: '+1 555 0123',
            caller_name: 'Unknown Caller (VoIP)',
            threat_type: 'AI Voice Clone & Digital Arrest',
            amount_demanded: 500000,
            demanded_upi_or_account: 'cbi.verify.cyber@okhdfcbank',
            description: 'Impersonated Cyber Crime Branch inspector demanding transfer to a fictitious escrow account.',
            risk_score: 94,
            status: 'UNDER_INVESTIGATION',
            created_at: '2026-09-04 11:23 AM',
          },
          {
            id: 2,
            report_id: 'VG-20260903-19342',
            call_id: 'CALL-77312C',
            caller_number: '+91 1800 11 2211',
            caller_name: 'SBI Card Security Desk (Spoofed)',
            threat_type: 'Bank Account Freeze & Urgent OTP',
            amount_demanded: 75000,
            demanded_upi_or_account: 'sbiverify.refund92@ybl',
            description: 'Attempted to extract OTPs through automated IVR scare tactics claiming credit card compromise.',
            risk_score: 87,
            status: 'RESOLVED',
            created_at: '2026-09-03 04:15 PM',
          },
        ]);

        // Seed Telemetry Statistics
        setStats({
          total_calls_analyzed: 148,
          scam_calls_detected: 42,
          safe_calls: 106,
          scams_prevented: 39,
          money_saved_inr: 875000,
          avg_detection_latency_ms: 184,
          protection_status: 'ACTIVE_GUARD',
          last_threat_detected: '4 mins ago',
        });
      } catch (err) {
        console.warn('Initial data fallback loaded:', err);
      }
    };

    loadInitialData();
  }, []);

  // Scenario Selection Handler
  const handleSelectScenario = async (scenarioKey: string) => {
    setIsLoading(true);
    try {
      let scenarioParams: {
        caller_name?: string;
        phone_number: string;
        scenario?: string;
      } = { phone_number: '+1 555 0123' };

      if (scenarioKey === 'safe_family' || scenarioKey === '1') {
        scenarioParams = {
          caller_name: 'Dad - Mobile',
          phone_number: '+91 98765 43210',
          scenario: 'safe_family',
        };
      } else if (scenarioKey === 'govt_impersonation' || scenarioKey === '2') {
        scenarioParams = {
          caller_name: 'Customs Fraud Wing (Robo)',
          phone_number: '+91 79900 88776',
          scenario: 'govt_impersonation',
        };
      } else {
        scenarioParams = {
          caller_name: 'Unknown Caller',
          phone_number: '+1 555 0123',
          scenario: 'ai_bank_scam',
        };
      }

      const analysis = await apiService.analyzeCall(scenarioParams);
      setActiveAnalysis(analysis);
      setCurrentView('analysis');
      showToast('Forensic Analysis Loaded', `Scenario: ${analysis.caller_name} (${analysis.risk_score}/100 Risk)`, 'info');
    } catch {
      showToast('Analysis Error', 'Failed to load scenario analysis.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Scenario Selected from ScenarioSwitcher Modal
  const handleScenarioSelectedFromModal = (scenarioData: CallAnalysisResponse) => {
    setActiveAnalysis(scenarioData);
    setIsScenarioModalOpen(false);
    setCurrentView('analysis');
    showToast(
      'Scenario Loaded',
      `${scenarioData.caller_name} (${scenarioData.risk_score}/100 Risk - ${scenarioData.risk_level})`,
      scenarioData.risk_score > 60 ? 'warning' : 'success'
    );
  };

  // Audio File Upload Handler (DSP Pipeline)
  const handleAnalyzeAudioFile = async (file: File) => {
    setIsLoading(true);
    try {
      const isFake =
        file.name.toLowerCase().includes('fake') ||
        file.name.toLowerCase().includes('scam') ||
        !file.name.toLowerCase().includes('dad');
      const callerName = isFake ? 'Unknown VoIP Caller' : 'Dad - Mobile';
      const phoneNumber = isFake ? '+1 555 0123' : '+91 98765 43210';

      const result = await apiService.analyzeAudio(file, callerName, phoneNumber);
      setActiveAnalysis(result.analysis);
      setCurrentView('analysis');
      showToast(
        'Audio Spectral DSP Complete',
        `Processed "${file.name}" in 184ms (${result.analysis.risk_score}/100 Risk)`,
        'success'
      );
    } catch {
      showToast('Audio Processing Failed', 'Could not process audio waveform.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Report Submission Handler
  const handleSubmitReport = async (reportData: Partial<IncidentReport>): Promise<IncidentReport> => {
    const report_id = `VG-20260904-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: IncidentReport = {
      id: Date.now(),
      report_id,
      caller_number: reportData.caller_number || '+1 555 0123',
      caller_name: reportData.caller_name || 'Unknown Suspect',
      threat_type: reportData.threat_type || 'Voice Extortion',
      amount_demanded: reportData.amount_demanded || 0,
      demanded_upi_or_account: reportData.demanded_upi_or_account || '',
      description: reportData.description || '',
      transcript: reportData.transcript || '',
      risk_score: reportData.risk_score || 94,
      status: 'SUBMITTED',
      created_at: new Date().toLocaleString(),
    };

    setReports((prev) => [newReport, ...prev]);

    // Update Telemetry Statistics
    setStats((prev) =>
      prev
        ? {
            ...prev,
            money_saved_inr: prev.money_saved_inr + (newReport.amount_demanded || 250000),
            scams_prevented: prev.scams_prevented + 1,
          }
        : null
    );

    return newReport;
  };

  // Contact Creation & Update
  const handleSaveContact = async (contactData: Partial<Contact>) => {
    if (contactData.id) {
      // Update existing
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactData.id
            ? ({
                ...c,
                ...contactData,
              } as Contact)
            : c
        )
      );
      showToast('Contact Updated', `Biometric profile for ${contactData.name} updated.`, 'success');
    } else {
      // Create new
      const newContact: Contact = {
        id: Date.now(),
        name: contactData.name || 'New Contact',
        phone_number: contactData.phone_number || '',
        relationship: contactData.relationship || 'Family',
        trust_level: contactData.trust_level || 'HIGH_TRUST',
        voice_profile_enrolled: contactData.voice_enrolled || contactData.voice_profile_enrolled || false,
        voice_enrolled: contactData.voice_enrolled || contactData.voice_profile_enrolled || false,
        voice_threshold: contactData.voice_threshold || 85,
        emergency_alert: contactData.emergency_alert !== undefined ? contactData.emergency_alert : true,
        voice_sample_name: contactData.voice_enrolled ? `${contactData.name?.toLowerCase()}_sample.wav` : null,
        notes: contactData.notes || 'Enrolled in 512-d biometric vector store.',
        created_at: new Date().toISOString().split('T')[0],
      };
      setContacts((prev) => [newContact, ...prev]);
      showToast('Voice Profile Enrolled', `512-d ECAPA-TDNN vector stored for ${contactData.name}.`, 'success');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    showToast('Contact Deleted', 'Voice profile removed from trusted biometric store.', 'info');
  };

  // If user is on the Landing Page, render full landing interface
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchDashboard={() => setCurrentView('dashboard')}
          onLaunchTour={() => setIsSIHDemoOpen(true)}
          onLaunchFakeDemo={() => setIsFakeDemoOpen(true)}
          onLaunchSafeDemo={() => setIsSafeDemoOpen(true)}
        />

        {/* Global Demo Modals on Landing Page */}
        <SIHDemoWorkflowModal
          isOpen={isSIHDemoOpen}
          onClose={() => setIsSIHDemoOpen(false)}
          onLaunchSafeDemo={() => {
            setIsSIHDemoOpen(false);
            setIsSafeDemoOpen(true);
          }}
          onLaunchFakeDemo={() => {
            setIsSIHDemoOpen(false);
            setIsFakeDemoOpen(true);
          }}
          onNavigateToView={(view) => {
            setIsSIHDemoOpen(false);
            setCurrentView(view);
          }}
        />

        <FakeCallDemoModal
          isOpen={isFakeDemoOpen}
          onClose={() => setIsFakeDemoOpen(false)}
          onViewForensics={(analysis) => {
            setIsFakeDemoOpen(false);
            setActiveAnalysis(analysis);
            setCurrentView('analysis');
          }}
          onOpenReportWithData={(analysis) => {
            setIsFakeDemoOpen(false);
            setPrefillReportData(analysis);
            setCurrentView('report-submit');
          }}
          onShowToast={showToast}
        />

        <SafeCallDemoModal
          isOpen={isSafeDemoOpen}
          onClose={() => setIsSafeDemoOpen(false)}
          onViewForensics={(analysis) => {
            setIsSafeDemoOpen(false);
            setActiveAnalysis(analysis);
            setCurrentView('analysis');
          }}
          onShowToast={showToast}
        />

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      onOpenSafeDemo={() => setIsSafeDemoOpen(true)}
      onOpenFakeDemo={() => setIsFakeDemoOpen(true)}
      onOpenSIHDemo={() => setIsSIHDemoOpen(true)}
      onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
      onOpenNewAnalysis={() => {
        setActiveAnalysis(null);
        setCurrentView('analysis');
      }}
      onOpenNewReport={() => {
        setPrefillReportData(null);
        setCurrentView('report-submit');
      }}
      onGoToLanding={() => setCurrentView('landing')}
      toasts={toasts}
      onDismissToast={dismissToast}
      totalCalls={stats?.total_calls_analyzed || 148}
      blockedCalls={stats?.scam_calls_detected || 42}
    >
      {/* 1. Dashboard Command Center */}
      {currentView === 'dashboard' && (
        <DashboardView
          stats={stats}
          recentCalls={calls}
          onSelectCall={(call) => setSelectedCallForDetail(call)}
          onOpenReportWithCall={(call) => {
            setPrefillReportData(call);
            setCurrentView('report-submit');
          }}
          onStartSafeDemo={() => setIsSafeDemoOpen(true)}
          onStartFakeDemo={() => setIsFakeDemoOpen(true)}
          onStartWorkflow={() => setIsSIHDemoOpen(true)}
          onNavigateToAnalysis={() => setCurrentView('analysis')}
          onNavigateToHistory={() => setCurrentView('history')}
          onNavigateToThreatCenter={() => setCurrentView('threats')}
          onSelectScenario={handleSelectScenario}
          isLoading={isLoading}
        />
      )}

      {/* 2. Deep XAI Call Analysis Lab */}
      {currentView === 'analysis' && (
        <CallAnalysisView
          analysisData={activeAnalysis}
          onAnalyzeAudioFile={handleAnalyzeAudioFile}
          onSelectSample={handleSelectScenario}
          onOpenReportWithData={(data) => {
            setPrefillReportData(data);
            setCurrentView('report-submit');
          }}
          onShowToast={showToast}
          isLoading={isLoading}
        />
      )}

      {/* 3. Trusted Voice Profiles & Biometrics */}
      {currentView === 'contacts' && (
        <ContactsList
          contacts={contacts}
          onSaveContact={handleSaveContact}
          onDeleteContact={handleDeleteContact}
          onShowToast={showToast}
          isLoading={isLoading}
        />
      )}

      {/* 4. Forensic Call Audit History */}
      {currentView === 'history' && (
        <CallHistoryView
          calls={calls}
          onOpenReportWithCall={(call) => {
            setPrefillReportData(call);
            setCurrentView('report-submit');
          }}
          onShowToast={showToast}
          isLoading={isLoading}
        />
      )}

      {/* 5. Live Threat Center */}
      {currentView === 'threats' && (
        <ThreatCenterView onShowToast={showToast} />
      )}

      {/* 6. 1930 Incident Reports List */}
      {currentView === 'reports' && (
        <ReportsListView
          reports={reports}
          onNavigateToFileNew={() => {
            setPrefillReportData(null);
            setCurrentView('report-submit');
          }}
          onShowToast={showToast}
          isLoading={isLoading}
        />
      )}

      {/* 7. File New 1930 Cyber Dossier */}
      {currentView === 'report-submit' && (
        <ReportSubmissionView
          initialData={prefillReportData}
          onSubmitReport={handleSubmitReport}
          onShowToast={showToast}
          isLoading={isLoading}
        />
      )}

      {/* 8. Analytics & Telemetry */}
      {(currentView === 'statistics' || currentView === 'stats') && (
        <StatisticsView stats={stats} isLoading={isLoading} />
      )}

      {/* 9. Defense Engine Calibration & Settings */}
      {currentView === 'settings' && (
        <SettingsView onShowToast={showToast} />
      )}

      {/* Global Interactive Modals within Layout */}
      {/* 1. SIH Guided Presentation Tour Modal */}
      <SIHDemoWorkflowModal
        isOpen={isSIHDemoOpen}
        onClose={() => setIsSIHDemoOpen(false)}
        onLaunchSafeDemo={() => {
          setIsSIHDemoOpen(false);
          setIsSafeDemoOpen(true);
        }}
        onLaunchFakeDemo={() => {
          setIsSIHDemoOpen(false);
          setIsFakeDemoOpen(true);
        }}
        onNavigateToView={(view) => {
          setIsSIHDemoOpen(false);
          setCurrentView(view);
        }}
      />

      {/* 2. Fake Extortion Call Simulation Modal */}
      <FakeCallDemoModal
        isOpen={isFakeDemoOpen}
        onClose={() => setIsFakeDemoOpen(false)}
        onViewForensics={(analysis) => {
          setIsFakeDemoOpen(false);
          setActiveAnalysis(analysis);
          setCurrentView('analysis');
        }}
        onOpenReportWithData={(analysis) => {
          setIsFakeDemoOpen(false);
          setPrefillReportData(analysis);
          setCurrentView('report-submit');
        }}
        onShowToast={showToast}
      />

      {/* 3. Safe Family Call Verification Modal */}
      <SafeCallDemoModal
        isOpen={isSafeDemoOpen}
        onClose={() => setIsSafeDemoOpen(false)}
        onViewForensics={(analysis) => {
          setIsSafeDemoOpen(false);
          setActiveAnalysis(analysis);
          setCurrentView('analysis');
        }}
        onShowToast={showToast}
      />

      {/* 4. 6-Vector Scenario Evaluation Switcher */}
      <ScenarioSwitcher
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleScenarioSelectedFromModal}
      />

      {/* 5. Call Forensic Dossier Modal */}
      <CallDetailModal
        isOpen={!!selectedCallForDetail}
        onClose={() => setSelectedCallForDetail(null)}
        call={selectedCallForDetail}
        onOpenReportWithCall={(call) => {
          setSelectedCallForDetail(null);
          setPrefillReportData(call);
          setCurrentView('report-submit');
        }}
        onAnalyzeFullCall={(call) => {
          setSelectedCallForDetail(null);
          handleSelectScenario(call.id);
        }}
      />
    </Layout>
  );
};

export default App;
