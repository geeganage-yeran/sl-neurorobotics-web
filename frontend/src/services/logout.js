import api from "./api";

let isLoggingOut = false;
let lastActivity = Date.now();
let inactivityInterval = null;

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

export const callLogoutAPI = async () => {
  try {
    const response = await api.post('/auth/logout', {
      withCredentials: true,
      timeout: 10000,
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('Logout successful:', response.data.message);
      return true;
    } else {
      console.error('Logout failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
    return false;
  }
};

const performCleanup = async (navigate = null) => {
  sessionStorage.clear();
  if (navigate && typeof navigate === 'function') {
    navigate('/login');
  } else {
    window.location.href = '/login';
  }
};

// Manual logout (called from button)
export const handleSignOut = async (navigate = null) => {
  if (isLoggingOut) return;
  
  isLoggingOut = true;
  
  try {
    await callLogoutAPI();
    await performCleanup(navigate);
  } catch (error) {
    console.error('Error during logout:', error);
    await performCleanup(navigate);
  } finally {
    isLoggingOut = false;
  }
};

const updateActivity = () => {
  lastActivity = Date.now();
};

const checkInactivity = async () => {
  const now = Date.now();
  if (now - lastActivity > INACTIVITY_TIMEOUT) {
    console.log('User inactive for 1 hour, logging out...');
    await callLogoutAPI();
    await performCleanup(); // No navigate available for automatic logout
  }
};

const setupActivityTracking = () => {
  ACTIVITY_EVENTS.forEach(event => {
    document.addEventListener(event, updateActivity, true);
  });
};

const setupInactivityChecker = () => {
  if (inactivityInterval) clearInterval(inactivityInterval);
  inactivityInterval = setInterval(checkInactivity, 60000);
};

const setupPageUnloadHandlers = () => {
  const handleBeforeUnload = async() => {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/auth/logout', new FormData());
    }
    await callLogoutAPI();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
};

export const getIsLoggingOut = () => isLoggingOut;

const initLogoutService = () => {
  setupActivityTracking();
  setupInactivityChecker();
  setupPageUnloadHandlers();
};


if (typeof window !== 'undefined') {
  initLogoutService();
}