import Navbar from '@/app/components/Navbar';

export const metadata = { title: '藥物管理 | Medication Tracker' };

export default function MedicationsLayout({ children }) {
    return (
        <>
            {children}
            <Navbar />
        </>
    );
}
