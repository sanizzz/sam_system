/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSSEUrl, Lead } from '@/lib/api';

interface AgentMessage {
    id: string;
    content: string;
    timestamp: Date;
    type: 'status' | 'final' | 'error';
}

export default function LeadsPage() {
    const params = useParams();
    const taskId = params.uuid as string;
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const extractTextContent = (data: any): string | null => {
        try {
            const content = data.result?.status?.message?.content;
            if (!content || !Array.isArray(content)) return null;

            const textParts = content
                .filter((part: any) => part.text)
                .map((part: any) => part.text);

            return textParts.join('\n\n');
        } catch (err) {
            console.error('Error extracting text content:', err);
            return null;
        }
    };
    useEffect(() => {
        if (!taskId) return;

        const sseUrl = getSSEUrl(taskId);
        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('SSE connection opened');
        };

        eventSource.addEventListener('status_update', (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                const content = extractTextContent(data);
                if (content) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            content,
                            timestamp: new Date(),
                            type: 'status',
                        },
                    ]);
                }
            } catch (err) {
                console.error('Error parsing status update:', err);
            }
        });

        eventSource.addEventListener('final_response', (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                const content = extractTextContent(data);

                if (content) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            content,
                            timestamp: new Date(),
                            type: 'final',
                        },
                    ]);
                }

                // Try to extract leads from artifacts
                const artifacts = data.result?.status?.message?.content?.filter(
                    (part: any) => part.file
                );

                if (artifacts && artifacts.length > 0) {
                    // For demo, parse the first JSON artifact
                    const jsonArtifact = artifacts.find((a: any) =>
                        a.file?.mime_type === 'application/json'
                    );

                    if (jsonArtifact) {
                        // In a real implementation, you'd fetch the artifact content
                        // For now, we'll display a success message
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: crypto.randomUUID(),
                                content: `✅ Lead generation complete! Generated ${jsonArtifact.file?.filename || 'leads artifact'}.`,
                                timestamp: new Date(),
                                type: 'final',
                            },
                        ]);
                    }
                }

                setIsComplete(true);
            } catch (err) {
                console.error('Error parsing final response:', err);
            }
        });

        eventSource.addEventListener('error', (event: MessageEvent) => {
            try {
                if (!event?.data) return;
                const data = JSON.parse(event.data);
                const errorMsg = data.error || 'An error occurred';
                setError(errorMsg);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        content: `❌ Error: ${errorMsg}`,
                        timestamp: new Date(),
                        type: 'error',
                    },
                ]);
            } catch (err) {
                console.error('Error parsing error event:', err);
            }
        });

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            if (!isComplete) {
                setError('Connection to server lost');
            }
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [taskId]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lead Generation Progress</h1>
                            <p className="mt-2 text-sm text-gray-600">Task ID: {taskId}</p>
                        </div>
                        <div>
                            {isComplete ? (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    ✓ Complete
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Stream */}
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Activity Log</h2>

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {messages.length === 0 && !error && (
                            <div className="text-center text-gray-500 py-8">
                                <div className="animate-pulse">Connecting to agents...</div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 rounded-lg ${message.type === 'error'
                                    ? 'bg-red-50 border-l-4 border-red-400'
                                    : message.type === 'final'
                                        ? 'bg-green-50 border-l-4 border-green-400'
                                        : 'bg-blue-50 border-l-4 border-blue-400'
                                    }`}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {message.type === 'error' ? (
                                            <span className="text-2xl">❌</span>
                                        ) : message.type === 'final' ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">🤖</span>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="text-xs text-gray-500 mb-1">
                                            {message.timestamp.toLocaleTimeString()}
                                        </div>
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Leads Display (when available) */}
                {leads.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Leads</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {leads.map((lead) => (
                                <div key={lead.id} className="border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                                    <p className="text-sm text-gray-600">{lead.category}</p>
                                    <p className="text-sm text-gray-600">{lead.location}</p>
                                    <p className="text-sm text-gray-600">{lead.phone}</p>
                                    <p className="text-sm text-blue-600">{lead.website}</p>

                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-900">Issues:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {lead.detected_issues.map((issue, idx) => (
                                                <li key={idx}>{issue}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-900">Draft Pitch:</h4>
                                        <div className="prose prose-sm max-w-none mt-2">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {lead.draft_pitch_markdown}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
