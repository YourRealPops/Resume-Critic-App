import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-1">Error</h3>
          <p className="text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
