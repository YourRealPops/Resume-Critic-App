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

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [critique, setCritique] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [mimeType, setMimeType] = useState(null);

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
      const fileText = await readFileAsText(selectedFile);
      setResumeFile(fileText);           // store original base64 for rewriter
      setMimeType(selectedFile.type);    // store mime type for rewriter
      const parsedCritique = await analyzeResumeWithAI(fileText, selectedFile.type);
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

          {isLoading && <LoadingSpinner />}

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