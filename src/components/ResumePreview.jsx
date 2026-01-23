import { FileText } from 'lucide-react';

const ResumePreview = ({ file, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileText className="w-10 h-10 text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{file.name}</h3>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;