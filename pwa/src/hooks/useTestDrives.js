import { useState, useEffect } from 'react';
import { listMyTestDrives, createTestDrive as createTestDriveApi } from '../services/api';
import { useLocalStorage } from './useLocalStorage';
import { EMAIL_KEY } from '../constants';

export function useTestDrives(onSuccessNavigate) {
  const [customerEmail, setCustomerEmail] = useLocalStorage(EMAIL_KEY, '');
  const [testDriveCar, setTestDriveCar] = useState(null);
  const [testDrives, setTestDrives] = useState([]);
  const [testDriveError, setTestDriveError] = useState('');

  useEffect(() => {
    if (!customerEmail) return;
    listMyTestDrives(customerEmail)
      .then(setTestDrives)
      .catch((error) => setTestDriveError(error.message));
  }, [customerEmail]);

  const findTestDrives = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    setCustomerEmail(normalizedEmail);
    setTestDriveError('');
    try {
      setTestDrives(await listMyTestDrives(normalizedEmail));
    } catch (error) {
      setTestDriveError(error.message);
    }
  };

  const submitTestDrive = async (details, setToast) => {
    setTestDriveError('');
    try {
      const request = await createTestDriveApi({
        carId: details.carId,
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        customerPhone: details.customerPhone || null,
        preferredAt: details.preferredAt
      });
      const email = details.customerEmail.trim().toLowerCase();
      setCustomerEmail(email);
      setTestDrives((previous) => [request, ...previous.filter((item) => item.id !== request.id)]);
      setTestDriveCar(null);
      if (setToast) setToast('Your request was sent to the showroom');
      if (onSuccessNavigate) onSuccessNavigate('test-drive');
    } catch (error) {
      setTestDriveError(error.message);
    }
  };

  const requestDriveForCar = (car) => {
    setTestDriveError('');
    setTestDriveCar(car);
  };

  const cancelDriveRequest = () => {
    setTestDriveCar(null);
    setTestDriveError('');
  };

  return {
    customerEmail,
    testDriveCar,
    testDrives,
    testDriveError,
    findTestDrives,
    submitTestDrive,
    requestDriveForCar,
    cancelDriveRequest
  };
}
