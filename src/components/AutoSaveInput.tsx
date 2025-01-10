import React from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { useAutoSave } from '../hooks/useAutoSave';
import { cn } from '../lib/utils';

interface AutoSaveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSave: (value: string) => Promise<void>;
  label?: string;
  debounceMs?: number;
}

const AutoSaveInput: React.FC<AutoSaveInputProps> = ({
  onSave,
  label,
  debounceMs,
  className,
  defaultValue = '',
  ...props
}) => {
  const { value, setValue, saveStatus } = useAutoSave({
    onSave,
    debounceMs,
    initialValue: defaultValue,
  });

  const statusIcon = {
    idle: null,
    saving: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
    saved: <Check className="h-4 w-4 text-green-500" />,
    error: <X className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10",
            className
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {statusIcon[saveStatus]}
        </div>
      </div>
    </div>
  );
};

export default AutoSaveInput;