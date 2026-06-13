import Layout from './components/Layout';
import HeroClientWrapper from './components/HeroClient';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import AppointmentSection from './components/appointments/AppointmentSection';
import Contact from './components/Contact';

export default function Home() {
  return (
    <Layout>
      <HeroClientWrapper />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Resume />
      <AppointmentSection />
      <Contact />
    </Layout>
  );
}
