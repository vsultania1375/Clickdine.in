import {
  BarChart3,
  Bot,
  Clock3,
  DatabaseZap,
  FileText,
  Headphones,
  MailCheck,
  ReceiptText,
  Target,
  UserRoundCheck,
  Workflow
} from 'lucide-react';

export const navLinks = [
  ['Solutions', 'solutions'],
  ['AI Employees', 'ai-employees'],
  ['How It Works', 'how-it-works'],
  ['Use Cases', 'use-cases'],
  ['Contact', 'contact']
];

export const metrics = [
  ['20x', 'Productivity potential', 'When high-volume workflows are redesigned around AI execution.'],
  ['60-80%', 'Repetitive work automated', 'Reports, follow-ups, data entry, classification, and routing.'],
  ['24/7', 'AI employees', 'Always-on agents operating across systems, inboxes, and dashboards.'],
  ['Lean', 'Scale without extra hiring', 'Increase operational capacity without adding manual headcount.']
];

export const trustSignals = [
  'Workflow audit',
  'AI employee buildout',
  'Enterprise tool integration'
];

export const workflowNodes = [
  ['Lead Captured', 'Inbound form synced', 'Live', MailCheck],
  ['AI Agent', 'Intent scored and routed', 'Automated', Bot],
  ['CRM Updated', 'Fields enriched instantly', 'Automated', DatabaseZap],
  ['Follow-up Sent', 'Personalized reply sent', 'Live', MailCheck],
  ['Report Generated', 'Saved 42 hrs/week', 'Saved 42 hrs/week', BarChart3]
];

export const problems = [
  {
    icon: MailCheck,
    title: 'Manual follow-ups',
    copy: 'Sales, finance, and operations teams lose hours chasing updates across inboxes and chats.'
  },
  {
    icon: FileText,
    title: 'Excel and report chaos',
    copy: 'Leadership waits on manual dashboards, copied data, and recurring daily or weekly reports.'
  },
  {
    icon: DatabaseZap,
    title: 'Repetitive data entry',
    copy: 'Teams move the same information between CRMs, ERPs, sheets, portals, and ticketing tools.'
  },
  {
    icon: Clock3,
    title: 'Slow internal workflows',
    copy: 'Approvals, ticket updates, invoice checks, and coordination get delayed by handoffs.'
  }
];

export const assistants = [
  ['AI Sales Assistant', 'Qualifies leads, updates CRM, sends follow-ups, and alerts account owners.', Target],
  ['AI Operations Assistant', 'Coordinates task updates, approvals, ticket routing, and internal workflows.', Workflow],
  ['AI Finance Assistant', 'Checks invoices, extracts payment details, and sends payment reminders.', ReceiptText],
  ['AI HR Assistant', 'Screens requests, summarizes candidates, and automates employee support flows.', UserRoundCheck],
  ['AI Customer Support Assistant', 'Classifies queries, drafts replies, escalates issues, and tracks SLA.', Headphones],
  ['AI Reporting Assistant', 'Builds daily reports, management dashboards, and executive summaries.', BarChart3]
];

export const steps = [
  ['Audit your workflow', 'Map repetitive tasks, handoffs, data sources, and teams involved.'],
  ['Identify automation opportunities', 'Prioritize automations by hours saved, risk reduced, and speed gained.'],
  ['Build and integrate AI employees', 'Connect agents to Gmail, WhatsApp, CRM, Sheets, ERP, portals, and databases.'],
  ['Monitor, improve, and scale', 'Track performance, refine workflows, and expand automation across departments.']
];

export const useCases = [
  'Auto-generate daily reports',
  'Auto-reply and classify customer queries',
  'Update CRM and follow up with leads',
  'Extract data from emails and PDFs',
  'Create invoices and payment reminders',
  'Assign tickets and track SLA',
  'Generate management dashboards',
  'Summarize meetings and action items'
];

export const beforeList = [
  'Manual follow-ups',
  'Delayed reports',
  'Team overload',
  'Repeated mistakes',
  'Scaling means hiring more people'
];

export const afterList = [
  'AI handles repetitive tasks',
  'Reports generated automatically',
  'Teams focus on decisions',
  'Fewer errors',
  'Scaling without increasing headcount'
];
