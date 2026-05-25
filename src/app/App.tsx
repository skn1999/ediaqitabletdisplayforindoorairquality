import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Thermometer, Droplets, AlertCircle, TrendingDown, CheckCircle, ClipboardList, Lightbulb, Clock, Wrench, Calendar, AlertTriangle, BarChart3, Radio, ThumbsUp, Minus, XCircle, XOctagon, Smile } from 'lucide-react';

type ScreenState = 'ambient' | 'ambient-info' | 'ambient-ticket-active' | 'ambient-ticket-resolved' | 'action' | 'recovery' | 'escalate' | 'confirmation' | 'summary-classroom' | 'summary-office';
type TicketStatus = 'received' | 'in-progress' | 'resolved' | null;
type AirQualityLevel = 'buona' | 'accettabile' | 'mediocre' | 'scadente' | 'insalubre' | 'pessima';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('ambient');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [optionalNote, setOptionalNote] = useState('');
  const [ticketId] = useState('AQ-203');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(null);
  const [airQualityLevel, setAirQualityLevel] = useState<AirQualityLevel>('buona');
  const [windowsOpened, setWindowsOpened] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getBackgroundGradient = () => {
    // For ambient screens, use air quality level
    if (currentScreen === 'ambient' || currentScreen === 'ambient-info' || currentScreen === 'ambient-ticket-active' || currentScreen === 'ambient-ticket-resolved') {
      switch (airQualityLevel) {
        case 'buona':
          return 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)';
        case 'accettabile':
          return 'linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)';
        case 'mediocre':
          return 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)';
        case 'scadente':
          return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
        case 'insalubre':
          return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
        case 'pessima':
          return 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
        default:
          return 'var(--aq-ok-bg)';
      }
    }

    switch (currentScreen) {
      case 'action':
        return 'var(--aq-warning-bg)';
      case 'recovery':
        return 'var(--aq-recovery-bg)';
      case 'escalate':
      case 'confirmation':
      case 'summary-classroom':
      case 'summary-office':
        return 'var(--aq-neutral-bg)';
      default:
        return 'var(--aq-ok-bg)';
    }
  };

  const cycleAmbientScreens = () => {
    if (ticketStatus === 'in-progress') {
      setCurrentScreen('ambient-ticket-active');
    } else if (ticketStatus === 'resolved') {
      setCurrentScreen('ambient-ticket-resolved');
    } else {
      if (currentScreen === 'ambient') {
        setCurrentScreen('ambient-info');
      } else {
        setCurrentScreen('ambient');
      }
    }
  };

  return (
    <div
      className="w-full h-screen overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: 'var(--font-body)',
        background: getBackgroundGradient(),
        transition: 'background 0.8s ease'
      }}
    >
      {/* Scrollable portrait tablet container */}
      <div className="w-full max-w-[768px] h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentScreen === 'ambient' && (
            <AmbientStatus
              key="ambient"
              currentTime={formatTime(currentTime)}
              airQualityLevel={airQualityLevel}
              onTransition={() => setCurrentScreen('action')}
              onCycle={cycleAmbientScreens}
              onViewSummary={() => setCurrentScreen('summary-classroom')}
              onLevelChange={setAirQualityLevel}
            />
          )}
          {currentScreen === 'ambient-info' && (
            <AmbientInfoLayer
              key="ambient-info"
              currentTime={formatTime(currentTime)}
              onTransition={() => setCurrentScreen('action')}
              onCycle={cycleAmbientScreens}
              onViewSummary={() => setCurrentScreen('summary-classroom')}
            />
          )}
          {currentScreen === 'ambient-ticket-active' && (
            <AmbientWithTicket
              key="ambient-ticket-active"
              currentTime={formatTime(currentTime)}
              ticketId={ticketId}
              ticketStatus="in-progress"
              onTransition={() => setCurrentScreen('action')}
              onCycle={cycleAmbientScreens}
              onViewSummary={() => setCurrentScreen('summary-office')}
            />
          )}
          {currentScreen === 'ambient-ticket-resolved' && (
            <AmbientWithTicket
              key="ambient-ticket-resolved"
              currentTime={formatTime(currentTime)}
              ticketId={ticketId}
              ticketStatus="resolved"
              onTransition={() => setCurrentScreen('action')}
              onCycle={cycleAmbientScreens}
              onViewSummary={() => setCurrentScreen('summary-office')}
            />
          )}
          {currentScreen === 'action' && (
            <ActionNeeded
              key="action"
              currentTime={formatTime(currentTime)}
              onWindowsOpened={() => {
                setWindowsOpened(true);
                setCurrentScreen('recovery');
              }}
              onReportIssue={() => setCurrentScreen('escalate')}
            />
          )}
          {currentScreen === 'recovery' && (
            <RecoveryCheck
              key="recovery"
              currentTime={formatTime(currentTime)}
              windowsOpened={windowsOpened}
              onImproving={() => {
                setCurrentScreen('ambient');
                setTicketStatus(null);
              }}
              onNotImproving={() => setCurrentScreen('escalate')}
            />
          )}
          {currentScreen === 'escalate' && (
            <EscalateIssue
              key="escalate"
              currentTime={formatTime(currentTime)}
              optionalNote={optionalNote}
              setOptionalNote={setOptionalNote}
              onSubmit={() => {
                setTicketStatus('in-progress');
                setCurrentScreen('confirmation');
              }}
              onCancel={() => setCurrentScreen(currentScreen === 'ambient' ? 'ambient' : 'recovery')}
            />
          )}
          {currentScreen === 'confirmation' && (
            <IssueConfirmation
              key="confirmation"
              currentTime={formatTime(currentTime)}
              ticketId={ticketId}
              onDone={() => setCurrentScreen('ambient-ticket-active')}
            />
          )}
          {currentScreen === 'summary-classroom' && (
            <RoomSummary
              key="summary-classroom"
              currentTime={formatTime(currentTime)}
              variant="classroom"
              onBack={() => setCurrentScreen('ambient')}
            />
          )}
          {currentScreen === 'summary-office' && (
            <RoomSummary
              key="summary-office"
              currentTime={formatTime(currentTime)}
              variant="office"
              onBack={() => setCurrentScreen('ambient-ticket-active')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Helper (for demo) - Left side portrait */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 px-2 py-3 rounded-2xl bg-black/70 backdrop-blur-sm z-50">
        <NavButton active={currentScreen.startsWith('ambient')} onClick={() => setCurrentScreen('ambient')}>
          A
        </NavButton>
        <NavButton active={currentScreen === 'action'} onClick={() => setCurrentScreen('action')}>
          !
        </NavButton>
        <NavButton active={currentScreen === 'recovery'} onClick={() => setCurrentScreen('recovery')}>
          R
        </NavButton>
        <NavButton active={currentScreen === 'escalate'} onClick={() => setCurrentScreen('escalate')}>
          E
        </NavButton>
        <NavButton
          active={currentScreen === 'ambient-ticket-active'}
          onClick={() => {
            setTicketStatus('in-progress');
            setCurrentScreen('ambient-ticket-active');
          }}
        >
          T
        </NavButton>
        <NavButton active={currentScreen.startsWith('summary')} onClick={() => setCurrentScreen('summary-classroom')}>
          S
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center"
      style={{
        background: active ? 'white' : 'transparent',
        color: active ? 'black' : 'white',
        fontFamily: 'var(--font-display)'
      }}
    >
      {children}
    </button>
  );
}

interface AmbientStatusProps {
  currentTime: string;
  airQualityLevel: AirQualityLevel;
  onTransition: () => void;
  onCycle: () => void;
  onViewSummary: () => void;
  onLevelChange: (level: AirQualityLevel) => void;
}

function AmbientStatus({ currentTime, airQualityLevel, onTransition, onCycle, onViewSummary, onLevelChange }: AmbientStatusProps) {
  // Get data based on air quality level
  const getLevelData = () => {
    switch (airQualityLevel) {
      case 'buona':
        return {
          statusText: 'Aria buona',
          description: 'La qualità dell\'aria in questa stanza è stabile',
          co2: '680',
          chatBubble: 'Tutto ok qui!',
          avatarType: 'relaxed' as const,
          color: '#10b981',
          icon: Smile
        };
      case 'accettabile':
        return {
          statusText: 'Aria accettabile',
          description: 'La qualità dell\'aria è nella norma',
          co2: '950',
          chatBubble: 'Va tutto bene!',
          avatarType: 'relaxed' as const,
          color: '#84cc16',
          icon: ThumbsUp
        };
      case 'mediocre':
        return {
          statusText: 'Aria mediocre',
          description: 'La qualità dell\'aria potrebbe migliorare',
          co2: '1200',
          chatBubble: 'Potrebbe essere meglio',
          avatarType: 'neutral' as const,
          color: '#eab308',
          icon: Minus
        };
      case 'scadente':
        return {
          statusText: 'Aria scadente',
          description: 'Si consiglia di ventilare la stanza',
          co2: '1450',
          chatBubble: 'Meglio arieggiare!',
          avatarType: 'concerned' as const,
          color: '#f59e0b',
          icon: AlertTriangle
        };
      case 'insalubre':
        return {
          statusText: 'Aria insalubre',
          description: 'È necessario intervenire subito',
          co2: '1800',
          chatBubble: 'Apri le finestre ora!',
          avatarType: 'concerned' as const,
          color: '#ef4444',
          icon: XCircle
        };
      case 'pessima':
        return {
          statusText: 'Aria pessima',
          description: 'Situazione critica - evacuare la stanza',
          co2: '2200',
          chatBubble: 'Emergenza! Esci subito!',
          avatarType: 'concerned' as const,
          color: '#dc2626',
          icon: XOctagon
        };
    }
  };

  const levelData = getLevelData();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} onRoomClick={onCycle} onSummaryClick={onViewSummary} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-12"
      >
        <div className="relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-10"
          >
            {levelData.avatarType === 'relaxed' && <AvatarRelaxed color={levelData.color} />}
            {levelData.avatarType === 'neutral' && <AvatarNeutral color={levelData.color} />}
            {levelData.avatarType === 'concerned' && <AvatarConcerned color={levelData.color} />}
          </motion.div>
          <IconBubble icon={levelData.icon} color={levelData.color} delay={0.6} side="left" />
          <ChatBubble text={levelData.chatBubble} delay={0.8} side="right" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4.5rem',
            fontWeight: 800,
            color: levelData.color,
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}
        >
          {levelData.statusText}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: 'var(--aq-text-secondary)',
            lineHeight: 1.6,
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          {levelData.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-2xl px-8"
        >
          <AirQualitySlider currentLevel={airQualityLevel} onLevelChange={onLevelChange} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <MetricCard icon={Wind} label="CO2" value={levelData.co2} unit="ppm" status={airQualityLevel === 'buona' || airQualityLevel === 'accettabile' ? 'good' : 'warning'} />
        <MetricCard icon={Thermometer} label="Temperatura" value="21" unit="°C" status="good" />
        <MetricCard icon={Droplets} label="Umidità" value="46" unit="%" status="good" />
        <MetricCard icon={Wind} label="TVOC" value="basso" unit="" status="good" isQualitative />
      </motion.div>

      <Footer delay={0.9} onAction={onTransition} />
    </motion.div>
  );
}

