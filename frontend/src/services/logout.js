import api from "./api";

let isLoggingOut = false;
let lastActivity = Date.now();
let inactivityInterval = null;

const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll',
  'touchstart', 'click', 'keydown', 'wheel', 'pointermove'];

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
    await performCleanup();
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

export const getIsLoggingOut = () => isLoggingOut;

const initLogoutService = () => {
  setupActivityTracking();
  setupInactivityChecker();
};


if (typeof window !== 'undefined') {
  initLogoutService();
}