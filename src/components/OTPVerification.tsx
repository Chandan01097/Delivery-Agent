import React, { useState, useEffect } from 'react';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OTPVerificationProps {
  onViewChange: (view: 'login' | 'signup' | 'otp' | 'dashboard' | 'order-details') => void;
}

export function OTPVerification({ onViewChange }: OTPVerificationProps) {
  const { pendingUser, login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (pendingUser) {
      login(pendingUser.mobile, pendingUser.name);
    }
    
    setIsLoading(false);
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <Smartphone className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Verify Your Mobile</h1>
            <p className="text-purple-100 mt-2">Enter the 6-digit code sent to</p>
            <p className="text-white font-medium">{pendingUser?.mobile}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter OTP Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="mt-6 text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend code in {timeLeft}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-purple-600 hover:text-purple-500 font-medium text-sm"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => onViewChange('login')}
                className="flex items-center justify-center text-gray-600 hover:text-gray-500 text-sm mx-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}