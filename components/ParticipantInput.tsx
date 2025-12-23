
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface ParticipantInputProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState(participants.map(p => p.name).join('\n'));

  // Calculate duplicates
  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      participants.filter(p => (counts.get(p.name) || 0) > 1).map(p => p.name)
    );
  }, [participants]);

  const parseText = (text: string) => {
    const lines = text.split(/[\n,]+/).map(line => line.trim()).filter(line => line.length > 0);
    const newList = lines.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));
    onUpdate(newList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      parseText(content);
    };
    reader.readAsText(file);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    parseText(val);
  };

  const handleGenerateMockData = () => {
    const mockNames = [
      "陳小明", "林美玲", "張智宏", "李佳穎", "王大同",
      "黃淑芬", "趙子龍", "孫悟空", "周杰倫", "蔡英文",
      "馬英九", "郭台銘", "劉德華", "張學友", "黎明",
      "陳小春", "應采兒", "謝霆鋒", "王菲", "那英"
    ];
    // Add some random duplicates for demonstration
    const withDuplicates = [...mockNames, mockNames[0], mockNames[1]];
    const text = withDuplicates.join('\n');
    setInputText(text);
    parseText(text);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniqueParticipants: Participant[] = [];
    participants.forEach(p => {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        uniqueParticipants.push(p);
      }
    });
    onUpdate(uniqueParticipants);
    setInputText(uniqueParticipants.map(p => p.name).join('\n'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">名單管理</h2>
          <p className="text-slate-500 mt-2">上傳 CSV 文件或直接貼上姓名名單 (每行一個或逗號分隔)。</p>
        </div>
        <button
          onClick={handleGenerateMockData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors border border-slate-200 flex items-center gap-2"
        >
          <span>💡</span> 產生模擬名單
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative group">
            <textarea
              value={inputText}
              onChange={handleTextAreaChange}
              placeholder="貼上姓名名單，例如：&#10;王小明&#10;李小華&#10;張大千"
              className="w-full h-80 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none text-slate-700 font-medium"
            />
            <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-400 rounded-lg">
              {participants.length} 位參與者
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer group">
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
                <span className="text-xl">📁</span>
                <span className="font-semibold">上傳 CSV/Text 文件</span>
              </div>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${duplicates.size > 0 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
              預覽清單 {duplicates.size > 0 && <span className="text-xs text-amber-600 font-normal">({duplicates.size} 組重複)</span>}
            </h3>
            {duplicates.size > 0 && (
              <button 
                onClick={handleRemoveDuplicates}
                className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 transition-colors"
              >
                移除所有重複項
              </button>
            )}
          </div>
          <div className="flex-1 h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                <span className="text-4xl mb-4">📭</span>
                目前尚無名單
              </div>
            ) : (
              participants.map((p, i) => (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    duplicates.has(p.name) 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  <span className={`font-medium ${duplicates.has(p.name) ? 'text-amber-700' : 'text-slate-600'}`}>
                    <span className="text-slate-300 mr-2 text-xs">#{i + 1}</span>
                    {p.name}
                  </span>
                  {duplicates.has(p.name) && (
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold uppercase">重複</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onNext}
          disabled={participants.length === 0}
          className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg ${
            participants.length > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          下一步：前往抽籤 🎁
        </button>
      </div>
    </div>
  );
};

export default ParticipantInput;
