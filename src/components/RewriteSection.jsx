import { useState } from 'react';
import { rewriteResumeWithAI, downloadResume } from '../services/resumeRewriter';

export default function RewriteSection({ critique, resumeFile, mimeType }) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const handleRewrite = async () => {
    setIsRewriting(true);
    setError(null);
    try {
      const result = await rewriteResumeWithAI(resumeFile, mimeType, critique);
      setRewrittenResume(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleDownload = async (format) => {
    setDownloading(format);
    try {
      await downloadResume(rewrittenResume, format);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const formats = [
    { label: 'PDF', value: 'pdf', color: 'bg-red-500 hover:bg-red-600' },
    { label: 'DOCX', value: 'docx', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'DOC', value: 'doc', color: 'bg-blue-400 hover:bg-blue-500' },
    { label: 'TXT', value: 'txt', color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">✨ AI Resume Rewriter</h2>
      <p className="text-gray-500 mb-6">
        Let AI rewrite your resume applying all the suggestions above.
      </p>

      {!rewrittenResume && (
        <button
          onClick={handleRewrite}
          disabled={isRewriting}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {isRewriting ? '✍️ Rewriting your resume...' : '🚀 Rewrite My Resume'}
        </button>
      )}

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      {rewrittenResume && (
        <div className="mt-6 space-y-6">
          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-700 space-y-3 border border-gray-200">
            
            {/* Personal Info */}
            <p className="text-xl font-bold">{rewrittenResume.name}</p>
            <p className="text-gray-500">
              {rewrittenResume.email} | {rewrittenResume.phone} | {rewrittenResume.location}
            </p>

            {/* Summary */}
            {rewrittenResume.summary && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">Summary</p>
                <p>{rewrittenResume.summary}</p>
              </div>
            )}

            {/* Experience */}
            {rewrittenResume.experience?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">Experience</p>
                {rewrittenResume.experience.map((exp, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-medium">{exp.title} — {exp.company} ({exp.duration})</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {rewrittenResume.education?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">Education</p>
                {rewrittenResume.education.map((e, i) => (
                  <p key={i}>{e.degree} — {e.institution} ({e.duration})</p>
                ))}
              </div>
            )}

            {/* Skills */}
            {rewrittenResume.skills?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">Skills</p>
                <p>{rewrittenResume.skills.join(', ')}</p>
              </div>
            )}

            {/* Certifications */}
            {rewrittenResume.certifications?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">Certifications</p>
                {rewrittenResume.certifications.map((c, i) => <p key={i}>{c}</p>)}
              </div>
            )}

            {/* References */}
            {rewrittenResume.references?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 uppercase text-xs tracking-wide mb-1">References</p>
                {rewrittenResume.references.map((r, i) => (
                  <p key={i} className="text-gray-600">
                    {typeof r === 'string' ? r :
                      `${r.name} — ${r.title}, ${r.company}${r.phone ? ' | ' + r.phone : ''}${r.email ? ' | ' + r.email : ''}`
                    }
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Download buttons */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Download as:</p>
            <div className="flex flex-wrap gap-3">
              {formats.map(({ label, value, color }) => (
                <button
                  key={value}
                  onClick={() => handleDownload(value)}
                  disabled={!!downloading}
                  className={`px-5 py-2 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-60 ${color}`}
                >
                  {downloading === value ? 'Downloading...' : `⬇️ ${label}`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setRewrittenResume(null)}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Rewrite again
          </button>
        </div>
      )}
    </div>
  );
}