interface AmbientInfoLayerProps {
  currentTime: string;
  onTransition: () => void;
  onCycle: () => void;
  onViewSummary: () => void;
}

function AmbientInfoLayer({ currentTime, onTransition, onCycle, onViewSummary }: AmbientInfoLayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} onRoomClick={onCycle} onSummaryClick={onViewSummary} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-10"
      >
        <div className="relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-10"
          >
            <AvatarRelaxed />
          </motion.div>
          <ChatBubble text="Si respira bene!" delay={0.8} side="left" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4.5rem',
            fontWeight: 800,
            color: 'var(--aq-ok-primary)',
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}
        >
          Aria buona
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: 'var(--aq-text-secondary)',
            lineHeight: 1.6,
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          La qualità dell'aria in questa stanza è stabile
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-lg mb-8"
        >
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'rgba(209, 250, 229, 0.4)',
              border: '2px solid rgba(5, 150, 105, 0.25)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--aq-ok-soft)',
                    border: '2px solid var(--aq-ok-primary)'
                  }}
                >
                  <Lightbulb size={24} color="var(--aq-ok-primary)" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--aq-ok-primary)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Lo sapevi?
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'var(--aq-text-primary)',
                    lineHeight: 1.5
                  }}
                >
                  Una buona ventilazione aiuta attenzione e comfort
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-10"
      >
        <MetricCard icon={Wind} label="CO2" value="680" unit="ppm" status="good" />
        <MetricCard icon={Thermometer} label="Temperatura" value="21" unit="°C" status="good" />
        <MetricCard icon={Droplets} label="Umidità" value="46" unit="%" status="good" />
        <MetricCard icon={Wind} label="TVOC" value="basso" unit="" status="good" isQualitative />
      </motion.div>

      <Footer delay={0.9} onAction={onTransition} />
    </motion.div>
  );
}

