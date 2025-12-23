
import React, { useState, useEffect } from 'react';
import { Participant, Group } from '../types';
import { GoogleGenAI } from "@google/genai";

interface GroupingViewProps {
  participants: Participant[];
}

const GroupingView: React.FC<GroupingViewProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNamingGroups, setIsNamingGroups] = useState(false);

  // Fix: Explicitly type shuffleArray to ensure correct type inference for Participant[] and avoid unknown[] issues
  const shuffleArray = (array: Participant[]): Participant[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleGroup = () => {
    setIsGenerating(true);
    // Add small delay for feel
    setTimeout(() => {
      const shuffled = shuffleArray(participants);
      const newGroups: Group[] = [];
      const totalGroups = Math.ceil(participants.length / groupSize);

      for (let i = 0; i < totalGroups; i++) {
        newGroups.push({
          id: i + 1,
          name: `第 ${i + 1} 組`,
          members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
        });
      }
      setGroups(newGroups);
      setIsGenerating(false);
    }, 500);
  };

  const smartRenameGroups = async () => {
    if (groups.length === 0) return;
    setIsNamingGroups(true);
    
    try {
      // Fix: Create GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date environment config
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `我們有 ${groups.length} 個團隊，請為每個團隊生成一個富有創意且專業的中文隊名。主題可以跟創新、合作、卓越相關。只需要返回隊名列表，以逗號分隔。`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      // Fix: The text content is a property on GenerateContentResponse, not a method
      const namesText = response.text || "";
      const names = namesText.split(/[,，\n]+/).map(n => n.trim()).filter(n => n.length > 0);
      
      setGroups(prev => prev.map((g, idx) => ({
        ...g,
        name: names[idx] || g.name
      })));
    } catch (error) {
      console.error("AI Naming failed:", error);
    } finally {
      setIsNamingGroups(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">自動分組</h2>
          <p className="text-slate-500 mt-2">設定每組人數，系統將隨機分配名單。</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-sm font-semibold text-slate-500">每組人數</span>
            <input 
              type="number" 
              min="2" 
              max={participants.length}
              value={groupSize} 
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-16 bg-slate-50 border-none rounded-lg p-2 font-bold text-indigo-600 outline-none text-center"
            />
          </div>
          <button 
            onClick={handleGroup}
            disabled={isGenerating}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all"
          >
            {isGenerating ? '分組中...' : '生成分組'}
          </button>
          {groups.length > 0 && (
            <button 
              onClick={smartRenameGroups}
              disabled={isNamingGroups}
              className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-2xl shadow-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <span>{isNamingGroups ? '✨ 思考中...' : '✨ AI 創意隊名'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400">
             <span className="text-5xl mb-4">🧩</span>
             <p className="font-medium">請點擊上方按鈕開始分組</p>
          </div>
        ) : (
          groups.map((group, idx) => (
            <div 
              key={group.id} 
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden animate-in zoom-in-95 duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-wide truncate">{group.name}</h3>
                <span className="px-3 py-1 bg-white text-xs font-bold text-slate-400 rounded-full border border-slate-100">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-6 space-y-3">
                {group.members.map((member, mIdx) => (
                  <div key={member.id} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {mIdx + 1}
                    </div>
                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {groups.length > 0 && (
        <div className="flex justify-center pt-8">
           <p className="text-slate-400 text-sm flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
             共分成 {groups.length} 個小組，名單總計 {participants.length} 人
           </p>
        </div>
      )}
    </div>
  );
};

export default GroupingView;
