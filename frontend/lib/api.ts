// API configuration and utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface IntakeFormData {
    freelancer_type: string;
    location: string;
    target_industries: string[];
    services: string[];
    selling_points: string[];
    lead_count: number;
}

export interface Lead {
    id: string;
    name: string;
    category: string;
    location: string;
    phone: string;
    website: string;
    detected_issues: string[];
    opportunities: string[];
    draft_pitch_markdown: string;
}

export interface StatusUpdateEvent {
    event: 'status_update';
    data: {
        result: {
            status: {
                message: {
                    content: Array<{
                        text?: string;
                        [key: string]: any;
                    }>;
                };
            };
        };
    };
}

export interface FinalResponseEvent {
    event: 'final_response';
    data: {
        result: {
            status: {
                state: string;
                message: {
                    content: Array<{
                        text?: string;
                        file?: {
                            filename: string;
                            mime_type: string;
                        };
                        [key: string]: any;
                    }>;
                };
            };
        };
    };
}

// Submit task to orchestrator and return task ID
export async function submitLeadRequest(intakeData: IntakeFormData): Promise<string> {
    const prompt = `Generate ${intakeData.lead_count} local business leads for a ${intakeData.freelancer_type} in ${intakeData.location}.

Services offered: ${intakeData.services.join(', ')}
${intakeData.target_industries.length > 0 ? `Target industries: ${intakeData.target_industries.join(', ')}` : ''}
${intakeData.selling_points.length > 0 ? `Selling points: ${intakeData.selling_points.join(', ')}` : ''}

For each business, provide:
1. Business name, category, location, phone, and website
2. Website audit findings (detected issues and opportunities)
3. A tailored cold call pitch in Markdown format

Return the final lead list as a structured JSON artifact.`;

    const response = await fetch(`${API_BASE_URL}/api/v1/message:stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: crypto.randomUUID(),
            // method: 'tasks/sendSubscribe',
            method: 'message/stream',
            params: {

                message: {
                    parts: [],
                    messageId: crypto.randomUUID(),
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt,
                        },
                    ],
                    metadata: {
                        agent_name: 'OrchestratorAgent',
                    },
                },
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to submit request: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result.id; // Task ID
}

// Get SSE endpoint URL for task
export function getSSEUrl(taskId: string): string {
    return `${API_BASE_URL}/api/v1/sse/subscribe/${taskId}`;
}
