import { CheckCircle, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const CritiqueDisplay = ({ critique }) => {
  const renderSection = (title, content, icon, colorClass) => {
    if (!content) return null;
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colorClass}`}>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
        <p className="text-green-100">Here's your comprehensive resume critique</p>
      </div>

      {renderSection(
        "Strengths",
        critique.strengths,
        <CheckCircle className="w-6 h-6 text-green-600" />,
        "border-green-500"
      )}

      {renderSection(
        "Areas for Improvement",
        critique.weaknesses,
        <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        "border-yellow-500"
      )}

      {renderSection(
        "Recommendations",
        critique.suggestions,
        <TrendingUp className="w-6 h-6 text-blue-600" />,
        "border-blue-500"
      )}

      {renderSection(
        "Overall Assessment",
        critique.overall,
        <Sparkles className="w-6 h-6 text-purple-600" />,
        "border-purple-500"
      )}
    </div>
  );
};

export default CritiqueDisplay;
