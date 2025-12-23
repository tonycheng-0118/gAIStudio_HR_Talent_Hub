
import React, { useState } from 'react';
import { Participant } from '../types';

interface ParticipantInputProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState(participants.map(p => p.name).join('\n'));

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">名單管理</h2>
        <p className="text-slate-500 mt-2">上傳 CSV 文件或直接貼上姓名名單 (每行一個或逗號分隔)。</p>
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

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            預覽清單
          </h3>
          <div className="h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                <span className="text-4xl mb-4">📭</span>
                目前尚無名單
              </div>
            ) : (
              participants.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <span className="text-slate-600 font-medium"><span className="text-slate-300 mr-2">#{i + 1}</span>{p.name}</span>
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