interface AmbientWithTicketProps {
  currentTime: string;
  ticketId: string;
  ticketStatus: 'in-progress' | 'resolved';
  onTransition: () => void;
  onCycle: () => void;
  onViewSummary: () => void;
}

function AmbientWithTicket({ currentTime, ticketId, ticketStatus, onTransition, onCycle, onViewSummary }: AmbientWithTicketProps) {
  const isResolved = ticketStatus === 'resolved';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Ufficio 3.12" location="Terzo piano" time={currentTime} onRoomClick={onCycle} onSummaryClick={onViewSummary} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-10"
      >
        <div className="relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-10"
          >
            <AvatarRelaxed />
          </motion.div>
          <ChatBubble text={isResolved ? "Tutto risolto!" : "Aria buona!"} delay={0.8} side="right" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4.5rem',
            fontWeight: 800,
            color: 'var(--aq-ok-primary)',
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}
        >
          Aria buona
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: 'var(--aq-text-secondary)',
            lineHeight: 1.6,
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          La qualità dell'aria in questa stanza è stabile
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-lg mb-6"
        >
          <div
            className="p-5 rounded-2xl"
            style={{
              background: isResolved
                ? 'rgba(209, 250, 229, 0.5)'
                : 'rgba(224, 242, 254, 0.5)',
              border: isResolved
                ? '2px solid rgba(5, 150, 105, 0.3)'
                : '2px solid rgba(8, 145, 178, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: isResolved ? 'var(--aq-ok-soft)' : 'rgba(6, 182, 212, 0.2)',
                    border: isResolved
                      ? '2px solid var(--aq-ok-primary)'
                      : '2px solid #0891b2'
                  }}
                >
                  {isResolved ? (
                    <CheckCircle size={20} color="var(--aq-ok-primary)" strokeWidth={2.5} />
                  ) : (
                    <Wrench size={20} color="#0891b2" strokeWidth={2.5} />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: 'var(--aq-text-primary)',
                      lineHeight: 1.2
                    }}
                  >
                    {isResolved ? 'Segnalazione chiusa' : 'Segnalazione attiva'}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--aq-text-secondary)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    ID #{ticketId}
                  </div>
                </div>
              </div>
              <div
                className="px-4 py-2 rounded-full"
                style={{
                  background: isResolved ? '#d1fae5' : '#cffafe',
                  border: isResolved
                    ? '2px solid #10b981'
                    : '2px solid #0891b2'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: isResolved ? '#059669' : '#0891b2'
                  }}
                >
                  {isResolved ? 'Risolta' : 'In lavorazione'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-10"
      >
        <MetricCard icon={Wind} label="CO2" value="720" unit="ppm" status="good" />
        <MetricCard icon={Thermometer} label="Temperatura" value="22" unit="°C" status="good" />
        <MetricCard icon={Droplets} label="Umidità" value="45" unit="%" status="good" />
        <MetricCard icon={Wind} label="TVOC" value="basso" unit="" status="good" isQualitative />
      </motion.div>

      <Footer delay={0.9} onAction={onTransition} hideReportButton={!isResolved} />
    </motion.div>
  );
}

