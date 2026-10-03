import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import EmptyState from '../components/common/EmptyState';
import CarPhoto from '../components/cars/CarPhoto';
import { useCarContext } from '../context/CarContext';

export default function TestDrivesPage() {
  const navigate = useNavigate();
  const { testDrives, customerEmail, testDriveError, findTestDrives } = useCarContext();

  const [emailDraft, setEmailDraft] = useState(customerEmail || '');
  const visibleRequests = testDrives.filter(
    (request) => request.customerEmail?.toLowerCase() === (customerEmail || '').toLowerCase()
  );

  return (
    <section className="space-y-5 max-w-2xl mx-auto" data-purpose="test-drives-screen">
      <ScreenHeading
        eyebrow="APPOINTMENTS"
        title="Your test drives."
        description="Look up your requests and see the latest appointment status."
      />
      <form
        className="space-y-3 border-y border-white/10 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          findTestDrives(emailDraft);
        }}
      >
        <label className="block text-xs font-semibold text-slate-300" htmlFor="mobile-test-drive-email">
          Email used for your request
        </label>
        <input
          className="min-h-12 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          id="mobile-test-drive-email"
          type="email"
          value={emailDraft}
          onChange={(event) => setEmailDraft(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <button
          className="min-h-11 w-full rounded-lg border border-white/15 text-sm font-semibold text-white hover:bg-white/5 cursor-pointer"
          type="submit"
        >
          Find my requests
        </button>
      </form>
      {testDriveError && (
        <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200" role="alert">
          {testDriveError}
        </p>
      )}
      <div className="space-y-3">
        {visibleRequests.map((request) => (
          <article
            className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60"
            key={request.id}
          >
            <div className="flex gap-3 p-3">
              <CarPhoto
                className="size-20 shrink-0 rounded-lg object-cover"
                src={request.carImage}
                alt={request.carName}
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white">{request.carName}</h2>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    request.status === 'approved'
                      ? 'bg-emerald-400/15 text-emerald-300'
                      : request.status === 'declined'
                      ? 'bg-rose-400/15 text-rose-300'
                      : 'bg-amber-300/15 text-amber-200'
                  }`}
                >
                  {request.status}
                </span>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Preferred: {new Date(request.preferredAt).toLocaleString()}
                </p>
                {request.approvedAt && (
                  <p className="mt-1 text-xs text-emerald-300">
                    Confirmed: {new Date(request.approvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
        {visibleRequests.length === 0 && !testDriveError && (
          <EmptyState
            title={customerEmail ? 'No requests found' : 'Find your test-drive requests'}
            description={
              customerEmail
                ? 'No requests are linked to that email address yet.'
                : 'Enter the email address you used when requesting a test drive.'
            }
            actionLabel="Browse cars"
            onAction={() => navigate('/')}
          />
        )}
      </div>
    </section>
  );
}
