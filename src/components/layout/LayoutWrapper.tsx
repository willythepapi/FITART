'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/modals/AgeGate';

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();

    // Routes that should not show Navbar/Footer
    const isCreatorPanel = pathname.startsWith('/creatorpanel');
    const isPlayPage = pathname.startsWith('/play');
    const hideLayout = isCreatorPanel || isPlayPage;

    if (hideLayout) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Age Verification Gate */}
            <AgeGate />

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </>
    );
}
