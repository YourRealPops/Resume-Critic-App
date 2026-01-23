import { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResumePreview from './components/ResumePreview';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CritiqueDisplay from './components/CritiqueDisplay';
import Footer from './components/Footer';
import { readFileAsText } from './utils/fileReader';
import { analyzeResumeWithAI } from './services/resumeAnalyzer';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [critique, setCritique] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setCritique(null);
    
    await analyzeResume(selectedFile);
  };

  const analyzeResume = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const fileText = await readFileAsText(file);
      const parsedCritique = await analyzeResumeWithAI(fileText);
      setCritique(parsedCritique);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing your resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCritique(null);
    setError(null);
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

          {isLoading && <LoadingSpinner />}

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {critique && (
            <>
              <CritiqueDisplay critique={critique} />
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