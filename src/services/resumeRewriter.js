export const rewriteResumeWithAI = async (resumeFile, mimeType, critique) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rewrite-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeFile, mimeType, critique })  // ← changed
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Rewrite failed');
  return data.rewrittenResume;
};

export const downloadResume = async (rewrittenResume, format) => {
  if (format === 'pdf') {
    // Dynamically import jsPDF for PDF generation in browser
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const lines = [];

    lines.push(rewrittenResume.name);
    lines.push(`${rewrittenResume.email} | ${rewrittenResume.phone} | ${rewrittenResume.location}`);
    lines.push('');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(rewrittenResume.summary);
    lines.push('');
    lines.push('EXPERIENCE');
    rewrittenResume.experience.forEach(exp => {
      lines.push(`${exp.title} — ${exp.company} (${exp.duration})`);
      exp.bullets.forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
    lines.push('EDUCATION');
    rewrittenResume.education.forEach(e => {
      lines.push(`${e.degree} — ${e.institution} (${e.duration})`);
    });
    lines.push('');
    lines.push('SKILLS');
    lines.push(rewrittenResume.skills.join(', '));
    if (rewrittenResume.certifications?.length) {
      lines.push('');
      lines.push('CERTIFICATIONS');
      rewrittenResume.certifications.forEach(c => lines.push(c));
    }

    // Word wrap and write lines
    let y = 20;
    lines.forEach(line => {
      const wrapped = doc.splitTextToSize(line, 180);
      wrapped.forEach(wline => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(wline, 15, y);
        y += 7;
      });
    });

    doc.save('resume.pdf');
    return;
  }

  // For txt, doc, docx — fetch from backend
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/download-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rewrittenResume, format })
  });

  if (!response.ok) throw new Error('Download failed');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};