interface RoomSummaryProps {
  currentTime: string;
  variant: 'classroom' | 'office';
  onBack: () => void;
}

function RoomSummary({ currentTime, variant, onBack }: RoomSummaryProps) {
  const isClassroom = variant === 'classroom';
  const roomName = isClassroom ? 'Aula 2B' : 'Ufficio 3.12';
  const location = isClassroom ? 'Piano 2, Edificio A' : 'Terzo piano';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room={roomName} location={location} time={currentTime} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 mb-8"
      >
        {/* Title Section */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              boxShadow: '0 8px 24px rgba(71, 85, 105, 0.25)'
            }}
          >
            <Calendar size={40} color="white" strokeWidth={2} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.75rem',
              fontWeight: 800,
              color: 'var(--aq-text-primary)',
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.03em'
            }}
          >
            Riepilogo di oggi
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'var(--aq-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {isClassroom
              ? 'Oggi la stanza ha richiesto 2 interventi brevi di ventilazione'
              : 'Oggi è stata inviata 1 segnalazione per questa stanza'}
          </motion.p>
        </div>

        {/* Recap Cards */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="space-y-4 mb-8"
        >
          {isClassroom ? (
            <>
              <RecapCard
                icon={AlertTriangle}
                iconColor="#f59e0b"
                iconBg="rgba(245, 158, 11, 0.15)"
                label="2 avvisi qualità aria"
              />
              <RecapCard
                icon={Clock}
                iconColor="#64748b"
                iconBg="rgba(100, 116, 139, 0.15)"
                label="Ultimo avviso alle 12:05"
              />
              <RecapCard
                icon={CheckCircle}
                iconColor="#10b981"
                iconBg="rgba(16, 185, 129, 0.15)"
                label="Recupero completato"
              />
              <RecapCard
                icon={ClipboardList}
                iconColor="#64748b"
                iconBg="rgba(100, 116, 139, 0.15)"
                label="Nessuna segnalazione aperta"
              />
            </>
          ) : (
            <>
              <RecapCard
                icon={AlertTriangle}
                iconColor="#f59e0b"
                iconBg="rgba(245, 158, 11, 0.15)"
                label="1 avviso qualità aria"
              />
              <RecapCard
                icon={Clock}
                iconColor="#64748b"
                iconBg="rgba(100, 116, 139, 0.15)"
                label="Ultimo avviso alle 14:18"
              />
              <RecapCard
                icon={ClipboardList}
                iconColor="#0891b2"
                iconBg="rgba(8, 145, 178, 0.15)"
                label="Segnalazione inviata"
              />
              <RecapCard
                icon={Wrench}
                iconColor="#0891b2"
                iconBg="rgba(8, 145, 178, 0.15)"
                label="Stato: In lavorazione"
              />
            </>
          )}
        </motion.div>

        {/* Best Practice Note */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'rgba(209, 250, 229, 0.3)',
              border: '2px solid rgba(5, 150, 105, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Lightbulb size={20} color="#059669" strokeWidth={2.5} />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--aq-text-secondary)',
                  lineHeight: 1.5
                }}
              >
                Ventilare presto ha aiutato a riportare la stanza nei valori corretti
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <button
          className="w-full py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
            background: '#475569',
            boxShadow: '0 8px 24px rgba(71, 85, 105, 0.3)'
          }}
          onClick={onBack}
        >
          Torna alla schermata principale
        </button>
      </motion.div>
    </motion.div>
  );
}

function RecapCard({ icon: Icon, iconColor, iconBg, label }: { icon: React.ElementType; iconColor: string; iconBg: string; label: string }) {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.6)',
        border: '2px solid rgba(100, 116, 139, 0.15)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: iconBg
        }}
      >
        <Icon size={24} color={iconColor} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--aq-text-primary)',
            lineHeight: 1.4
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

interface ActionNeededProps {
  currentTime: string;
  onWindowsOpened: () => void;
  onReportIssue: () => void;
}

