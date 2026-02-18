import { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResumePreview from './components/ResumePreview';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CritiqueDisplay from './components/CritiqueDisplay';
import RewriteSection from './components/RewriteSection';
import Footer from './components/Footer';
import { readFileAsText } from './utils/fileReader';
import { analyzeResumeWithAI } from './services/resumeAnalyzer';
import { waitForServer } from './services/serverHealth';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [critique, setCritique] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setCritique(null);
    setResumeFile(null);
    setMimeType(null);

    await analyzeResume(selectedFile);
  };

  const analyzeResume = async (selectedFile) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if server is awake first
    await waitForServer(() => setIsWakingUp(true));
    setIsWakingUp(false); // server is awake, clear the message
    const fileText = await readFileAsText(selectedFile);
    setResumeFile(fileText);
    setMimeType(selectedFile.type);
    const parsedCritique = await analyzeResumeWithAI(fileText, selectedFile.type);
    setCritique(parsedCritique);
  } catch (err) {
    setError(err.message || 'An error occurred while analyzing your resume.');
  } finally {
    setIsLoading(false);
    setIsWakingUp(false);
  }
};

  const handleRemoveFile = () => {
    setFile(null);
    setCritique(null);
    setError(null);
    setResumeFile(null);
    setMimeType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {!file && !isLoading && (
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          )}

          {file && !isLoading && !critique && (
            <ResumePreview file={file} onRemove={handleRemoveFile} />
          )}

         {isWakingUp && (
          <div className="text-center py-8 space-y-3">
          <div className="text-4xl animate-bounce">😴</div>
          <p className="text-gray-600 font-medium">Waking up the server, please wait...</p>
          <p className="text-gray-400 text-sm">This only happens after a period of inactivity and takes about 30 seconds.</p>
           </div>
          )}

        {isLoading && !isWakingUp && <LoadingSpinner />}

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {critique && (
            <>
              <CritiqueDisplay critique={critique} />
              <RewriteSection
                critique={critique}
                resumeFile={resumeFile}
                mimeType={mimeType}
              />
              <div className="text-center">
                <button
                  onClick={handleRemoveFile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Analyze Another Resume
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;