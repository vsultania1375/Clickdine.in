import React, { useEffect } from 'react';
import {
  AIEmployeesSection,
  BeforeAfterSection,
  Contact,
  CTASection,
  Footer,
  Hero,
  HowItWorks,
  LegalPage,
  MetricStrip,
  Navbar,
  ProblemSection,
  SolutionSection,
  UseCases
} from './components';

const privacySections = [
  {
    heading: 'AI Munim Privacy Policy',
    paragraphs: [
      'Effective Date: 04 July 2026',
      'AI Munim is a WhatsApp-based business assistant used to help business owners process accounting and operational requests such as invoice previews, payment reminders, ERP-related queries, attendance/payment follow-ups, and similar business workflows.'
    ]
  },
  {
    heading: 'Information We Collect',
    paragraphs: [
      'When a user interacts with AI Munim through WhatsApp, we may process the user’s WhatsApp number, message content, timestamps, and business-related information voluntarily shared by the user. If connected to a business system such as ERPNext, AI Munim may read relevant business records required to respond to the user’s request.'
    ]
  },
  {
    heading: 'How We Use Information',
    paragraphs: [
      'We use this information only to understand the user’s request, generate relevant business responses, prepare previews such as invoice drafts, and improve the reliability and safety of the service.'
    ]
  },
  {
    heading: 'WhatsApp and Third-Party Processing',
    paragraphs: [
      'AI Munim uses Meta WhatsApp Cloud API for sending and receiving WhatsApp messages. Message delivery and WhatsApp account handling are governed by Meta’s applicable terms and policies.'
    ]
  },
  {
    heading: 'Data Sharing',
    paragraphs: [
      'We do not sell personal data. We do not share WhatsApp message data with advertisers. Data may be processed only by service providers or systems required to operate the requested business workflow.'
    ]
  },
  {
    heading: 'Data Retention',
    paragraphs: [
      'We retain message/session data only for as long as required for operational, security, audit, and legal purposes. Test/demo data may be deleted on request.'
    ]
  },
  {
    heading: 'User Control and Data Deletion',
    paragraphs: [
      'Users can request deletion of their associated data by emailing vsultania1375@gmail.com with their WhatsApp number and deletion request.'
    ]
  },
  {
    heading: 'Contact',
    paragraphs: [
      'For privacy-related questions, contact:',
      'Vivek Rao',
      'Email: vsultania1375@gmail.com',
      'Location: Gurugram, Haryana, India'
    ]
  }
];

const deletionSections = [
  {
    heading: 'AI Munim Data Deletion Instructions',
    paragraphs: [
      'Users can request deletion of their AI Munim data by sending an email to:',
      'vsultania1375@gmail.com'
    ]
  },
  {
    heading: 'Please include',
    list: [
      'Your WhatsApp number used with AI Munim',
      'A short message saying: “Please delete my AI Munim data”'
    ]
  },
  {
    heading: 'Review and Deletion',
    paragraphs: [
      'After receiving the request, we will review and delete associated message/session data where legally and operationally possible.',
      'Some data may be retained if required for security, fraud prevention, legal compliance, audit records, or legitimate business obligations.'
    ]
  },
  {
    heading: 'Contact',
    paragraphs: [
      'For any questions, contact:',
      'Vivek Rao',
      'Email: vsultania1375@gmail.com',
      'Location: Gurugram, Haryana, India'
    ]
  }
];

function HomePage() {
  return (
    <>
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

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

export default function App() {
  const path = normalizePathname(window.location.pathname);
  const isPrivacyPage = path === '/privacy';
  const isDeletionPage = path === '/data-deletion';

  useEffect(() => {
    if (isPrivacyPage) {
      document.title = 'Privacy Policy | Clickdine.in';
      return;
    }

    if (isDeletionPage) {
      document.title = 'Data Deletion Instructions | Clickdine.in';
      return;
    }

    document.title = 'Clickdine.in | AI Automation Agency for Corporate Teams';
  }, [isPrivacyPage, isDeletionPage]);

  return (
    <>
      <div className="background-grid" aria-hidden="true" />
      {isPrivacyPage ? (
        <LegalPage title="Privacy Policy" sections={privacySections} />
      ) : isDeletionPage ? (
        <LegalPage title="Data Deletion Instructions" sections={deletionSections} />
      ) : (
        <HomePage />
      )}
    </>
  );
}
