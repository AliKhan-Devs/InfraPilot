import React, { useMemo } from 'react';
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
} from '@xyflow/react';

const summarizeService = (service) => {
  const raw = service.configHint || service.reasoning || 'No summary available yet.';
  return raw.length > 110 ? `${raw.slice(0, 110)}...` : raw;
};

const ServiceNode = ({ data }) => {
  return (
    <div className="infra-node">
      <Handle type="target" position={Position.Top} className="infra-node__handle" />
      <p className="infra-node__eyebrow">{data.category}</p>
      <h3 className="infra-node__title">{data.title}</h3>
      <p className="infra-node__body">{data.summary}</p>
      <Handle type="source" position={Position.Bottom} className="infra-node__handle" />
    </div>
  );
};

const classifyService = (serviceName, index) => {
  const normalized = serviceName.toLowerCase();

  if (index === 0 || normalized.includes('vpc') || normalized.includes('network')) {
    return 'Foundation';
  }
  if (
    normalized.includes('load balancer') ||
    normalized.includes('alb') ||
    normalized.includes('gateway') ||
    normalized.includes('ingress')
  ) {
    return 'Traffic';
  }
  if (
    normalized.includes('ecs') ||
    normalized.includes('eks') ||
    normalized.includes('lambda') ||
    normalized.includes('compute') ||
    normalized.includes('service')
  ) {
    return 'Compute';
  }
  if (
    normalized.includes('rds') ||
    normalized.includes('db') ||
    normalized.includes('redis') ||
    normalized.includes('cache') ||
    normalized.includes('storage')
  ) {
    return 'Data';
  }

  return 'Platform';
};

const buildGraph = (services) => {
  const columnX = [40, 330, 620];
  const baseY = 60;
  const rowGap = 200;

  const nodes = services.map((service, index) => {
    const category = classifyService(service.serviceName || `Service ${index + 1}`, index);
    const column = index === 0 ? 0 : index === 1 ? 1 : 2;
    const row = index === 0 ? 0 : index === 1 ? 0 : index - 2;

    return {
      id: `node-${index}`,
      type: 'serviceNode',
      position: {
        x: columnX[Math.min(column, columnX.length - 1)],
        y: baseY + row * rowGap,
      },
      data: {
        title: service.serviceName || `Service ${index + 1}`,
        category,
        summary: summarizeService(service),
      },
      draggable: false,
    };
  });

  const edges = services.slice(1).map((service, index) => {
    const targetIndex = index + 1;
    const sourceIndex = targetIndex === 1 ? 0 : 1;

    return {
      id: `edge-${targetIndex}`,
      source: `node-${sourceIndex}`,
      target: `node-${targetIndex}`,
      animated: false,
      type: 'smoothstep',
      style: {
        stroke: 'rgba(255,255,255,0.24)',
        strokeWidth: 1.5,
      },
    };
  });

  return { nodes, edges };
};

const nodeTypes = {
  serviceNode: ServiceNode,
};

const ArchitectureDiagram = ({ services = [] }) => {
  const { nodes, edges } = useMemo(() => buildGraph(services), [services]);

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-[20px] border border-white/8 bg-black/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        colorMode="dark"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
      >
        <Background color="rgba(255,255,255,0.06)" gap={28} size={1} />
        <MiniMap
          nodeColor="rgba(255,255,255,0.9)"
          maskColor="rgba(0, 0, 0, 0.78)"
          pannable
          zoomable
        />
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs text-neutral-400 backdrop-blur">
            Architecture map
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ArchitectureDiagram;
