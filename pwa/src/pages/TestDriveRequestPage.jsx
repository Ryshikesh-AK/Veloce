import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import { useCarContext } from '../context/CarContext';

export default function TestDriveRequestPage({ car: propCar }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { cars, customerEmail, testDriveError, submitTestDrive, testDriveCar } = useCarContext();

  const car = propCar || testDriveCar || cars.find((c) => c.id === paramId);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: customerEmail || '',
    customerPhone: '',
    preferredAt: ''
  });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  if (!car) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-400">No car selected for test drive.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer"
        >
          Browse cars
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5 max-w-xl mx-auto" data-purpose="test-drive-request-screen">
      <ScreenHeading
        eyebrow="TEST DRIVE REQUEST"
        title="Take it for a drive."
        description={car.title}
        onBack={() => navigate(-1)}
      />
      <form
        className="space-y-4 border-y border-white/10 py-5"
        onSubmit={(event) => {
          event.preventDefault();
          submitTestDrive({
            ...form,
            carId: car.id,
            carName: car.title,
            carImage: car.imageUrl,
            preferredAt: form.preferredAt ? new Date(form.preferredAt).toISOString() : new Date().toISOString()
          });
          navigate('/test-drives');
        }}
      >
        {[
          ['customerName', 'Your name', 'text', 'Jordan Miller'],
          ['customerEmail', 'Email address', 'email', 'you@example.com'],
          ['customerPhone', 'Phone number', 'tel', '+1 555 000 0000'],
          ['preferredAt', 'Preferred date and time', 'datetime-local', '']
        ].map(([field, label, type, placeholder]) => (
          <label className="block space-y-2 text-xs font-semibold text-slate-300" htmlFor={`drive-${field}`} key={field}>
            {label}
            <input
              className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              id={`drive-${field}`}
              type={type}
              value={form[field]}
              onChange={(event) => update(field, event.target.value)}
              placeholder={placeholder}
              required={field !== 'customerPhone'}
            />
          </label>
        ))}
        {testDriveError && (
          <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200" role="alert">
            {testDriveError}
          </p>
        )}
        <button
          className="min-h-12 w-full rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer"
          type="submit"
        >
          Send test-drive request
        </button>
      </form>
    </section>
  );
}
