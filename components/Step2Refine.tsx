import React, { useState } from 'react';
import { UserProfile, WorkExperience, Project, Language } from '../types';
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Award, Globe, Folder, Briefcase } from 'lucide-react';

interface Props {
  initialData: UserProfile;
  onNext: (data: UserProfile) => void;
  onBack: () => void;
  isProcessing: boolean;
}

export const Step2Refine: React.FC<Props> = ({ initialData, onNext, onBack, isProcessing }) => {
  const [profile, setProfile] = useState<UserProfile>(initialData);

  const updateField = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // --- Handlers for Experience ---
  const handleExpChange = (idx: number, field: keyof WorkExperience, val: string) => {
    const newExp = [...profile.experience];
    newExp[idx] = { ...newExp[idx], [field]: val };
    updateField('experience', newExp);
  };
  const addExp = () => updateField('experience', [...profile.experience, { company: '', role: '', duration: '', description: '' }]);
  const removeExp = (idx: number) => updateField('experience', profile.experience.filter((_, i) => i !== idx));

  // --- Handlers for Projects ---
  const handleProjChange = (idx: number, field: keyof Project, val: string) => {
    const newArr = [...profile.projects];
    newArr[idx] = { ...newArr[idx], [field]: val };
    updateField('projects', newArr);
  };
  const addProj = () => updateField('projects', [...profile.projects, { name: '', description: '', link: '' }]);
  const removeProj = (idx: number) => updateField('projects', profile.projects.filter((_, i) => i !== idx));

  // --- Handlers for Languages ---
  const handleLangChange = (idx: number, field: keyof Language, val: string) => {
    const newArr = [...profile.languages];
    // @ts-ignore
    newArr[idx] = { ...newArr[idx], [field]: val };
    updateField('languages', newArr);
  };
  const addLang = () => updateField('languages', [...profile.languages, { language: '', proficiency: 'Intermediate' }]);
  const removeLang = (idx: number) => updateField('languages', profile.languages.filter((_, i) => i !== idx));

  // --- Handlers for Certs ---
  const handleCertChange = (idx: number, val: string) => {
    const newArr = [...profile.certifications];
    newArr[idx] = val;
    updateField('certifications', newArr);
  };
  const addCert = () => updateField('certifications', [...profile.certifications, '']);
  const removeCert = (idx: number) => updateField('certifications', profile.certifications.filter((_, i) => i !== idx));


  return (
    <div className="animate-fade-in-up pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#37352f]">Review & Refine</h2>
        <p className="text-[#9b9a97] mt-2">Verify extracted data and add missing details.</p>
      </div>

      <div className="space-y-12">
        
        {/* Personal Info & Links */}
        <section className="space-y-4">
          <div className="flex items-center text-[#37352f] font-medium border-b border-[#e1e1e0] pb-2">
            <span className="mr-2">👤</span> Personal Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="input-minimal" value={profile.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Full Name" />
            <input className="input-minimal" value={profile.email} onChange={e => updateField('email', e.target.value)} placeholder="Email" />
            <input className="input-minimal" value={profile.phone} onChange={e => updateField('phone', e.target.value)} placeholder="Phone" />
            <input className="input-minimal" value={profile.links.linkedin || ''} onChange={e => setProfile({...profile, links: {...profile.links, linkedin: e.target.value}})} placeholder="LinkedIn URL" />
            <input className="input-minimal" value={profile.links.portfolio || ''} onChange={e => setProfile({...profile, links: {...profile.links, portfolio: e.target.value}})} placeholder="Portfolio URL" />
            <input className="input-minimal" value={profile.links.github || ''} onChange={e => setProfile({...profile, links: {...profile.links, github: e.target.value}})} placeholder="GitHub URL" />
            <input className="input-minimal" value={profile.links.other || ''} onChange={e => setProfile({...profile, links: {...profile.links, other: e.target.value}})} placeholder="Other Link (Optional)" />
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e1e1e0] pb-2">
            <h3 className="font-medium text-[#37352f] flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Experience</h3>
            <button onClick={addExp} className="text-xs hover:bg-[#efefef] p-1 rounded"><Plus className="w-4 h-4"/></button>
          </div>
          <div className="space-y-6">
            {profile.experience.map((exp, i) => (
              <div key={i} className="group relative pl-4 border-l-2 border-[#e1e1e0] hover:border-[#37352f] transition-colors">
                <button onClick={() => removeExp(i)} className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 text-[#9b9a97] hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input className="input-minimal font-semibold" value={exp.role} onChange={e => handleExpChange(i, 'role', e.target.value)} placeholder="Role" />
                  <input className="input-minimal" value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} placeholder="Company" />
                </div>
                <input className="input-minimal text-xs text-[#9b9a97] mb-2" value={exp.duration} onChange={e => handleExpChange(i, 'duration', e.target.value)} placeholder="Date Range" />
                <textarea className="input-minimal w-full h-20 resize-none text-sm" value={exp.description} onChange={e => handleExpChange(i, 'description', e.target.value)} placeholder="Description..." />
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e1e1e0] pb-2">
            <h3 className="font-medium text-[#37352f] flex items-center"><Folder className="w-4 h-4 mr-2"/> Projects</h3>
            <button onClick={addProj} className="text-xs hover:bg-[#efefef] p-1 rounded"><Plus className="w-4 h-4"/></button>
          </div>
          <div className="space-y-6">
            {profile.projects.map((proj, i) => (
              <div key={i} className="group relative pl-4 border-l-2 border-[#e1e1e0] hover:border-[#37352f] transition-colors">
                <button onClick={() => removeProj(i)} className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 text-[#9b9a97] hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input className="input-minimal font-semibold" value={proj.name} onChange={e => handleProjChange(i, 'name', e.target.value)} placeholder="Project Name" />
                  <input className="input-minimal text-blue-600 underline" value={proj.link || ''} onChange={e => handleProjChange(i, 'link', e.target.value)} placeholder="Link (Optional)" />
                </div>
                <textarea className="input-minimal w-full h-16 resize-none text-sm" value={proj.description} onChange={e => handleProjChange(i, 'description', e.target.value)} placeholder="What did you build/achieve?" />
              </div>
            ))}
            {profile.projects.length === 0 && <p className="text-sm text-[#9b9a97] italic">No projects listed.</p>}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Certifications */}
           <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e1e0] pb-2">
              <h3 className="font-medium text-[#37352f] flex items-center"><Award className="w-4 h-4 mr-2"/> Certifications</h3>
              <button onClick={addCert} className="text-xs hover:bg-[#efefef] p-1 rounded"><Plus className="w-4 h-4"/></button>
            </div>
            <div className="space-y-2">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="flex items-center group">
                  <input className="input-minimal w-full" value={cert} onChange={e => handleCertChange(i, e.target.value)} placeholder="Certificate Name" />
                  <button onClick={() => removeCert(i)} className="ml-2 opacity-0 group-hover:opacity-100 text-[#9b9a97] hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e1e0] pb-2">
              <h3 className="font-medium text-[#37352f] flex items-center"><Globe className="w-4 h-4 mr-2"/> Languages</h3>
              <button onClick={addLang} className="text-xs hover:bg-[#efefef] p-1 rounded"><Plus className="w-4 h-4"/></button>
            </div>
            <div className="space-y-2">
              {profile.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <input className="input-minimal w-1/2" value={lang.language} onChange={e => handleLangChange(i, 'language', e.target.value)} placeholder="Language" />
                  <select 
                    className="input-minimal w-1/2 bg-transparent"
                    value={lang.proficiency}
                    onChange={e => handleLangChange(i, 'proficiency', e.target.value)}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Native">Native</option>
                  </select>
                  <button onClick={() => removeLang(i)} className="opacity-0 group-hover:opacity-100 text-[#9b9a97] hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Styles for minimal inputs */}
      <style>{`
        .input-minimal {
          background: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          padding: 4px 0;
          width: 100%;
          outline: none;
          color: #37352f;
          transition: border-color 0.2s;
        }
        .input-minimal:focus {
          border-bottom-color: #37352f;
        }
        .input-minimal::placeholder {
          color: #d3d3d3;
        }
      `}</style>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-[#e1e1e0] py-4 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button 
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-6 py-2 rounded text-sm font-medium text-[#37352f] hover:bg-[#f1f1ef] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button 
            onClick={() => onNext(profile)}
            disabled={isProcessing}
            className={`
              flex items-center space-x-2 px-6 py-2 rounded text-sm font-medium transition-colors
              ${isProcessing ? 'bg-[#e1e1e0] text-[#9b9a97]' : 'bg-[#2f2f2f] text-white hover:bg-black'}
            `}
          >
             {isProcessing ? (
               <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating</span></>
             ) : (
               <><span>Analyze</span><ArrowRight className="w-4 h-4" /></>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};