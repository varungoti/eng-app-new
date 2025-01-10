export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value == null) return '0%';
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null) return '0';
  return value.toLocaleString('en-IN');
};

export const formatDistanceToNow = (date: Date | string): string => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }
  
  return then.toLocaleDateString();
};