import Navbar from '@/app/components/Navbar';

export const metadata = { title: '服用日曆 | Health Calendar' };

export default function CalendarLayout({ children }) {
    return (
        <>
            {children}
            <Navbar />
        </>
    );
}