function ActionNeeded({ currentTime, onWindowsOpened, onReportIssue }: ActionNeededProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-10"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-10"
          >
            <AvatarConcerned />
          </motion.div>
          <ChatBubble text="Uffa! Apri le finestre!" delay={0.8} side="right" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--aq-warning-primary)',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
            textAlign: 'center'
          }}
        >
          Serve cambiare aria
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            lineHeight: 1.5,
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          La CO2 è alta in questa stanza
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-between gap-8 px-8 py-6 rounded-3xl mb-8 w-full max-w-3xl"
          style={{
            background: 'var(--aq-warning-soft)',
            border: '3px solid var(--aq-warning-secondary)'
          }}
        >
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3.5rem',
                fontWeight: 800,
                color: 'var(--aq-warning-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              1650
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--aq-warning-primary)',
                opacity: 0.8
              }}
            >
              ppm CO2
            </span>
          </div>

          <div className="flex flex-col items-end">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--aq-warning-primary)',
                marginBottom: '0.25rem'
              }}
            >
              La CO2 è alta in questa stanza
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--aq-warning-primary)',
                opacity: 0.7
              }}
            >
              Probabilmente ci sono troppe persone
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--aq-warning-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}
        >
          Azione consigliata
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full space-y-3 mb-8"
        >
          <ActionStep text="Apri le finestre per alcuni minuti" />
          <ActionStep text="Se possibile, fai una breve pausa" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="flex gap-4"
      >
        <button
          className="w-full py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'white',
            background: 'var(--aq-warning-primary)',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.35)'
          }}
          onClick={onWindowsOpened}
        >
          Ho aperto le finestre
        </button>
        <button
          className="w-full py-4 rounded-2xl transition-all duration-300 hover:bg-white/60"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(217, 119, 6, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={onReportIssue}
        >
          Segnala un problema
        </button>
      </motion.div>
    </motion.div>
  );
}

interface RecoveryCheckProps {
  currentTime: string;
  onImproving: () => void;
  onNotImproving: () => void;
  windowsOpened?: boolean;
}

function RecoveryCheck({ currentTime, onImproving, onNotImproving, windowsOpened }: RecoveryCheckProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-10"
      >
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="mb-10"
          >
            <AvatarHopeful />
          </motion.div>
          <ChatBubble text="Dai, sta migliorando!" delay={0.8} side="left" />
          {windowsOpened && (
            <ChatBubble text="Ti ricorderò di chiudere le finestre tra 10 minuti" delay={1.2} side="right" />
          )}
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            color: '#0891b2',
            lineHeight: 1.1,
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            textAlign: 'center'
          }}
        >
          Stiamo monitorando il recupero
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--aq-text-primary)',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
            textAlign: 'center'
          }}
        >
          La qualità dell'aria sta migliorando
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full max-w-md mb-8"
        >
          <div
            className="flex items-center gap-4 p-6 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '2px solid rgba(8, 145, 178, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex-shrink-0">
              <TrendingDown size={40} color="#0891b2" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#0891b2',
                  marginBottom: '0.5rem'
                }}
              >
                CO2 in diminuzione
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--aq-text-secondary)'
                }}
              >
                Continua così per qualche minuto
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 1.2, ease: 'easeOut' }}
          className="w-full max-w-md mb-8"
          style={{ transformOrigin: 'left' }}
        >
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(8, 145, 178, 0.2)' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '65%' }}
              transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)' }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="grid grid-cols-3 gap-4 mb-10"
      >
        <MetricCardCompact label="CO2" value="1380" unit="ppm" status="improving" />
        <MetricCardCompact label="Temperatura" value="20" unit="°C" status="good" />
        <MetricCardCompact label="Umidità" value="47" unit="%" status="good" />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="space-y-4"
      >
        <button
          className="w-full py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'white',
            background: '#0891b2',
            boxShadow: '0 8px 24px rgba(8, 145, 178, 0.35)'
          }}
          onClick={onImproving}
        >
          Va meglio
        </button>
        <button
          className="w-full py-4 rounded-2xl transition-all duration-300 hover:bg-white/60"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(8, 145, 178, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={onNotImproving}
        >
          Non migliora
        </button>
      </motion.div>
    </motion.div>
  );
}

interface EscalateIssueProps {
  currentTime: string;
  optionalNote: string;
  setOptionalNote: (note: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function EscalateIssue({ currentTime, optionalNote, setOptionalNote, onSubmit, onCancel }: EscalateIssueProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col mb-8"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              boxShadow: '0 8px 24px rgba(71, 85, 105, 0.3)'
            }}
          >
            <ClipboardList size={48} color="white" strokeWidth={2} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--aq-text-primary)',
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.03em'
            }}
          >
            Segnala un problema
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--aq-text-secondary)',
              lineHeight: 1.6
            }}
          >
            I dati della stanza sono già inclusi.<br />
            Ti basta confermare la segnalazione
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="space-y-3 mb-6"
        >
          <InfoField label="Stanza" value="Aula 2B" />
          <InfoField label="Ora" value={currentTime} />
          <InfoField label="Problema rilevato" value="CO2 alta" />
          <InfoField label="Stato attuale" value="Non migliora dopo ventilazione" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <label
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--aq-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            Nota opzionale
          </label>
          <textarea
            value={optionalNote}
            onChange={(e) => setOptionalNote(e.target.value)}
            placeholder="Aggiungi una nota"
            rows={3}
            className="w-full p-4 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--aq-text-primary)',
              background: 'rgba(255, 255, 255, 0.6)',
              border: '2px solid rgba(100, 116, 139, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="space-y-4"
      >
        <button
          className="w-full py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'white',
            background: '#475569',
            boxShadow: '0 8px 24px rgba(71, 85, 105, 0.35)'
          }}
          onClick={onSubmit}
        >
          Invia segnalazione
        </button>
        <button
          className="w-full py-4 rounded-2xl transition-all duration-300 hover:bg-white/60"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(100, 116, 139, 0.2)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={onCancel}
        >
          Annulla
        </button>
      </motion.div>
    </motion.div>
  );
}

