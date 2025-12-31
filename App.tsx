import React, { useState } from 'react';
import { Step1Upload } from './components/Step1Upload';
import { Step2Refine } from './components/Step2Refine';
import { Step3Results } from './components/Step3Results';
import { AppStep, UserProfile, JobSearchCriteria, CareerAdvice, createEmptyProfile } from './types';
import { extractResumeData, generateCareerAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.UPLOAD);
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [criteria, setCriteria] = useState<JobSearchCriteria | null>(null);
  const [resumeData, setResumeData] = useState<UserProfile>(createEmptyProfile());
  const [advice, setAdvice] = useState<CareerAdvice | null>(null);

  // Handlers
  const handleUploadComplete = async (searchCriteria: JobSearchCriteria) => {
    // Optimization: Skip re-analysis if criteria hasn't changed
    if (criteria && 
        criteria.resumeFileBase64 === searchCriteria.resumeFileBase64 &&
        criteria.targetJobTitle === searchCriteria.targetJobTitle &&
        criteria.targetCountry === searchCriteria.targetCountry &&
        criteria.resumeMimeType === searchCriteria.resumeMimeType
    ) {
      setCurrentStep(AppStep.REFINE);
      return;
    }

    setIsLoading(true);
    setCriteria(searchCriteria);
    try {
      // If we are re-uploading, always re-extract. 
      // Optimization: We could check if base64 changed, but safer to re-extract to ensure sync.
      const data = await extractResumeData(
        searchCriteria.resumeFileBase64,
        searchCriteria.resumeMimeType,
        searchCriteria.targetJobTitle,
        searchCriteria.targetCountry
      );
      setResumeData(data);
      setCurrentStep(AppStep.REFINE);
    } catch (error) {
      alert("Failed to process resume. Please ensure the API Key is valid and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinementComplete = async (refinedData: UserProfile) => {
    if (!criteria) return;
    setIsLoading(true);
    setResumeData(refinedData); // Save edits
    try {
      const result = await generateCareerAdvice(
        refinedData,
        criteria.targetJobTitle,
        criteria.targetCountry
      );
      setAdvice(result);
      setCurrentStep(AppStep.RESULTS);
    } catch (error) {
      console.error("Failed to generate career advice:", error);
      alert("Failed to generate career advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setCriteria(null);
    setResumeData(createEmptyProfile());
    setAdvice(null);
    setCurrentStep(AppStep.UPLOAD);
  };

  // Step Visual Indicator - Minimal Text
  const renderProgressBar = () => (
    <div className="flex items-center space-x-2 text-sm text-[#9b9a97] mb-12">
      <span className={currentStep === AppStep.UPLOAD ? "text-[#37352f] font-medium" : ""}>1. Upload</span>
      <span>/</span>
      <span className={currentStep === AppStep.REFINE ? "text-[#37352f] font-medium" : ""}>2. Refine</span>
      <span>/</span>
      <span className={currentStep === AppStep.RESULTS ? "text-[#37352f] font-medium" : ""}>3. Plan</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans selection:bg-[#cce9ff]">
      
      {/* Minimal Navbar */}
      <nav className="border-b border-[#e1e1e0] sticky top-0 bg-white/90 backdrop-blur-sm z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <div className="flex items-center text-[#37352f] font-semibold tracking-tight text-sm hover:bg-[#efefef] px-2 py-1 rounded transition-colors cursor-default">
            <span className="w-5 h-5 mr-2 bg-black text-white flex items-center justify-center rounded text-xs">C</span>
            CareerPath AI
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {renderProgressBar()}

        <div className="transition-opacity duration-300">
          {currentStep === AppStep.UPLOAD && (
            <Step1Upload 
              onComplete={handleUploadComplete} 
              isProcessing={isLoading} 
              initialCriteria={criteria}
            />
          )}
          
          {currentStep === AppStep.REFINE && (
            <Step2Refine 
              initialData={resumeData} 
              onNext={handleRefinementComplete} 
              onBack={() => setCurrentStep(AppStep.UPLOAD)}
              isProcessing={isLoading} 
            />
          )}

          {currentStep === AppStep.RESULTS && advice && (
            <Step3Results 
              advice={advice} 
              onRestart={handleRestart}
              onBack={() => setCurrentStep(AppStep.REFINE)} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;