import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Cpu,
  Search,
  ShieldCheck,
} from 'lucide-react';

const stepList = [
  { key: 'architecting', label: 'Plan', icon: <Cpu size={14} /> },
  { key: 'researching', label: 'Research', icon: <Search size={14} /> },
  { key: 'coding', label: 'Code', icon: <Code2 size={14} /> },
  { key: 'reviewing', label: 'Review', icon: <ShieldCheck size={14} /> },
  { key: 'completed', label: 'Ready', icon: <CheckCircle2 size={14} /> },
];

const order = ['architecting', 'researching', 'coding', 'reviewing', 'completed'];

const StatusStepper = ({ status }) => {
  const getState = (stepKey) => {
    if (status === 'error') return 'error';
    if (status === stepKey) return 'active';
    return order.indexOf(stepKey) <= order.indexOf(status) ? 'done' : 'pending';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[560px] items-center gap-2">
        {stepList.map((step, index) => {
          const state = getState(step.key);
          const isDone = state === 'done';
          const isActive = state === 'active';
          const isError = state === 'error';

          const tone = isError
            ? 'border-white/10 bg-white/8 text-neutral-200'
            : isActive
            ? 'border-white/20 bg-white text-black'
            : isDone
            ? 'border-white/12 bg-white/8 text-neutral-100'
            : 'border-white/8 bg-transparent text-neutral-500';

          return (
            <React.Fragment key={step.key}>
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${tone}`}>
                {isDone ? <CheckCircle2 size={14} /> : isError ? <AlertCircle size={14} /> : step.icon}
                <span>{step.label}</span>
              </div>
              {index < stepList.length - 1 && (
                <div
                  className={`h-px w-7 ${isDone || isActive ? 'bg-white/40' : 'bg-white/10'}`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
