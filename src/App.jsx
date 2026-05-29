import {
  AIEmployeesSection,
  BeforeAfterSection,
  Contact,
  CTASection,
  Footer,
  Hero,
  HowItWorks,
  MetricStrip,
  Navbar,
  ProblemSection,
  SolutionSection,
  UseCases
} from './components';

export default function App() {
  return (
    <>
      <div className="background-grid" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <MetricStrip />
        <ProblemSection />
        <SolutionSection />
        <AIEmployeesSection />
        <HowItWorks />
        <UseCases />
        <BeforeAfterSection />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
