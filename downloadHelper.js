export function downloadCSVResults() {
  try {
    const key = 'sdmt_results';
    const raw = localStorage.getItem(key);
    if (!raw) {
      alert('Kayıtlı sonuç bulunamadı.');
      return;
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) {
      alert('Kayıtlı sonuç bulunamadı.');
      return;
    }

    const headers = [
      'name',
      'company',
      'score',
      'accuracy',
      'durationSeconds',
      'total',
      'correct',
      'endedAt'
    ];

    const escape = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const lines = [];
    lines.push(headers.join(','));
    for (const row of data) {
      const line = headers.map((h) => escape(row[h])).join(',');
      lines.push(line);
    }
    const csv = lines.join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sdmt_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert('CSV dışa aktarma sırasında bir hata oluştu.');
  }
}

// Optional: expose to window for debugging/manual triggers
try { window.downloadCSVResults = downloadCSVResults; } catch (_) {}


