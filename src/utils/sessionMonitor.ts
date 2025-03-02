export class SessionMonitor {
  getSessionInfo() {
    return {
      isActive: true,
      lastActivity: Date.now(),
      tokenExpiry: null
    };
  }

  isHealthy() {
    const currentTime = Date.now();
    const sessionInfo = this.getSessionInfo();
    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes
    
    // Check if session is active and within inactivity threshold
    if (!sessionInfo.isActive || 
        (currentTime - sessionInfo.lastActivity) > inactivityThreshold) {
      return false;
    }

    // Check token expiry if exists
    if (sessionInfo.tokenExpiry && currentTime > sessionInfo.tokenExpiry) {
      return false;
    }
    return true;
  }

  async refresh() {
    try {
      // Refresh session token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to refresh session');
      }

      const { expiresAt } = await response.json();

      // Clear stale data from storage
      localStorage.removeItem('staleSessionData');
      sessionStorage.clear();

      // Update session info
      const sessionInfo = {
        isActive: true,
        lastActivity: Date.now(),
        tokenExpiry: expiresAt
      };

      // Store updated session info
      localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));

      return sessionInfo;
    } catch (error) {
      console.error('Session refresh failed:', error);
      throw error;
    }
  }
} 