interface IssueConfirmationProps {
  currentTime: string;
  ticketId: string;
  onDone: () => void;
}

function IssueConfirmation({ currentTime, ticketId, onDone }: IssueConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col p-10"
    >
      <Header room="Aula 2B" location="Piano 2, Edificio A" time={currentTime} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
        className="flex-1 flex flex-col items-center justify-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            type: 'spring',
            stiffness: 200
          }}
          className="mb-10"
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 12px 40px rgba(5, 150, 105, 0.4)'
            }}
          >
            <CheckCircle size={72} color="white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            color: '#059669',
            lineHeight: 1.1,
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            textAlign: 'center'
          }}
        >
          Segnalazione inviata
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: 'var(--aq-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '3rem',
            textAlign: 'center'
          }}
        >
          Il problema è stato registrato per questa stanza
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div
            className="p-8 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '2px solid rgba(5, 150, 105, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--aq-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                ID segnalazione
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--aq-text-primary)',
                  letterSpacing: '-0.02em'
                }}
              >
                #{ticketId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--aq-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Stato
              </span>
              <div
                className="px-4 py-2 rounded-full"
                style={{
                  background: '#d1fae5',
                  border: '2px solid #10b981'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#059669'
                  }}
                >
                  Ricevuta
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <button
          className="w-full py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'white',
            background: '#059669',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)'
          }}
          onClick={onDone}
        >
          Torna alla schermata principale
        </button>
      </motion.div>
    </motion.div>
  );
}

// Shared Components

