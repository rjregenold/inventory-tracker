'use client';

import {ApiError} from '@/lib/api/client';
import {useAuth} from '@/lib/contexts/auth-context';
import {AuthService} from '@/lib/services/auth.service';
import {Result} from '@/lib/types/result';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function SignIn() {
  const {signIn} = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestOtp = async () => {
    setLoading(true);
    Result.fold(
      await AuthService.createOtp(email),
      () => {
        setStep('code');
        setError('');
      },
      (err) => setError(ApiError.toString(err)),
    );
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    Result.fold(
      await AuthService.createSession(email, code),
      (token) => {
        if (token) {
          signIn(token);
          setLoading(false);
          return router.push('/purchase-orders');
        }

        setError('Sign in failed. Please try again.');
      },
      (err) => setError(ApiError.toString(err)),
    );
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-2xl mb-4">Sign In</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {!!error && <div className="alert alert-error">{error}</div>}
        {step === 'email' ? (
          <>
            <div className="mb-4">
              <p>To get started, enter your email address.</p>
              <p>
                We will send you a code you can use to sign in or create an
                account.
              </p>
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input input-bordered w-full md:w-1/3"
                required
              />
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={requestOtp}
                disabled={loading}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <p>Please enter the 6-digit code sent to {email}.</p>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
                className="input input-bordered w-full md:w-1/3"
                maxLength={6}
                required
              />
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={verifyOtp}
                disabled={loading}
              >
                Next
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
