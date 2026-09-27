export const TEST_DRIVES_KEY = 'veloce-test-drive-requests';

export const readTestDrives = () => {
  try {
    const requests = JSON.parse(localStorage.getItem(TEST_DRIVES_KEY) || '[]');
    return Array.isArray(requests) ? requests : [];
  } catch {
    return [];
  }
};

export const formatDateTime = (value) => value
  ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  : 'Time pending';

export const getLocalDateTimeValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};