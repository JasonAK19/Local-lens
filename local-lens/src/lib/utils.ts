export function formatTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  const hours = Math.floor(diff / 3600);
  
  if (hours < 1) return `${Math.floor(diff / 60)}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function getSubredditsForLocation(location: string): string[] {
  const locationMap: Record<string, string[]> = {
    'Baltimore, MD': ['baltimore', 'maryland', 'dmv'],
    'Annapolis, MD': ['annapolis', 'maryland'],
    'Columbia, MD': ['columbia', 'maryland', 'howardcounty'],
    'Towson, MD': ['towson', 'maryland', 'baltimore']
  };
  
  return locationMap[location] || ['baltimore', 'maryland'];
}