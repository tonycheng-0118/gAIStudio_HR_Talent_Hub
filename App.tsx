
import React, { useState, useCallback } from 'react';
import { Participant, ViewState } from './types';
import ParticipantInput from './components/ParticipantInput';
import LotteryView from './components/LotteryView';
import GroupingView from './components/GroupingView';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('INPUT');

  const handleParticipantsChange = (newList: Participant[]) => {
    setParticipants(newList);
  };

  const renderView = () => {
    switch (currentView) {
      case 'INPUT':
        return (
          <ParticipantInput 
            participants={participants} 
            onUpdate={handleParticipantsChange} 
            onNext={() => setCurrentView('LOTTERY')}
          />
        );
      case 'LOTTERY':
        return (
          <LotteryView 
            participants={participants} 
          />
        );
      case 'GROUPING':
        return (
          <GroupingView 
            participants={participants} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        hasParticipants={participants.length > 0} 
      />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
