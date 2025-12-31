import React from 'react';
import { CareerAdvice } from '../types';
import { Check, AlertCircle, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface Props {
  advice: CareerAdvice;
  onRestart: () => void;
  onBack: () => void;
}

export const Step3Results: React.FC<Props> = ({ advice, onRestart, onBack }) => {
  return (
    <div className="animate-fade-in-up pb-32 space-y-16">
      
      {/* Top Header */}
      <header className="flex justify-between items-start border-b border-[#e1e1e0] pb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#37352f] mb-2">Career Plan</h1>
          <p className="text-[#9b9a97]">Based on your profile and market analysis.</p>
        </div>
        <button onClick={onRestart} className="text-sm text-[#9b9a97] hover:text-[#37352f] underline">
          Start Over
        </button>
      </header>

      {/* Resume Score Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="bg-[#f7f7f5] p-8 rounded-lg text-center h-full flex flex-col justify-center items-center border border-[#e1e1e0]">
            <span className="text-[#9b9a97] text-sm font-medium uppercase tracking-wider mb-2">Resume Score</span>
            <div className="text-6xl font-bold text-[#37352f] mb-2">{advice.resumeScore}<span className="text-2xl text-[#9b9a97]">/10</span></div>
            <p className="text-sm text-[#37352f] mt-4">{advice.executiveSummary}</p>
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-[#37352f] flex items-center"><AlertCircle className="w-4 h-4 mr-2"/> Critique</h3>
            <p className="text-[#37352f] leading-relaxed bg-white border-l-2 border-red-400 pl-4 py-1">
              {advice.resumeCritique || "No critique available."}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-[#37352f] flex items-center"><Check className="w-4 h-4 mr-2"/> Improvement Suggestions</h3>
            <p className="text-[#37352f] leading-relaxed bg-white border-l-2 border-green-400 pl-4 py-1">
              {advice.improvementSuggestion}
            </p>
          </div>
          <div className="space-y-2">
             <h3 className="font-semibold text-[#37352f] flex items-center"><ArrowUpRight className="w-4 h-4 mr-2"/> Skill Gap</h3>
             <p className="text-[#37352f] leading-relaxed text-sm text-[#9b9a97]">
               {advice.skillGapAnalysis}
             </p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section>
        <h2 className="text-xl font-bold text-[#37352f] mb-6 border-b border-[#e1e1e0] pb-2">Recommended Opportunities</h2>
        
        {advice.jobs.length === 0 ? (
          <div className="p-8 border border-dashed border-[#e1e1e0] rounded text-center text-[#9b9a97]">
            No direct matches found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advice.jobs.map((job, idx) => (
              <a 
                key={idx}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 rounded border border-[#e1e1e0] hover:bg-[#fbfbfb] hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[#37352f] group-hover:underline decoration-1 underline-offset-2">
                      {job.title}
                    </h4>
                    <p className="text-sm text-[#37352f] mt-1">{job.company}</p>
                  </div>
                  {job.matchScore && (
                    <span className="text-xs font-mono bg-[#efefef] px-2 py-1 rounded text-[#37352f]">
                      {job.matchScore}%
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center text-xs text-[#9b9a97] space-x-3">
                   <span className="bg-[#f7f7f5] px-1.5 py-0.5 rounded border border-[#e1e1e0]">{job.platform}</span>
                   <span>{job.location}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Sources Footer */}
      {advice.groundingUrls && advice.groundingUrls.length > 0 && (
         <footer className="pt-8 border-t border-[#e1e1e0] text-xs text-[#9b9a97]">
           <p className="mb-2 uppercase tracking-widest font-semibold">Sources</p>
           <ul className="space-y-1">
             {advice.groundingUrls.map((url, i) => (
               <li key={i}>
                 <a href={url.uri} target="_blank" rel="noopener noreferrer" className="hover:text-[#37352f] hover:underline truncate block">
                   {url.title}
                 </a>
               </li>
             ))}
           </ul>
         </footer>
      )}

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-[#e1e1e0] py-4 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-2 rounded text-sm font-medium text-[#37352f] hover:bg-[#f1f1ef] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          {/* No Right Arrow on final step, just Start Over at top or implied end */}
        </div>
      </div>
    </div>
  );
};