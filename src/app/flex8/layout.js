import styles from './page.module.css';

export const metadata = {
  title: "Flex8 Slim Program | 8 Weeks to Flexi-Carb Wellness",
  description: "Find board-certified dietitians and discover your unique hormone type. Achieve sustainable weight loss with 1-on-1 guidance from top nutritionists.",
};

export default function Flex8Layout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {children}
    </>
  );
}
