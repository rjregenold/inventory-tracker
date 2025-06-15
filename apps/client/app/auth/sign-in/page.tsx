'use client';

import {ApiError} from '@/lib/api/client';
import {AuthService} from '@/lib/services/auth.service';
import {Result} from '@/lib/types/result';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function SignIn() {
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
          AuthService.saveJwt(token);
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
    <form onSubmit={(e) => e.preventDefault()}>
      {!!error && <div className="alert alert-error">{error}</div>}
      {step === 'email' ? (
        <>
          <p>To get started, enter your email address</p>
          <p>
            We will send you a code you can use to sign in or create an account.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />
          <button className="btn" onClick={requestOtp} disabled={loading}>
            Next
          </button>
        </>
      ) : (
        <>
          <p>Please enter the 6-digit code sent to {email}.</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
          <button className="btn" onClick={verifyOtp} disabled={loading}>
            Next
          </button>
        </>
      )}
    </form>
  );
}
