import { useState, lazy, Suspense } from 'react';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';

const DatabaseMonitor = lazy(() => import('./DatabaseMonitor'));

export function DevMenu() {
  const [showDatabaseMonitor, setShowDatabaseMonitor] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-sm font-medium mb-2">Development Tools</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDatabaseMonitor(!showDatabaseMonitor)}
      >
        {showDatabaseMonitor ? 'Hide' : 'Show'} Database Monitor
      </Button>

      {showDatabaseMonitor && (
        <Suspense fallback={
          <div className="mt-4 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading monitor...
          </div>
        }>
          <DatabaseMonitor />
        </Suspense>
      )}
    </div>
  );
} 