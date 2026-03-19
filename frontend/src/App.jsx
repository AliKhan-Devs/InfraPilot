import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import StatusStepper from './components/StatusStepper';
import PromptPanel from './components/PromptPanel';
import OutputPanel from './components/OutputPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true,
});

const productName = 'InfraPilot';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState('code');

  useEffect(() => {
    socket.on('connect', () => console.log('Socket connected.'));
    socket.on('node_start', (payload) => {
      setStatus(payload?.node || 'idle');
    });

    return () => {
      socket.off('connect');
      socket.off('node_start');
    };
  }, []);

  const runAgent = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setData(null);
    setStatus('architecting');

    try {
      const res = await axios.post('http://localhost:5000/api/v1/architect', { prompt });
      setData(res.data);
      setStatus('completed');
      setActiveTab('code');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const downloadProject = async () => {
    if (!data?.terraformCode || !data?.blueprint?.projectName) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/download-infra',
        { terraformCode: data.terraformCode, projectName: data.blueprint.projectName },
        { responseType: 'blob' },
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${data.blueprint.projectName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <section className="hero-panel rounded-[28px] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-300">
                <Sparkles size={12} />
                AI Infrastructure Design Studio
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                {productName}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
                Turn plain-language infrastructure requirements into a cloud blueprint,
                reviewed Terraform, and a downloadable deployment package in one guided workflow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-300">
                <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
                  Multi-step AI architecture pipeline
                </div>
                <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
                  Terraform generation + review
                </div>
                <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2">
                  Blueprint visualization + export
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Pipeline</p>
                <p className="mt-2 text-lg font-medium text-white">Architect, research, code, review</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Output</p>
                <p className="mt-2 text-lg font-medium text-white">Terraform with deployable ZIP export</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Positioning</p>
                <p className="mt-2 text-lg font-medium text-white">Portfolio-ready DevOps automation product</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <StatusStepper status={status} />

            <button
              onClick={downloadProject}
              disabled={!data?.terraformCode}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/10 disabled:text-neutral-500"
            >
              <Download size={16} />
              Export ZIP
            </button>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <PromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              runAgent={runAgent}
              loading={loading}
            />

            {data?.blueprint?.researchNote && (
              <div className="panel mt-4 rounded-[24px] p-5">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Research Note
                  <ArrowUpRight size={13} />
                </div>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {data.blueprint.researchNote}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <OutputPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              code={data?.terraformCode}
              services={data?.blueprint?.services || []}
            />

            {activeTab === 'blueprint' && (
              <div className="panel mt-4 rounded-[24px] p-4">
                <ArchitectureDiagram services={data?.blueprint?.services || []} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
