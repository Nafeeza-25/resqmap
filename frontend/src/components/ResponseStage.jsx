import { Radio, ScanSearch, ShieldCheck } from 'lucide-react';

const steps = [
  { id: 'report', label: 'Report received', icon: Radio },
  { id: 'verify', label: 'Verify evidence', icon: ScanSearch },
  { id: 'decide', label: 'Human decision', icon: ShieldCheck },
];

export default function ResponseStage({ stage = 'report' }) {
  const activeIndex = Math.max(0, steps.findIndex(step => step.id === stage));

  return (
    <ol className="response-stage" aria-label="Rescue response workflow">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const state = index === activeIndex ? 'active' : index < activeIndex ? 'complete' : 'upcoming';
        return (
          <li className={'response-stage__item response-stage__item--' + state} key={step.id}>
            <span className="response-stage__icon"><Icon aria-hidden="true" size={15} /></span>
            <span>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
