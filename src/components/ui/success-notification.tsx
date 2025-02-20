import { CheckCircle } from 'lucide-react';

interface SuccessNotificationProps {
  title: string;
  message: string;
}

export function SuccessNotification({ title, message }: SuccessNotificationProps) {
  return (
    <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <div>
        <h3 className="font-medium text-green-900">{title}</h3>
        <p className="text-sm text-green-700">{message}</p>
      </div>
    </div>
  );
} 