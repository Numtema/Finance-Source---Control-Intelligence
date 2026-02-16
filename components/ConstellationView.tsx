
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CompanyData } from '../types';

interface Node {
  id: string;
  type: 'company' | 'investor';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
  subLabel?: string;
  mass: number;
  connections: number; // To calculate gravity
}

interface Link {
  source: string; // Node ID
  target: string; // Node ID
  value: number; // Percentage
  strength: number;
}

interface Props {
  companies: CompanyData[];
}

export const ConstellationView: React.FC<Props> = ({ companies }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. DATA PREPARATION
  const { nodes, links } = useMemo(() => {
    const nodesMap = new Map<string, Node>();
    const linksList: Link[] = [];

    companies.forEach(company => {
      // Add Company Node
      if (!nodesMap.has(company.company.ticker)) {
        nodesMap.set(company.company.ticker, {
          id: company.company.ticker,
          type: 'company',
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: 0,
          vy: 0,
          radius: 25, // Companies are big planets
          color: '#ffffff',
          label: company.company.ticker,
          subLabel: company.company.name,
          mass: 5,
          connections: 0
        });
      }

      // Add Investor Nodes & Links
      company.ownership.top_holders.forEach(holder => {
        // Create Investor Node if not exists
        if (!nodesMap.has(holder.name)) {
          let color = '#94a3b8'; // Default slate
          if (holder.family === 'Passive Giants') color = '#6366f1'; // Indigo
          if (holder.family === 'Sovereign') color = '#10b981'; // Emerald
          if (holder.family === 'Active Funds') color = '#3b82f6'; // Blue
          if (holder.family === 'Insiders' || holder.family === 'Family Control') color = '#f43f5e'; // Rose
          if (holder.family === 'Internal Fund') color = '#a855f7'; // Purple

          nodesMap.set(holder.name, {
            id: holder.name,
            type: 'investor',
            x: Math.random() * 800,
            y: Math.random() * 600,
            vx: 0,
            vy: 0,
            radius: 5, // Will grow with connections
            color: color,
            label: holder.name,
            subLabel: holder.family,
            mass: 1,
            connections: 0
          });
        }

        // Update Investor stats
        const invNode = nodesMap.get(holder.name)!;
        invNode.connections += 1;
        invNode.radius = Math.min(40, 6 + (invNode.connections * 3)); // Grow star size based on influence
        invNode.mass = 1 + (invNode.connections * 0.5);

        // Update Company stats
        const compNode = nodesMap.get(company.company.ticker)!;
        compNode.connections += 1;

        // Create Link
        linksList.push({
          source: holder.name,
          target: company.company.ticker,
          value: holder.percent,
          strength: holder.percent / 100
        });
      });
    });

    return { nodes: Array.from(nodesMap.values()), links: linksList };
  }, [companies]);

  // 2. PHYSICS ENGINE & RENDERING LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Resize handler
    const handleResize = () => {
      if(containerRef.current) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width * 2; // Retina sharpness
        canvas.height = height * 2;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(2, 2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial scatter to avoid explosion
    nodes.forEach(n => {
        n.x = width / 2 + (Math.random() - 0.5) * 200;
        n.y = height / 2 + (Math.random() - 0.5) * 200;
    });

    // Loop
    const tick = () => {
      // --- A. PHYSICS ---
      const k = 100; // Optimal distance
      const centerForce = 0.03;
      const repulsion = 800;

      // 1. Repulsion (Coulomb's Law-ish)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist); // Inverse square law might be too strong, using simplified
          
          const fx = (dx / dist) * force * 5;
          const fy = (dy / dist) * force * 5;

          a.vx += fx / a.mass;
          a.vy += fy / a.mass;
          b.vx -= fx / b.mass;
          b.vy -= fy / b.mass;
        }
      }

      // 2. Attraction (Springs)
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Shorter lines for higher percentage
        const targetDist = k / (1 + link.strength * 2); 
        const displacement = dist - targetDist;
        
        const force = displacement * 0.05; // Spring constant
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx / source.mass;
        source.vy += fy / source.mass;
        target.vx -= fx / target.mass;
        target.vy -= fy / target.mass;
      });

      // 3. Center Gravity & Velocity Update
      nodes.forEach(node => {
        // Pull to center
        node.vx += (width / 2 - node.x) * centerForce * 0.5;
        node.vy += (height / 2 - node.y) * centerForce * 0.5;

        // Apply Velocity with Damping
        node.vx *= 0.92; // Friction
        node.vy *= 0.92;
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraint (Soft bounce)
        const margin = 50;
        if(node.x < margin) node.vx += 1;
        if(node.x > width - margin) node.vx -= 1;
        if(node.y < margin) node.vy += 1;
        if(node.y > height - margin) node.vy -= 1;
      });

      // --- B. RENDERING ---
      ctx.clearRect(0, 0, width, height);
      
      // Global Hover Dimming
      const isHovering = hoveredNode !== null;

      // Draw Links
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (!source || !target) return;

        const isConnected = source.id === hoveredNode || target.id === hoveredNode;
        const isDimmed = isHovering && !isConnected;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.lineWidth = Math.max(0.5, link.value / 2); // Thickness by ownership %
        
        // Dynamic Gradient for line
        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, isDimmed ? '#1e293b' : source.color);
        gradient.addColorStop(1, isDimmed ? '#1e293b' : target.color);
        
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = isDimmed ? 0.1 : (0.2 + (link.value / 20)); // Opacity by ownership
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isTarget = node.id === hoveredNode;
        const isRelated = links.some(l => 
          (l.source === hoveredNode && l.target === node.id) || 
          (l.target === hoveredNode && l.source === node.id)
        );
        const isDimmed = isHovering && !isTarget && !isRelated;

        // Glow Effect
        if (!isDimmed) {
            ctx.shadowBlur = node.type === 'company' ? 30 : 15;
            ctx.shadowColor = node.color;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? '#1e293b' : node.color;
        
        // Planet Effect for Companies
        if (node.type === 'company' && !isDimmed) {
            ctx.fillStyle = '#0f172a'; // Dark core
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.fill();
        }

        ctx.shadowBlur = 0; // Reset for text

        // Text Labels
        if (!isDimmed || node.type === 'company') {
            // Ticker / ID
            ctx.fillStyle = isDimmed ? '#334155' : '#ffffff';
            ctx.font = node.type === 'company' ? 'bold 12px Poppins' : '10px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);

            // Sub-label (visible on hover or if company)
            if (node.type === 'company' || isTarget || (node.radius > 15 && !isDimmed)) {
                ctx.fillStyle = isDimmed ? '#334155' : '#94a3b8';
                ctx.font = '9px Poppins';
                ctx.fillText(node.subLabel || '', node.x, node.y + node.radius + 12);
            }
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, links, hoveredNode]);

  // Mouse Interaction Layer
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Find node under mouse
    let found = null;
    // Search in reverse draw order (top on top)
    for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dist = Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2);
        if (dist < n.radius + 5) {
            found = n.id;
            break;
        }
    }
    setHoveredNode(found);
  };

  return (
    <div 
        ref={containerRef} 
        className="w-full h-[700px] bg-[#0b0d12] rounded-[2rem] border border-white/10 relative overflow-hidden cursor-crosshair shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
    >
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
                 backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
             }}>
        </div>
        
        {/* HUD Info */}
        <div className="absolute top-6 left-6 pointer-events-none">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Système Gravitationnel
            </h3>
            <p className="text-slate-500 text-xs mt-1">
                {nodes.length} Entités • {links.length} Liens de contrôle
            </p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none bg-[#0b0d12]/80 p-4 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span> Passive Giants
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Active Funds
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Sovereign
            </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span> Insiders
            </div>
        </div>

        <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
