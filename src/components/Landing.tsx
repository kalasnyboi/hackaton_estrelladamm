import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Registration from './Registration';
import Footer from './Footer';

interface LandingProps {
  onRegister: (name: string, age: number, gender: string, email: string, password: string, orientation?: string) => void;
  onGoogleRegister: () => void;
}

export default function Landing({ onRegister, onGoogleRegister }: LandingProps) {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Registration onRegister={onRegister} onGoogleRegister={onGoogleRegister} isLoggedIn={false} />
      <Footer />
    </>
  );
}
