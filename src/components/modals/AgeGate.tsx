'use client';

import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useUserStore } from '@/store/userStore';

export function AgeGate() {
    const { isAgeVerified, verifyAge } = useUserStore();
    const [error, setError] = useState(false);

    if (isAgeVerified) return null;

    const handleVerify = () => {
        verifyAge();
    };

    const handleDeny = () => {
        setError(true);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[var(--zz-bg-deep)] flex items-center justify-center p-4">
            <div className="max-w-sm w-full text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Logo size="lg" />
                </div>

                {/* Content */}
                <h1 className="text-xl font-semibold text-white mb-2">
                    Age Verification
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                    This platform contains mature content. You must be 18 or older to continue.
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-4">
                        You must be 18 or older to access this content.
                    </p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleVerify}
                        className="w-full py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors"
                    >
                        I am 18 or older
                    </button>
                    <button
                        onClick={handleDeny}
                        className="w-full py-3 bg-transparent text-text-secondary hover:text-white border border-text-secondary/30 rounded transition-colors"
                    >
                        I am under 18
                    </button>
                </div>

                {/* Terms */}
                <p className="text-xs text-text-muted mt-6">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-white">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
