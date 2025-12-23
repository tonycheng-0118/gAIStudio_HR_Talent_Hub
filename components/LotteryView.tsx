
import React, { useState, useEffect, useCallback } from 'react';
import { Participant } from '../types';

interface LotteryViewProps {
  participants: Participant[];
}

const LotteryView: React.FC<LotteryViewProps> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<Participant[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [displayName, setDisplayName] = useState('準備好了嗎？');
  const [remainingList, setRemainingList] = useState<Participant[]>([...participants]);

  useEffect(() => {
    setRemainingList([...participants]);
    setWinner(null);
    setHistory([]);
  }, [participants]);

  const drawWinner = useCallback(() => {
    if (isSpinning) return;
    
    const candidates = allowDuplicates ? participants : remainingList;
    
    if (candidates.length === 0) {
      alert("名單已抽完！");
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Animation cycle
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setDisplayName(participants[randomIndex].name);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        
        const finalWinnerIndex = Math.floor(Math.random() * candidates.length);
        const finalWinner = candidates[finalWinnerIndex];
        
        setWinner(finalWinner);
        setDisplayName(finalWinner.name);
        setHistory(prev => [finalWinner, ...prev]);
        
        if (!allowDuplicates) {
          setRemainingList(prev => prev.filter(p => p.id !== finalWinner.id));
        }
        
        setIsSpinning(false);
      }
    }, 100);
  }, [isSpinning, allowDuplicates, participants, remainingList]);

  const resetLottery = () => {
    setRemainingList([...participants]);
    setWinner(null);
    setHistory([]);
    setDisplayName('準備好了嗎？');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">獎品抽籤</h2>
          <p className="text-slate-500 mt-2">點擊按鈕隨機抽取一名幸運兒！</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white p-3 px-5 rounded-2xl border border-slate-200 shadow-sm">
             <span className="text-sm font-semibold text-slate-600">重複抽取</span>
             <button 
               onClick={() => setAllowDuplicates(!allowDuplicates)}
               className={`w-12 h-6 rounded-full relative transition-colors ${allowDuplicates ? 'bg-indigo-600' : 'bg-slate-300'}`}
             >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${allowDuplicates ? 'left-7' : 'left-1'}`} />
             </button>
           </div>
           <button 
             onClick={resetLottery}
             className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 transition-all shadow-sm"
           >
             重置
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-xl relative overflow-hidden">
          {/* Animated Background Decor */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-12 w-full">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl bg-indigo-50 border-4 border-indigo-100 transition-transform duration-300 ${isSpinning ? 'animate-bounce' : ''}`}>
              {isSpinning ? '🎰' : winner ? '🎉' : '🎁'}
            </div>

            <div className="h-40 flex items-center justify-center">
              <h1 className={`text-6xl lg:text-8xl font-black transition-all ${isSpinning ? 'text-indigo-400 blur-[2px] scale-90' : winner ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>
                {displayName}
              </h1>
            </div>

            <button
              onClick={drawWinner}
              disabled={isSpinning || (!allowDuplicates && remainingList.length === 0)}
              className={`group relative overflow-hidden px-12 py-6 rounded-full font-bold text-2xl transition-all active:scale-95 shadow-2xl ${
                isSpinning || (!allowDuplicates && remainingList.length === 0)
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300'
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSpinning ? '正在抽取...' : '開始抽獎！'}
              </span>
            </button>
            
            {!allowDuplicates && (
              <p className="text-slate-400 font-medium">剩餘參與者：{remainingList.length}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            中獎紀錄
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 italic py-10">
                尚未有中獎者
              </div>
            ) : (
              history.map((h, i) => (
                <div key={`${h.id}-${i}`} className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                    {history.length - i}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{h.name}</div>
                    <div className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Lucky Winner</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryView;
