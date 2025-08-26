
export const exportToCSV = (data, filename) => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const convertToCSV = (data) => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

export const exportConcernsReport = async (concerns, filters = {}) => {
  const filteredData = concerns
    .filter(concern => {
      if (filters.status && filters.status !== 'All') {
        return concern.status === filters.status;
      }
      if (filters.category && filters.category !== 'All') {
        return concern.category === filters.category;
      }
      return true;
    })
    .map(concern => ({
      ID: concern.id,
      Title: concern.title,
      Category: concern.category,
      Status: concern.status,
      'Student Name': concern.student_name,
      'Created Date': new Date(concern.timestamp).toLocaleDateString(),
      'Helpful Votes': concern.helpful_votes || 0,
      'Not Helpful Votes': concern.not_helpful_votes || 0
    }));

  const filename = `concerns_report_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(filteredData, filename);
};
