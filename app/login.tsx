'use client';

import { useState } from 'react';
import { useAuth } from './auth-context';

const DEMO_PASSPHRASE = 'demo';

export function Login() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const submit = async (value: string) => {
    setSubmitting(true);
    setError('');
    const success = await login(value);
    setSubmitting(false);
    if (!success) {
      setError('Incorrect passphrase');
      setPassphrase('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(passphrase);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Drone Documents
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Authority-ready access to your drone documentation
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Enter your secure passphrase to access documents
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="passphrase" className="sr-only">
                Passphrase
              </label>
              <input
                id="passphrase"
                name="passphrase"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4" role="alert">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {submitting ? 'Checking...' : 'Access Documents'}
            </button>
          </div>
        </form>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Recruiter or visitor?</p>
          <p className="mt-1">
            Use the demo passphrase <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold">{DEMO_PASSPHRASE}</code>.
            It opens fictional sample documents for Max Mustermann, not real papers.
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit(DEMO_PASSPHRASE)}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-amber-300 bg-white px-4 py-2 font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 min-h-[44px]"
          >
            View demo
          </button>
        </div>
      </div>
    </div>
  );
}