function Header({ room, location, time, onRoomClick, onSummaryClick }: { room: string; location?: string; time: string; onRoomClick?: () => void; onSummaryClick?: () => void }) {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
      className="mb-10"
    >
      {/* Top row: Room name, monitoring status, and Time */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-start">
          <div
            className={onRoomClick ? 'cursor-pointer' : ''}
            onClick={onRoomClick}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--aq-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: location ? '0.25rem' : '0'
            }}
          >
            {room}
          </div>
          {location && (
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--aq-text-tertiary)',
                letterSpacing: '0.01em'
              }}
            >
              {location}
            </div>
          )}
        </div>

        {/* Center: Live monitoring status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full mx-4"
          style={{
            background: 'rgba(5, 150, 105, 0.1)',
            border: '2px solid rgba(5, 150, 105, 0.2)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Pulsing live indicator */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                background: 'var(--aq-ok-primary)'
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--aq-ok-primary)',
                boxShadow: '0 0 6px rgba(5, 150, 105, 0.6)'
              }}
            />
          </div>

          {/* Monitoring icon */}
          <Radio size={14} color="var(--aq-ok-primary)" strokeWidth={2.5} />

          {/* Animated signal waves */}
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: ['3px', '10px', '3px']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
                className="w-0.5 rounded-full"
                style={{
                  background: 'var(--aq-ok-primary)',
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        </motion.div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--aq-text-secondary)',
              letterSpacing: '0.02em'
            }}
          >
            {time}
          </div>
          {onSummaryClick && (
            <button
              onClick={onSummaryClick}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/40"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: '2px solid rgba(100, 116, 139, 0.2)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <BarChart3 size={20} color="var(--aq-text-secondary)" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AirQualityLegend({ currentLevel, onLevelClick }: { currentLevel: AirQualityLevel; onLevelClick: (level: AirQualityLevel) => void }) {
  const levels: Array<{ key: AirQualityLevel; label: string; color: string; icon: any; iconBg: string }> = [
    { key: 'buona', label: 'Buona', color: '#10b981', icon: Smile, iconBg: 'rgba(16, 185, 129, 0.15)' },
    { key: 'accettabile', label: 'Accettabile', color: '#84cc16', icon: ThumbsUp, iconBg: 'rgba(132, 204, 22, 0.15)' },
    { key: 'mediocre', label: 'Mediocre', color: '#eab308', icon: Minus, iconBg: 'rgba(234, 179, 8, 0.15)' },
    { key: 'scadente', label: 'Scadente', color: '#f59e0b', icon: AlertTriangle, iconBg: 'rgba(245, 158, 11, 0.15)' },
    { key: 'insalubre', label: 'Insalubre', color: '#ef4444', icon: XCircle, iconBg: 'rgba(239, 68, 68, 0.15)' },
    { key: 'pessima', label: 'Pessima', color: '#dc2626', icon: XOctagon, iconBg: 'rgba(220, 38, 38, 0.15)' },
  ];

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: '2px solid rgba(100, 116, 139, 0.15)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="mb-4 text-center"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--aq-text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}
      >
        Legenda qualità aria
      </div>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => {
          const isActive = currentLevel === level.key;
          return (
            <button
              key={level.key}
              onClick={() => onLevelClick(level.key)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                background: level.iconBg,
                border: isActive ? `3px solid ${level.color}` : `2px solid ${level.color}33`,
                boxShadow: isActive ? `0 0 0 3px ${level.color}22` : 'none'
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: level.color,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <level.icon size={18} color="white" strokeWidth={2.5} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 600,
                  color: level.color,
                  textAlign: 'center',
                  lineHeight: 1.2
                }}
              >
                {level.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AirQualitySlider({ currentLevel, onLevelChange }: { currentLevel: AirQualityLevel; onLevelChange: (level: AirQualityLevel) => void }) {
  const levels: Array<{ key: AirQualityLevel; label: string; color: string; icon: any; position: number }> = [
    { key: 'buona', label: 'Buona', color: '#10b981', icon: Smile, position: 0 },
    { key: 'accettabile', label: 'Accettabile', color: '#84cc16', icon: ThumbsUp, position: 1 },
    { key: 'mediocre', label: 'Mediocre', color: '#eab308', icon: Minus, position: 2 },
    { key: 'scadente', label: 'Scadente', color: '#f59e0b', icon: AlertTriangle, position: 3 },
    { key: 'insalubre', label: 'Insalubre', color: '#ef4444', icon: XCircle, position: 4 },
    { key: 'pessima', label: 'Pessima', color: '#dc2626', icon: XOctagon, position: 5 },
  ];

  const currentIndex = levels.findIndex(l => l.key === currentLevel);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onLevelChange(levels[index].key);
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Colored track segments */}
        <div className="flex h-3 rounded-full overflow-hidden mb-6">
          {levels.map((level, index) => (
            <div
              key={level.key}
              className="flex-1 transition-all duration-300"
              style={{
                background: level.color,
                opacity: index <= currentIndex ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {/* Slider input */}
        <input
          type="range"
          min="0"
          max="5"
          value={currentIndex}
          onChange={handleSliderChange}
          className="absolute top-0 w-full h-3 opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />

        {/* Level markers */}
        <div className="relative flex" style={{ marginTop: '-2rem' }}>
          {levels.map((level, index) => {
            const isActive = currentIndex === index;
            return (
              <div
                key={level.key}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onLevelChange(level.key)}
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -8 : 0
                  }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{
                    background: level.color,
                    boxShadow: isActive ? `0 8px 24px ${level.color}60` : `0 4px 12px ${level.color}30`,
                    border: isActive ? '3px solid white' : 'none'
                  }}
                >
                  <level.icon size={20} color="white" strokeWidth={2.5} />
                </motion.div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 600,
                    color: level.color,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    opacity: isActive ? 1 : 0.7,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {level.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IconBubble({ icon: Icon, color, delay, side }: { icon: any; color: string; delay: number; side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className="absolute"
      style={{
        top: '60%',
        [side]: side === 'left' ? '-100px' : '-100px',
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.5
        }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay + 1
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: color,
            boxShadow: `0 8px 24px ${color}40`
          }}
        >
          <Icon size={32} color="white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ChatBubble({ text, delay, side }: { text: string; delay: number; side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className="absolute"
      style={{
        top: '20%',
        [side]: side === 'left' ? '-180px' : '-180px',
        maxWidth: '160px'
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.5
        }}
        className="relative p-4 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--aq-text-primary)',
            lineHeight: 1.4,
            textAlign: 'center'
          }}
        >
          {text}
        </p>
        {/* Chat bubble tail */}
        <div
          className="absolute"
          style={{
            [side]: side === 'left' ? 'auto' : 'auto',
            [side === 'left' ? 'right' : 'left']: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            [side === 'left' ? 'borderLeft' : 'borderRight']: '8px solid rgba(255, 255, 255, 0.95)'
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function Footer({ delay, onAction, hideReportButton }: { delay: number; onAction?: () => void; hideReportButton?: boolean }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="space-y-4"
    >
      {!hideReportButton && (
        <button
          className="w-full py-4 rounded-2xl transition-all duration-300 hover:bg-white/60"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(5, 150, 105, 0.2)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onAction) onAction();
          }}
        >
          Segnala un problema
        </button>
      )}
    </motion.div>
  );
}

function AvatarRelaxed({ color = '#10b981' }: { color?: string }) {
  const rgbaColor = hexToRgba(color, 0.4);
  const darkerColor = adjustColor(color, -10);

  return (
    <div className="relative" style={{ width: '180px', height: '180px' }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgbaColor} 0%, ${hexToRgba(color, 0)} 70%)`,
          filter: 'blur(20px)'
        }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`,
          boxShadow: `0 8px 32px ${hexToRgba(color, 0.3)}, inset 0 -4px 12px rgba(0, 0, 0, 0.1)`
        }}
      >
        <div className="flex gap-12 mb-4">
          <div className="rounded-full" style={{ width: '16px', height: '16px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
          <div className="rounded-full" style={{ width: '16px', height: '16px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
        </div>
        <svg width="80" height="50" viewBox="0 0 80 50" className="absolute" style={{ bottom: '35px' }}>
          <path d="M 15 10 Q 40 35, 65 10" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute inset-0"
      >
        <Sparkle top="10%" left="10%" delay={0} />
        <Sparkle top="15%" left="85%" delay={0.5} />
        <Sparkle top="80%" left="15%" delay={1} />
        <Sparkle top="75%" left="88%" delay={1.5} />
      </motion.div>
    </div>
  );
}

function AvatarNeutral({ color = '#eab308' }: { color?: string }) {
  const rgbaColor = hexToRgba(color, 0.4);
  const darkerColor = adjustColor(color, -10);

  return (
    <div className="relative" style={{ width: '180px', height: '180px' }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgbaColor} 0%, ${hexToRgba(color, 0)} 70%)`,
          filter: 'blur(20px)'
        }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`,
          boxShadow: `0 8px 32px ${hexToRgba(color, 0.3)}, inset 0 -4px 12px rgba(0, 0, 0, 0.1)`
        }}
      >
        <div className="flex gap-12 mb-3">
          <div className="rounded-full" style={{ width: '16px', height: '16px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
          <div className="rounded-full" style={{ width: '16px', height: '16px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
        </div>
        {/* Neutral straight mouth */}
        <svg width="70" height="40" viewBox="0 0 70 40" className="absolute" style={{ bottom: '42px' }}>
          <line x1="15" y1="20" x2="55" y2="20" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function AvatarConcerned({ color = '#f59e0b' }: { color?: string }) {
  const rgbaColor = hexToRgba(color, 0.5);
  const darkerColor = adjustColor(color, -10);

  return (
    <div className="relative" style={{ width: '180px', height: '180px' }}>
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${rgbaColor} 0%, ${hexToRgba(color, 0)} 70%)`,
          filter: 'blur(24px)'
        }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`,
          boxShadow: `0 8px 32px ${hexToRgba(color, 0.4)}, inset 0 -4px 12px rgba(0, 0, 0, 0.1)`
        }}
      >
        <div className="flex gap-12 mb-2">
          <div className="rounded-full" style={{ width: '20px', height: '20px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
          <div className="rounded-full" style={{ width: '20px', height: '20px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
        </div>
        <svg width="70" height="45" viewBox="0 0 70 45" className="absolute" style={{ bottom: '40px' }}>
          <path d="M 15 25 Q 35 10, 55 25" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute" style={{ top: '-12px', right: '-12px' }}>
          <div className="rounded-full flex items-center justify-center" style={{ width: '48px', height: '48px', background: 'white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
            <AlertCircle size={32} color={color} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for color manipulation
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

function AvatarHopeful() {
  return (
    <div className="relative" style={{ width: '180px', height: '180px' }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(8, 145, 178, 0.4) 0%, rgba(8, 145, 178, 0) 70%)',
          filter: 'blur(20px)'
        }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          boxShadow: '0 8px 32px rgba(8, 145, 178, 0.3), inset 0 -4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex gap-12 mb-3">
          <div className="rounded-full" style={{ width: '18px', height: '18px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
          <div className="rounded-full" style={{ width: '18px', height: '18px', background: 'white', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }} />
        </div>
        <svg width="75" height="48" viewBox="0 0 75 48" className="absolute" style={{ bottom: '38px' }}>
          <path d="M 15 15 Q 37.5 30, 60 15" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function Sparkle({ top, left, delay }: { top: string; left: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        top,
        left,
        background: 'white',
        boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
      }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut'
      }}
    />
  );
}

function ActionStep({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: '2px solid rgba(217, 119, 6, 0.2)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="flex-shrink-0 rounded-full mt-1"
        style={{
          width: '8px',
          height: '8px',
          background: 'var(--aq-warning-primary)'
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--aq-text-primary)',
          lineHeight: 1.5
        }}
      >
        {text}
      </p>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: '2px solid rgba(100, 116, 139, 0.15)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--aq-text-primary)'
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: 'good' | 'warning';
  isQualitative?: boolean;
}

function MetricCard({ icon: Icon, label, value, unit, status, isQualitative }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl p-5 transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: `2px solid ${status === 'good' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)'}`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon size={24} style={{ color: status === 'good' ? 'var(--aq-ok-primary)' : 'var(--aq-warning-primary)' }} strokeWidth={2.5} />
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--aq-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isQualitative ? '1.25rem' : '2rem',
            fontWeight: 700,
            color: 'var(--aq-text-primary)',
            letterSpacing: '-0.02em'
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--aq-text-secondary)'
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function MetricCardCompact({ label, value, unit, status }: { label: string; value: string; unit: string; status: 'good' | 'improving' }) {
  const color = status === 'improving' ? '#0891b2' : 'var(--aq-ok-primary)';
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        border: `2px solid ${status === 'improving' ? 'rgba(8, 145, 178, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--aq-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}
      >
        {label}
      </div>
      <div className="flex items-baseline justify-center gap-1">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color,
            letterSpacing: '-0.02em'
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--aq-text-secondary)'
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
