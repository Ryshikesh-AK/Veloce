/**
 * Web Haptics Utility using navigator.vibrate
 */
export const triggerHaptic = (pattern) => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
};

export const hapticTab = () => triggerHaptic(10);
export const hapticFilter = () => triggerHaptic(10);
export const hapticCard = () => triggerHaptic(20);
export const hapticAction = () => triggerHaptic([10, 30, 15]);
export const hapticSuccess = () => triggerHaptic([15, 40, 20]);
export const hapticError = () => triggerHaptic([30, 50, 30]);
