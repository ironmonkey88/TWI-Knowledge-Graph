import React from 'react';
import { GoogleIcon } from './icons/Icons';

interface LoginScreenProps {
  onLoginAttempt: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginAttempt }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center p-8 bg-stone-900">
      <div className="text-center max-w-sm w-full bg-stone-800/50 p-8 rounded-2xl shadow-2xl border border-amber-800/50">
        <h1 className="text-4xl font-fancy text-amber-300">The Wandering Inn Companion</h1>
        <p className="text-amber-200 text-sm mt-2 mb-8">AI-Powered Encyclopedia</p>

        <p className="text-amber-100/80 mb-6">
          Sign in with your Google account to access your personal encyclopedia from any device.
        </p>

        <button
          onClick={onLoginAttempt}
          className="w-full px-4 py-3 bg-white text-stone-800 font-semibold rounded-lg shadow-md hover:bg-stone-200 disabled:bg-stone-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
        >
          <GoogleIcon className="h-6 w-6 mr-3" />
          Sign in with Google
        </button>
        <p className="mt-6 text-xs text-stone-500">
          This is a fan-made project and is not affiliated with pirateaba.
        </p>
      </div>
    </div>
  );
};