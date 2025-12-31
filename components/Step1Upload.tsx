import React, { useState, useRef, useEffect } from 'react';
import { JobSearchCriteria } from '../types';
import { Upload, ArrowRight, Loader2, FileText } from 'lucide-react';

interface Props {
  onComplete: (criteria: JobSearchCriteria) => void;
  isProcessing: boolean;
  initialCriteria?: JobSearchCriteria | null;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "Singapore", "Japan", "India", "France", "Netherlands"
];

export const Step1Upload: React.FC<Props> = ({ onComplete, isProcessing, initialCriteria }) => {
  const [country, setCountry] = useState("United States");
  const [jobTitle, setJobTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hasExistingFile, setHasExistingFile] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCriteria) {
      setCountry(initialCriteria.targetCountry);
      setJobTitle(initialCriteria.targetJobTitle);
      setHasExistingFile(true);
    }
  }, [initialCriteria]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Image file.");
        return;
      }
      setFile(selectedFile);
      setHasExistingFile(false); // New file overrides existing
      setError("");
    }
  };

  const handleSubmit = () => {
    if ((!file && !hasExistingFile) || !jobTitle) {
      setError("Please ensure a resume is uploaded and job title is set.");
      return;
    }

    if (file) {
      // New file uploaded
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        onComplete({
          targetCountry: country,
          targetJobTitle: jobTitle,
          resumeFileBase64: base64Data,
          resumeMimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    } else if (hasExistingFile && initialCriteria) {
      // Use existing file data
      onComplete({
        targetCountry: country,
        targetJobTitle: jobTitle,
        resumeFileBase64: initialCriteria.resumeFileBase64,
        resumeMimeType: initialCriteria.resumeMimeType
      });
    }
  };

  return (
    <div className="animate-fade-in-up space-y-12 pb-24">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-[#37352f]">Getting Started</h1>
        <p className="text-lg text-[#37352f]">Upload your resume to begin the career analysis.</p>
      </div>

      <div className="space-y-8">
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            group border border-[#e1e1e0] rounded-md p-10 cursor-pointer transition-all duration-200
            ${(file || hasExistingFile) ? 'bg-[#f7f7f5]' : 'hover:bg-[#fbfbfb]'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="application/pdf,image/*"
          />
          
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-md ${(file || hasExistingFile) ? 'bg-black text-white' : 'bg-[#f1f1ef] text-[#9b9a97]'}`}>
              {(file || hasExistingFile) ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
               {file ? (
                 <p className="font-medium text-[#37352f]">{file.name}</p>
               ) : hasExistingFile ? (
                 <p className="font-medium text-[#37352f]">Resume Uploaded</p>
               ) : (
                 <p className="font-medium text-[#37352f]">Click to upload resume</p>
               )}
               <p className="text-sm text-[#9b9a97] mt-1">
                 {file ? "Ready to process" : hasExistingFile ? "Using previously uploaded file" : "PDF, JPG, PNG supported"}
               </p>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9b9a97]">Target Location</label>
            <div className="relative">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-transparent border-b border-[#e1e1e0] py-2 text-[#37352f] focus:border-black focus:outline-none transition-colors appearance-none rounded-none cursor-pointer"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9b9a97]">Desired Role</label>
            <input 
              type="text" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Product Manager"
              className="w-full bg-transparent border-b border-[#e1e1e0] py-2 text-[#37352f] focus:border-black focus:outline-none transition-colors placeholder-[#d3d3d3] rounded-none"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm py-2">
            {error}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-[#e1e1e0] py-4 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`
              flex items-center space-x-2 px-6 py-2 rounded text-sm font-medium transition-all
              ${isProcessing ? 'bg-[#e1e1e0] text-[#9b9a97] cursor-not-allowed' : 'bg-[#2f2f2f] text-white hover:bg-black'}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};