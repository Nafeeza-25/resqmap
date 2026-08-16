import { ArrowRight, ClipboardCheck, MapPin, RotateCcw, Send, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: '1. Verify the report',
    detail: 'Link Reporter G to the Gandhi Street flood incident.',
    to: '/review',
    action: 'Open verification',
    icon: ClipboardCheck
  },
  {
    title: '2. Resolve the conflict',
    detail: 'Add Field Unit 3 evidence to confirm people remain trapped.',
    to: '/incidents/INC-21/intelligence',
    action: 'Inspect intelligence',
    icon: ShieldAlert
  },
  {
    title: '3. Approve the response',
    detail: 'Record the human decision and preserve it in the audit trail.',
    to: '/incidents/INC-21/decision',
    action: 'Open decision desk',
    icon: Send
  }
];

export default function DemoGuide({ onRestart, restarting, feedback }) {
  return (
    <section className="demo-briefing" aria-labelledby="demo-briefing-title">
      <div className="demo-briefing__intro">
        <span className="demo-briefing__location"><MapPin aria-hidden="true" size={14} /> Chennai scenario · Velachery</span>
        <h2 id="demo-briefing-title"> demo</h2>
        <p>Show how scattered disaster reports become one verified, human-approved rescue response.</p>
        <button type="button" className="rescue-secondary-action" onClick={onRestart} disabled={restarting}>
          <RotateCcw aria-hidden="true" size={15} /> {restarting ? 'Restarting…' : 'Restart demo'}
        </button>
        <p className="demo-briefing__feedback" aria-live="polite">{feedback}</p>
      </div>
      <ol className="demo-briefing__steps">
        {steps.map(({ title, detail, to, action, icon: Icon }) => (
          <li key={title}>
            <span className="demo-briefing__step-icon" aria-hidden="true"><Icon size={18} /></span>
            <div><strong>{title}</strong><p>{detail}</p><Link to={to}>{action}<ArrowRight aria-hidden="true" size={14} /></Link></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
