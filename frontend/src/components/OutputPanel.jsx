import React from 'react';
import { Braces, Layers3 } from 'lucide-react';

const OutputPanel = ({ activeTab, setActiveTab, code, services }) => {
  const highlightTerraform = (rawCode) => {
    if (!rawCode) return 'Awaiting generated Terraform code...';
    const encoded = String(rawCode)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return encoded
      .replace(
        /\b(resource|provider|module|variable|output|local|data|terraform)\b/g,
        '<span class="text-neutral-100 font-medium">$1</span>',
      )
      .replace(/\b(aws|google|azurerm|random)\b/g, '<span class="text-neutral-400">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="text-neutral-500">$1</span>')
      .replace(/("[^"]*")/g, '<span class="text-neutral-300">$1</span>');
  };

  const tabs = [
    { key: 'code', label: 'Terraform', icon: <Braces size={15} /> },
    { key: 'blueprint', label: 'Blueprint', icon: <Layers3 size={15} /> },
  ];

  return (
    <div className="panel rounded-[24px]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-black'
                  : 'bg-transparent text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        {activeTab === 'code' ? (
          <pre className="min-h-[340px] max-h-[640px] overflow-y-auto whitespace-pre-wrap break-words rounded-[20px] border border-white/8 bg-black/55 p-5 text-[13px] leading-7 text-neutral-300">
            <code dangerouslySetInnerHTML={{ __html: highlightTerraform(code) }} />
          </pre>
        ) : services.length === 0 ? (
          <div className="flex min-h-[340px] items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-black/35 px-6 text-center text-sm text-neutral-500">
            Generate a system first to view the service blueprint.
          </div>
        ) : (
          <div className="grid gap-3 rounded-[20px] border border-white/8 bg-black/35 p-3 sm:p-4">
            {services.map((service, index) => (
              <div
                key={service.serviceName + index}
                className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
              >
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white">
                  {service.serviceName}
                </p>
                <p className="mt-2 text-sm leading-7 text-neutral-400">
                  {service.configHint || service.reasoning || 'No service details available yet.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
