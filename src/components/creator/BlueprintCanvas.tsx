'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Plus, Minus, Maximize2, ZoomIn, ZoomOut,
    ImageIcon, GitBranch, Flag, MousePointer, Hand, HelpCircle
} from 'lucide-react';
import { BlueprintNode, BlueprintNodeData, NodeType } from './BlueprintNode';
import { ConnectionLine, TempConnectionLine } from './ConnectionLine';
import { Minimap } from './Minimap';
import { ShortcutsModal } from './ShortcutsModal';

interface Connection {
    id: string;
    fromId: string;
    toId: string;
    fromOutput?: number;
}

interface BlueprintCanvasProps {
    nodes: BlueprintNodeData[];
    connections: Connection[];
    selectedNodeId: string | null;
    onNodesChange: (nodes: BlueprintNodeData[]) => void;
    onConnectionsChange: (connections: Connection[]) => void;
    onSelectNode: (nodeId: string | null) => void;
}

export function BlueprintCanvas({
    nodes,
    connections,
    selectedNodeId,
    onNodesChange,
    onConnectionsChange,
    onSelectNode,
}: BlueprintCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // To track size
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (canvasRef.current) {
            setViewportSize({
                width: canvasRef.current.clientWidth,
                height: canvasRef.current.clientHeight
            });
        }
        const handleResize = () => {
            if (canvasRef.current) {
                setViewportSize({
                    width: canvasRef.current.clientWidth,
                    height: canvasRef.current.clientHeight
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Dragging state
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        type: 'pan' | 'node';
        startMouse: { x: number; y: number };
        startOffset: { x: number; y: number }; // For pan
        nodeIds?: string[]; // For node dragging
        startNodePositions?: { id: string; x: number; y: number }[]; // For node dragging
    }>({
        isDragging: false,
        type: 'pan',
        startMouse: { x: 0, y: 0 },
        startOffset: { x: 0, y: 0 },
    });

    // Connecting state
    const [connectionState, setConnectionState] = useState<{
        isConnecting: boolean;
        fromId: string | null;
        fromOutput?: number; // Optional output index
        toPos: { x: number; y: number };
    }>({
        isConnecting: false,
        fromId: null,
        toPos: { x: 0, y: 0 },
    });

    // Global Key Listeners (Space for Pan, Delete for remove)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                setIsSpacePressed(true);
            }
            if (e.code === 'Delete' || e.code === 'Backspace') {
                if (selectedNodeId && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                    handleNodeDelete(selectedNodeId);
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [selectedNodeId, nodes, connections]); // Dependencies for delete

    // --- MOUSE HANDLERS ---

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // Middle click or Space+Left click = PAN
        if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
            e.preventDefault(); // Prevent text selection
            setDragState({
                isDragging: true,
                type: 'pan',
                startMouse: { x: e.clientX, y: e.clientY },
                startOffset: { ...offset },
            });
            return;
        }

        // Canvas click (deselect)
        if (e.target === canvasRef.current) {
            onSelectNode(null);
        }
    }, [offset, isSpacePressed, onSelectNode]);

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();

        if (isSpacePressed) return; // Don't drag node if space is pressed (pan mode)

        // Select node if not already selected
        if (selectedNodeId !== nodeId) {
            onSelectNode(nodeId);
        }

        setDragState({
            isDragging: true,
            type: 'node',
            startMouse: { x: e.clientX, y: e.clientY },
            startOffset: { x: 0, y: 0 }, // Not used for nodes
            nodeIds: [nodeId],
            startNodePositions: nodes.filter(n => n.id === nodeId).map(n => ({ id: n.id, x: n.x, y: n.y })),
        });
    }, [isSpacePressed, selectedNodeId, nodes, onSelectNode]);

    const handleConnectionStart = useCallback((e: React.MouseEvent, nodeId: string, outputIndex?: number) => {
        e.stopPropagation();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        setConnectionState({
            isConnecting: true,
            fromId: nodeId,
            fromOutput: outputIndex,
            toPos: {
                x: (e.clientX - rect.left - offset.x) / scale,
                y: (e.clientY - rect.top - offset.y) / scale
            },
        });
    }, [offset, scale]);

    const handleConnectionComplete = useCallback((nodeId: string) => {
        if (connectionState.isConnecting && connectionState.fromId && connectionState.fromId !== nodeId) {
            // Check if connection already exists
            const exists = connections.some(c =>
                c.fromId === connectionState.fromId &&
                c.toId === nodeId &&
                c.fromOutput === connectionState.fromOutput
            );

            if (!exists) {
                const newConnection: Connection = {
                    id: `conn_${Date.now()}`,
                    fromId: connectionState.fromId,
                    toId: nodeId,
                    fromOutput: connectionState.fromOutput,
                };
                onConnectionsChange([...connections, newConnection]);
            }
        }
        setConnectionState({ isConnecting: false, fromId: null, toPos: { x: 0, y: 0 } });
    }, [connectionState, connections, onConnectionsChange]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (dragState.isDragging) {
            const dx = e.clientX - dragState.startMouse.x;
            const dy = e.clientY - dragState.startMouse.y;

            if (dragState.type === 'pan') {
                setOffset({
                    x: dragState.startOffset.x + dx,
                    y: dragState.startOffset.y + dy,
                });
            } else if (dragState.type === 'node' && dragState.startNodePositions) {
                const scaledDx = dx / scale;
                const scaledDy = dy / scale;

                const updatedNodes = nodes.map(n => {
                    const startPos = dragState.startNodePositions?.find(p => p.id === n.id);
                    if (startPos) {
                        // SNAP TO GRID (20px)
                        const rawX = startPos.x + scaledDx;
                        const rawY = startPos.y + scaledDy;
                        return {
                            ...n,
                            x: Math.round(rawX / 20) * 20,
                            y: Math.round(rawY / 20) * 20
                        };
                    }
                    return n;
                });
                onNodesChange(updatedNodes);
            }
        }

        if (connectionState.isConnecting) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setConnectionState(prev => ({
                    ...prev,
                    toPos: {
                        x: (e.clientX - rect.left - offset.x) / scale,
                        y: (e.clientY - rect.top - offset.y) / scale,
                    }
                }));
            }
        }
    }, [dragState, scale, nodes, onNodesChange, connectionState, offset]);

    const handleMouseUp = useCallback(() => {
        setDragState(prev => ({ ...prev, isDragging: false }));
        if (connectionState.isConnecting) {
            setConnectionState({ isConnecting: false, fromId: null, toPos: { x: 0, y: 0 } });
        }
    }, [connectionState]);

    // --- HELPERS ---

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(prev => Math.min(Math.max(prev + delta, 0.25), 2));
        }
    }, []);

    const handleNodeDelete = (nodeId: string) => {
        onNodesChange(nodes.filter(n => n.id !== nodeId));
        onConnectionsChange(connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId));
        if (selectedNodeId === nodeId) {
            onSelectNode(null);
        }
    };

    const addNode = (type: NodeType) => {
        // Add to center of view
        const centerX = (canvasRef.current ? canvasRef.current.clientWidth / 2 - offset.x : 400 - offset.x) / scale;
        const centerY = (canvasRef.current ? canvasRef.current.clientHeight / 2 - offset.y : 300 - offset.y) / scale;

        const newNode: BlueprintNodeData = {
            id: `node_${Date.now()}`,
            type,
            title: type === 'scene' ? `Sahne ${nodes.filter(n => n.type === 'scene').length + 1}`
                : type === 'choice' ? `Seçim ${nodes.filter(n => n.type === 'choice').length + 1}`
                    : type === 'end' ? 'Son' : 'Başlangıç',
            x: Math.round(centerX / 20) * 20, // Snap to grid
            y: Math.round(centerY / 20) * 20,
            data: type === 'scene' ? { backgroundImage: '', voiceover: '', dialogText: '', speaker: '' }
                : type === 'choice' ? { choices: [{ id: '1', text: '', targetId: '' }, { id: '2', text: '', targetId: '' }] }
                    : undefined,
        };
        onNodesChange([...nodes, newNode]);
        onSelectNode(newNode.id);
    };

    const getNodeCenter = (nodeId: string, position: 'left' | 'right', outputIndex?: number) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };

        // Node dimensions match the component
        const nodeWidth = 192;
        // Roughly estimate height or use fixed points
        const nodeHeight = node.type === 'choice'
            ? 80 + (node.data?.choices?.length || 0) * 28 + 40 // Dynamic height approximation
            : 100;

        if (position === 'left') {
            // Offset by 6px to go inside the port visuals
            return { x: node.x + 6, y: node.y + nodeHeight / 2 };
        } else {
            // Right side (Outputs)
            const xPos = node.x + nodeWidth - 6; // Offset inwards

            if (node.type === 'choice' && typeof outputIndex === 'number' && node.data?.choices) {
                const topPercent = 30 + outputIndex * 20;
                return { x: xPos, y: node.y + (nodeHeight * topPercent / 100) };
            }
            return { x: xPos, y: node.y + nodeHeight / 2 };
        }
    };

    const resetView = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    };

    const cursorStyle = isSpacePressed || dragState.type === 'pan' && dragState.isDragging
        ? 'grab' // or grabbing
        : connectionState.isConnecting
            ? 'crosshair'
            : 'default';

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#050505]">
            {/* Premium Grid background */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
                    backgroundSize: `${20 * scale}px ${20 * scale}px`,
                    backgroundPosition: `${offset.x}px ${offset.y}px`,
                }}
            />

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="absolute inset-0"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: cursorStyle }}
            >
                <div ref={containerRef} className="absolute inset-0 pointer-events-none" />

                {/* Container for scaled content */}
                <div
                    className="absolute origin-top-left"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none' // Let events pass to specific children
                    }}
                >
                    {/* Connections */}
                    <div className="absolute inset-0 pointer-events-none">
                        {connections.map(conn => {
                            const from = getNodeCenter(conn.fromId, 'right', conn.fromOutput);
                            const to = getNodeCenter(conn.toId, 'left');
                            return (
                                <ConnectionLine
                                    key={conn.id}
                                    fromX={from.x}
                                    fromY={from.y}
                                    toX={to.x}
                                    toY={to.y}
                                    scale={1} // Scale is handled by parent div transform
                                />
                            );
                        })}

                        {/* Temp Connection */}
                        {connectionState.isConnecting && connectionState.fromId && (
                            <TempConnectionLine
                                fromX={getNodeCenter(connectionState.fromId, 'right', connectionState.fromOutput).x}
                                fromY={getNodeCenter(connectionState.fromId, 'right', connectionState.fromOutput).y}
                                toX={connectionState.toPos.x}
                                toY={connectionState.toPos.y}
                            />
                        )}
                    </div>

                    {/* Nodes */}
                    <div className="absolute inset-0 pointer-events-auto">
                        {nodes.map(node => (
                            <BlueprintNode
                                key={node.id}
                                node={node}
                                isSelected={selectedNodeId === node.id}
                                onSelect={() => { }} // Handled by mouseDown
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onDelete={() => handleNodeDelete(node.id)}
                                // Connections
                                onConnectStart={(e, outputIndex) => handleConnectionStart(e, node.id, outputIndex)}
                                onConnectEnd={() => handleConnectionComplete(node.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay UI (Toolbar etc) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
                {/* Tool indicator */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-2 flex flex-col gap-1 shadow-xl">
                    <div className={`p-2 rounded-lg transition-colors ${!isSpacePressed ? 'bg-purple text-white' : 'text-gray-400'}`}>
                        <MousePointer className="size-4" />
                    </div>
                    <div className={`p-2 rounded-lg transition-colors ${isSpacePressed ? 'bg-purple text-white' : 'text-gray-400'}`}>
                        <Hand className="size-4" />
                    </div>
                    <span className="text-[10px] text-gray-500 text-center mt-1">Space</span>
                </div>

                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-2 flex flex-col gap-1 shadow-xl">
                    <button onClick={() => addNode('scene')} className="p-2 rounded-lg hover:bg-purple/20 text-purple-400" title="Sahne">
                        <ImageIcon className="size-4" />
                    </button>
                    <button onClick={() => addNode('choice')} className="p-2 rounded-lg hover:bg-orange-500/20 text-orange-400" title="Seçim">
                        <GitBranch className="size-4" />
                    </button>
                    <button onClick={() => addNode('end')} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400" title="Son">
                        <Flag className="size-4" />
                    </button>
                </div>

                <button
                    onClick={() => setShowShortcuts(true)}
                    className="p-2 bg-[#1a1a1a] border border-white/10 rounded-xl hover:bg-white/10 text-gray-400 shadow-xl"
                    title="Kısayollar"
                >
                    <HelpCircle className="size-5" />
                </button>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 bg-[#1a1a1a] border border-white/10 rounded-xl p-2 flex items-center gap-2 shadow-xl pointer-events-auto">
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.25))} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><ZoomOut className="size-4" /></button>
                <span className="text-xs text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><ZoomIn className="size-4" /></button>
                <div className="w-px h-4 bg-white/10" />
                <button onClick={resetView} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Maximize2 className="size-4" /></button>
            </div>

            {/* Minimap */}
            <div className="absolute bottom-4 right-4 pointer-events-auto">
                <Minimap
                    nodes={nodes}
                    canvasOffset={offset}
                    canvasScale={scale}
                    viewportSize={viewportSize}
                    onNavigate={(x, y) => setOffset({ x: -x * scale, y: -y * scale })}
                />
            </div>

            {/* Shortcuts Modal */}
            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

        </div>
    );
}
