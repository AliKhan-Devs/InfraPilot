import React from 'react';
import { Play, WandSparkles } from 'lucide-react';

const PromptPanel = ({ prompt, setPrompt, runAgent, loading }) => {
  return (
    <div className="panel rounded-[24px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Prompt</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
            Describe the infrastructure
          </h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 p-3 text-neutral-300">
          <WandSparkles size={18} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-7 text-neutral-400">
        Specify workloads, security requirements, networking constraints, cloud services, and scale targets.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: Design a production AWS platform with private networking, ALB, ECS services, RDS, monitoring, and least-privilege IAM."
        className="mt-5 h-56 w-full resize-none rounded-[20px] border border-white/10 bg-black/50 px-4 py-4 text-sm leading-7 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-white/20 focus:bg-black/70"
      />

      <button
        onClick={runAgent}
        disabled={loading || !prompt.trim()}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-neutral-500"
      >
        <Play size={16} />
        {loading ? 'Generating architecture...' : 'Generate architecture'}
      </button>
    </div>
  );
};

export default PromptPanel;
