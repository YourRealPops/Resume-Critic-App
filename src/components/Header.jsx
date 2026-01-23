import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-4xl font-bold">AI Resume Critic</h1>
        </div>
        <p className="text-center text-blue-100">
          Get instant, AI-powered feedback on your resume
        </p>
      </div>
    </header>
  );
};

export default Header;