'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      // Since India is the current location, I am prefixing +91
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setError(null); // Clear previous errors
    } catch (err) {
      setError("Failed to send OTP. Please check the phone number or try again.");
      console.error(err);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await confirmationResult.confirm(otp);
      router.push('/dashboard');
    } catch (err) {
      setError("Failed to verify OTP. Please check the code and try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div id="recaptcha-container"></div> {/* reCAPTCHA needs this */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        
        <div className="flex border-b mb-4">
          <button onClick={() => setActiveTab('email')} className={`flex-1 py-2 font-medium ${activeTab === 'email' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Email</button>
          <button onClick={() => setActiveTab('phone')} className={`flex-1 py-2 font-medium ${activeTab === 'phone' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Phone</button>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
        
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-700">Log In</button>
          </form>
        )}

        {activeTab === 'phone' && !showOtpInput && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9876543210" className="block w-full border border-gray-300 rounded-r-md shadow-sm p-2" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-700">Send OTP</button>
          </form>
        )}

        {activeTab === 'phone' && showOtpInput && (
           <form onSubmit={handleOtpVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-gray-700">Verify OTP</button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}