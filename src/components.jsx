import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  AlertCircle,
  BrainCircuit,
  Check,
  ChevronRight,
  ClipboardCheck,
  MoveRight,
  Network,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  afterList,
  assistants,
  beforeList,
  metrics,
  navLinks,
  problems,
  steps,
  trustSignals,
  useCases,
  workflowNodes
} from './data';

function ButtonLink({ href, children, variant = 'primary', className = '' }) {
  return (
    <a className={`${variant}-btn ${className}`.trim()} href={href}>
      {children}
    </a>
  );
}

function SectionIntro({ eyebrow, title, copy, titleId }) {
  return (
    <div className="section-intro">
      <p>{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
      {copy ? <span>{copy}</span> : null}
    </div>
  );
}

function InfoCard({ icon: Icon, title, copy, className = 'glass-card' }) {
  return (
    <article className={className}>
      {Icon ? <Icon className="card-icon" size={24} aria-hidden="true" /> : null}
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

function BrandLogo() {
  return (
    <>
      <img className="brand-logo" src="/logo.png" alt="Clickdine.in logo" />
      <span>Clickdine.in</span>
    </>
  );
}

export function LegalPage({ title, sections }) {
  return (
    <main className="legal-shell">
      <a className="brand legal-brand" href="/" aria-label="Clickdine.in home">
        <BrandLogo />
      </a>
      <article className="legal-card">
        <p className="legal-eyebrow">Clickdine.in</p>
        <h1>{title}</h1>
        {sections.map((section) => (
          <section className="legal-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>
                {paragraph.includes('@') ? (
                  <a href={`mailto:${paragraph.replace('Email: ', '')}`}>{paragraph}</a>
                ) : (
                  paragraph
                )}
              </p>
            ))}
            {section.list ? (
              <ul>
                {section.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </main>
  );
}

const defaultLabConfig = {
  backendUrl: 'https://wa.clickdine.in',
  tenantId: 'demo-business',
  sender: '919813423175',
  message: 'Gupta ji ko 20 cement bag ka bill banao'
};

const labTokenStorageKey = 'clickdine_munim_lab_token';

function normalizeBackendUrl(url) {
  return url.replace(/\/+$/, '');
}

function FieldValue({ label, value }) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const isObject = typeof value === 'object';

  return (
    <div className="munim-lab-result-row">
      <dt>{label}</dt>
      <dd>{isObject ? <pre>{JSON.stringify(value, null, 2)}</pre> : String(value)}</dd>
    </div>
  );
}

function ResponsePanel({ result }) {
  if (!result) {
    return (
      <div className="munim-lab-empty">
        Send a text or voice message to see AI Munim’s response here.
      </div>
    );
  }

  return (
    <div className="munim-lab-response">
      <dl>
        <FieldValue label="Status" value={result.status || result.http_status} />
        <FieldValue label="Transcript" value={result.transcript} />
        <FieldValue label="Workflow" value={result.workflow} />
        <FieldValue label="Task ID" value={result.task_id} />
        <FieldValue label="State" value={result.state} />
        <FieldValue label="Reply" value={result.reply || result.message} />
        <FieldValue label="Confirmation Card" value={result.confirmation_card} />
        <FieldValue label="Resolved Data" value={result.resolved || result.resolved_data || result.data} />
        <FieldValue label="Warnings" value={result.warnings} />
      </dl>
      <details>
        <summary>Raw JSON</summary>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </details>
    </div>
  );
}

export function MunimLabPage() {
  const [backendUrl, setBackendUrl] = useState(defaultLabConfig.backendUrl);
  const [token, setToken] = useState(() => localStorage.getItem(labTokenStorageKey) || '');
  const [tenantId, setTenantId] = useState(defaultLabConfig.tenantId);
  const [sender, setSender] = useState(defaultLabConfig.sender);
  const [message, setMessage] = useState(defaultLabConfig.message);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingStatus, setRecordingStatus] = useState('Idle');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const mediaSupported = typeof window !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  const isLoading = status === 'loading';
  const activeTaskId = result?.task_id;

  function handleTokenChange(value) {
    setToken(value);
    if (value) {
      localStorage.setItem(labTokenStorageKey, value);
    } else {
      localStorage.removeItem(labTokenStorageKey);
    }
  }

  function ensureToken() {
    if (!token.trim()) {
      setError('Enter the AI Munim test token before sending a request.');
      return false;
    }
    return true;
  }

  async function postJson(payload) {
    if (!ensureToken()) return;

    setStatus('loading');
    setError('');

    try {
      const response = await fetch(`${normalizeBackendUrl(backendUrl)}/test/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Munim-Test-Token': token
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult({ http_status: response.status, ...data });

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'AI Munim request failed.');
      }

      setStatus('success');
    } catch (requestError) {
      setStatus('error');
      setError(requestError.message || 'Unable to send request to AI Munim.');
    }
  }

  function sendText() {
    postJson({
      tenant_id: tenantId,
      sender,
      message
    });
  }

  function continueTask(nextMessage) {
    postJson({
      tenant_id: tenantId,
      sender,
      continue_task: activeTaskId,
      message: nextMessage
    });
  }

  async function startRecording() {
    if (!mediaSupported) {
      setError('MediaRecorder is not supported in this browser.');
      return;
    }

    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        setRecordingStatus('Recording ready to send');
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingStatus('Recording...');
    } catch {
      setError('Microphone access was blocked or unavailable.');
      setRecordingStatus('Idle');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function sendVoice() {
    if (!ensureToken()) return;
    if (!audioBlob) {
      setError('Record audio before sending a voice test.');
      return;
    }

    setStatus('loading');
    setError('');

    const formData = new FormData();
    formData.append('tenant_id', tenantId);
    formData.append('sender', sender);
    formData.append('audio_file', audioBlob, 'munim-lab-audio.webm');

    try {
      const response = await fetch(`${normalizeBackendUrl(backendUrl)}/test/voice`, {
        method: 'POST',
        headers: {
          'X-Munim-Test-Token': token
        },
        body: formData
      });

      const data = await response.json();
      setResult({ http_status: response.status, ...data });

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'AI Munim voice request failed.');
      }

      setStatus('success');
    } catch (requestError) {
      setStatus('error');
      setError(requestError.message || 'Unable to send voice request to AI Munim.');
    }
  }

  return (
    <main className="munim-lab">
      <section className="munim-lab-hero">
        <a className="brand" href="/" aria-label="Clickdine.in home">
          <BrandLogo />
        </a>
        <div>
          <p className="munim-lab-eyebrow">Hidden test route</p>
          <h1>AI Munim Lab Console</h1>
          <p>Temporary browser test channel for AI Munim. WhatsApp is bypassed.</p>
        </div>
      </section>

      <section className="munim-lab-notice">
        This lab bypasses WhatsApp and is for development testing only. Do not share the test token.
      </section>

      <section className="munim-lab-grid">
        <div className="munim-lab-stack">
          <article className="munim-lab-card">
            <h2>Configuration</h2>
            <label>
              Backend URL
              <input value={backendUrl} onChange={(event) => setBackendUrl(event.target.value)} />
            </label>
            <label>
              Test token
              <input
                type="password"
                value={token}
                onChange={(event) => handleTokenChange(event.target.value)}
                placeholder="Enter token from AI Munim .env"
              />
            </label>
            <label>
              Tenant ID
              <input value={tenantId} onChange={(event) => setTenantId(event.target.value)} />
            </label>
            <label>
              Sender
              <input value={sender} onChange={(event) => setSender(event.target.value)} />
            </label>
          </article>

          <article className="munim-lab-card">
            <h2>Text message test</h2>
            <label>
              Message
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
            </label>
            <button type="button" onClick={sendText} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Text'}
            </button>
            {activeTaskId ? (
              <div className="munim-lab-approval">
                <span>Task ID: <strong>{activeTaskId}</strong></span>
                <div>
                  <button type="button" onClick={() => continueTask('approve')} disabled={isLoading}>Approve</button>
                  <button type="button" className="munim-lab-secondary" onClick={() => continueTask('reject')} disabled={isLoading}>Reject</button>
                </div>
              </div>
            ) : null}
          </article>

          <article className="munim-lab-card">
            <h2>Voice test</h2>
            {!mediaSupported ? (
              <p className="munim-lab-error">MediaRecorder is not supported in this browser.</p>
            ) : null}
            <p className="munim-lab-muted">Status: {recordingStatus}</p>
            <div className="munim-lab-actions">
              <button type="button" onClick={startRecording} disabled={!mediaSupported || isRecording}>Record</button>
              <button type="button" className="munim-lab-secondary" onClick={stopRecording} disabled={!isRecording}>Stop</button>
              <button type="button" onClick={sendVoice} disabled={!audioBlob || isLoading}>Send Voice</button>
            </div>
            {audioUrl ? <audio controls src={audioUrl} /> : null}
          </article>
        </div>

        <article className="munim-lab-card">
          <h2>Response</h2>
          {error ? <p className="munim-lab-error">{error}</p> : null}
          <ResponsePanel result={result} />
        </article>
      </section>
    </main>
  );
}

export function Navbar() {
  return (
    <header className="navbar" role="banner">
      <a className="brand" href="#top" aria-label="Clickdine.in home">
        <BrandLogo />
      </a>
      <nav aria-label="Primary navigation">
        {navLinks.map(([label, id]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#contact">
        Book AI Automation Call
      </a>
    </header>
  );
}

function WorkflowVisual() {
  return (
    <div className="hero-visual-shell" aria-label="AI workflow automation preview">
      <div className="floating-card floating-card-one" aria-hidden="true">
        <span>Saved this week</span>
        <strong>42 hrs</strong>
      </div>
      <div className="floating-card floating-card-two" aria-hidden="true">
        <span>Agent status</span>
        <strong>Live</strong>
      </div>
      <div className="workflow-visual">
        <div className="panel-top">
          <div>
            <p>Automation Command Center</p>
            <h3>Revenue Ops Workflow</h3>
          </div>
          <span className="live-pill"><span aria-hidden="true" /> Live</span>
        </div>
        <div className="system-health" aria-label="Workflow health metrics">
          <div>
            <span>AI Employees Active</span>
            <strong>08</strong>
          </div>
          <div>
            <span>Manual Steps Removed</span>
            <strong>73%</strong>
          </div>
        </div>
        <div className="workflow-track">
          {workflowNodes.map(([title, copy, badge, Icon]) => (
            <div className="workflow-row" key={title}>
              <div className="node-icon" aria-hidden="true">
                <Icon size={17} />
              </div>
              <div className="node-card">
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
                <span>{badge}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mini-dashboard" aria-label="Automation impact metrics">
          <div>
            <span>Tasks automated</span>
            <strong>1,284</strong>
          </div>
          <div>
            <span>Cycle time</span>
            <strong>-73%</strong>
          </div>
          <div>
            <span>Accuracy</span>
            <strong>99.2%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero section" id="top" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="eyebrow"><Sparkles size={16} aria-hidden="true" /> Enterprise AI automation systems</div>
        <h1 id="hero-title">AI Employees for Teams That Want <span>20x Productivity</span></h1>
        <p>
          Clickdine.in builds custom AI automation systems for corporates - automating repetitive
          work, reducing team load, and helping companies scale operations without scaling headcount.
        </p>
        <p className="positioning-line">
          We do not just build chatbots. We build AI employees that work inside your business workflows.
        </p>
        <div className="hero-actions">
          <ButtonLink href="#contact">Book a Free Automation Audit <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
          <ButtonLink href="#use-cases" variant="secondary">Explore Use Cases <ChevronRight size={18} aria-hidden="true" /></ButtonLink>
        </div>
        <div className="hero-proof">
          <span><ShieldCheck size={16} aria-hidden="true" /> Built for corporate workflows</span>
          <span><Zap size={16} aria-hidden="true" /> Deploy across departments</span>
        </div>
        <div className="trust-row" aria-label="Clickdine.in service capabilities">
          {trustSignals.map((signal) => <span key={signal}>{signal}</span>)}
        </div>
      </div>
      <WorkflowVisual />
    </section>
  );
}

export function MetricStrip() {
  return (
    <section className="stats section" aria-label="Automation metrics">
      {metrics.map(([value, label, detail]) => (
        <article className="metric-card" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
          <p>{detail}</p>
        </article>
      ))}
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="section" id="problem" aria-labelledby="problem-title">
      <SectionIntro
        eyebrow="The productivity leak"
        titleId="problem-title"
        title="Your teams are busy. But not always productive."
        copy="Most growing teams do not need more dashboards, meetings, or manual checklists. They need repetitive work to happen reliably in the background."
      />
      <div className="card-grid four">
        {problems.map((problem) => <InfoCard key={problem.title} {...problem} />)}
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="section solution-band" id="solutions" aria-labelledby="solution-title">
      <SectionIntro
        eyebrow="The Clickdine.in system"
        titleId="solution-title"
        title="Deploy automation systems that operate inside your company."
        copy="We connect AI agents to the tools your teams already use, then design the workflows, permissions, handoffs, and reporting loops that make automation reliable."
      />
      <div className="solution-proof">
        <span>Gmail</span>
        <span>WhatsApp</span>
        <span>CRM</span>
        <span>Sheets</span>
        <span>ERP</span>
        <span>Dashboards</span>
        <span>Internal portals</span>
        <span>Databases</span>
      </div>
    </section>
  );
}

export function AIEmployeesSection() {
  return (
    <section className="section" id="ai-employees" aria-labelledby="ai-employees-title">
      <SectionIntro
        eyebrow="AI employees"
        titleId="ai-employees-title"
        title="Specialized agents for every repetitive department workflow."
        copy="Each AI employee is designed around a business outcome: fewer manual steps, faster response times, cleaner data, and better visibility for managers."
      />
      <div className="card-grid three">
        {assistants.map(([title, copy, Icon]) => (
          <article className="assistant-card" key={title}>
            <div className="assistant-icon" aria-hidden="true"><Icon size={22} /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span>Connect, act, report <MoveRight size={15} aria-hidden="true" /></span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="section" id="how-it-works" aria-labelledby="how-it-works-title">
      <SectionIntro eyebrow="Implementation model" title="How it works" titleId="how-it-works-title" />
      <div className="steps">
        {steps.map(([title, copy], index) => (
          <article className="step-card" key={title}>
            <span aria-label={`Step ${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function UseCases() {
  return (
    <section className="section" id="use-cases" aria-labelledby="use-cases-title">
      <SectionIntro eyebrow="Enterprise use cases" title="Automate the work between your tools" titleId="use-cases-title" />
      <div className="use-case-grid">
        {useCases.map((useCase) => (
          <article className="use-case" key={useCase}>
            <ClipboardCheck size={19} aria-hidden="true" />
            <span>{useCase}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="section results" id="before-vs-after" aria-labelledby="before-after-title">
      <SectionIntro eyebrow="Operational impact" title="What changes after automation?" titleId="before-after-title" />
      <div className="comparison">
        <article className="compare-card before">
          <h3>Before</h3>
          {beforeList.map((item) => <p key={item}>{item}</p>)}
        </article>
        <div className="compare-divider" aria-hidden="true"><BrainCircuit size={30} /></div>
        <article className="compare-card after">
          <h3>After</h3>
          {afterList.map((item) => <p key={item}><Check size={17} aria-hidden="true" />{item}</p>)}
        </article>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section cta-section" aria-labelledby="cta-title">
      <div>
        <p className="eyebrow small"><Network size={16} aria-hidden="true" /> 7-day automation map</p>
        <h2 id="cta-title">Find out what your company can automate in the next 7 days.</h2>
        <span>
          We will map your workflows, identify high-ROI automation opportunities, and show where AI employees can save time, cost, and effort.
        </span>
      </div>
      <div className="cta-actions">
        <ButtonLink href="#contact">Book a Free Automation Audit <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
        <p>No generic demo. A practical workflow audit for your business.</p>
      </div>
    </section>
  );
}

export function Contact() {
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({ status: 'loading', message: 'Sending your request...' });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        setFormState({
          status: 'success',
          message: 'Thanks. Your automation audit request has been sent successfully. Our team will contact you shortly.'
        });
        form.reset();
        return;
      }

      throw new Error(result.message || 'Web3Forms submission failed.');
    } catch {
      setFormState({
        status: 'error',
        message: 'Something went wrong. Please try again or email us directly at uditshekhawat01@clickdine.in.'
      });
    }
  }

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <SectionIntro
          eyebrow="Contact"
          titleId="contact-title"
          title="Request your automation audit"
          copy="Tell us where your team is spending time manually. We will identify automation opportunities and design the first AI employee workflow for your business."
        />
        <div className="contact-note">
          <Phone size={18} aria-hidden="true" />
          <span>For corporates ready to reduce manual workload and scale operations intelligently.</span>
        </div>
        <a className="contact-email" href="mailto:uditshekhawat01@clickdine.in">
          uditshekhawat01@clickdine.in
        </a>
      </div>
      <form
        className="contact-form"
        action="https://api.web3forms.com/submit"
        method="POST"
        onSubmit={handleSubmit}
        aria-label="Request automation audit form"
      >
        <input type="hidden" name="access_key" value="a202926a-3021-4d61-a043-d97a70cfb559" />
        <input type="hidden" name="subject" value="New Automation Audit Request from Clickdine.in" />
        <input type="hidden" name="from_name" value="Clickdine.in Website" />
        <label htmlFor="name">Name<input id="name" type="text" name="name" placeholder="Your name" autoComplete="name" required /></label>
        <label htmlFor="company">Company name<input id="company" type="text" name="company" placeholder="Company Pvt. Ltd." autoComplete="organization" required /></label>
        <label htmlFor="email">Work email<input id="email" type="email" name="email" placeholder="name@company.com" autoComplete="email" required /></label>
        <label htmlFor="phone">Phone number<input id="phone" type="tel" name="phone" placeholder="+91 98765 43210" autoComplete="tel" required /></label>
        <label className="full" htmlFor="message">What do you want to automate?<textarea id="message" name="message" placeholder="Reports, follow-ups, CRM updates, customer support, invoices..." required /></label>
        {formState.message ? (
          <div className={`form-status ${formState.status === 'error' ? 'form-error' : 'form-success'}`} role="status" aria-live="polite">
            {formState.status === 'error' ? <AlertCircle size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
            <span>{formState.message}</span>
          </div>
        ) : null}
        <button type="submit" disabled={formState.status === 'loading'}>
          {formState.status === 'loading' ? 'Sending Request...' : 'Request Automation Audit'}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <a className="brand" href="#top" aria-label="Clickdine.in home">
          <BrandLogo />
        </a>
        <p>AI automation systems for modern companies</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#solutions">Solutions</a>
        <a href="#ai-employees">AI Employees</a>
        <a href="#use-cases">Use Cases</a>
        <a href="#contact">Contact</a>
        <a href="mailto:uditshekhawat01@clickdine.in">uditshekhawat01@clickdine.in</a>
      </nav>
      <span>Copyright 2026 Clickdine.in. All rights reserved.</span>
    </footer>
  );
}
