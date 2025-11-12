import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      // In a real app, you would validate credentials against a backend
      console.log('Login successful');
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img src="https://placehold.co/256x256/3b82f6/ffffff?text=BlueArm" alt="BlueArm Logo" className="w-32 h-32 mx-auto rounded-lg" />
          <h1 className="text-3xl font-bold text-slate-800 mt-4">BlueArm POS</h1>
          <p className="mt-2 text-slate-600">Point of Sale System</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <label className="text-sm font-bold text-slate-700 tracking-wide">Email Address<span className="text-red-500">*</span></label>
            <input
              className="w-full text-base py-2 border-b border-slate-300 focus:outline-none focus:border-brand-blue-500"
              type="email"
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-8 content-center">
            <label className="text-sm font-bold text-slate-700 tracking-wide">Password<span className="text-red-500">*</span></label>
            <input
              className="w-full content-center text-base py-2 border-b border-slate-300 focus:outline-none focus:border-brand-blue-500"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 bg-brand-blue-500 focus:ring-brand-blue-400 border-slate-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-slate-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-brand-blue-600 hover:text-brand-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center bg-brand-blue-600 text-slate-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-200 hover:bg-brand-blue-700 disabled:bg-slate-400"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}