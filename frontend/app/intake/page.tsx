'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitLeadRequest, IntakeFormData } from '@/lib/api';

export default function IntakePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<IntakeFormData>({
        freelancer_type: '',
        location: '',
        target_industries: [],
        services: [],
        selling_points: [],
        lead_count: 25,
    });

    const [industriesInput, setIndustriesInput] = useState('');
    const [servicesInput, setServicesInput] = useState('');
    const [sellingPointsInput, setSellingPointsInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Parse comma-separated inputs
            const finalData: IntakeFormData = {
                ...formData,
                target_industries: industriesInput
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
                services: servicesInput
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
                selling_points: sellingPointsInput
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
            };

            // Validate
            if (!finalData.freelancer_type || !finalData.location || finalData.services.length === 0) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const taskId = await submitLeadRequest(finalData);
            router.push(`/leads/${taskId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit request');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Cold Calling Lead Generator</h1>
                        <p className="mt-2 text-gray-600">
                            Enter your information to generate tailored business leads with custom pitches
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Freelancer Type */}
                        <div>
                            <label htmlFor="freelancer_type" className="block text-sm font-medium text-gray-700">
                                Freelancer Type <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="freelancer_type"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="e.g., web developer, graphic designer"
                                value={formData.freelancer_type}
                                onChange={(e) => setFormData({ ...formData, freelancer_type: e.target.value })}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="location"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="e.g., Ottawa, ON"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        {/* Services */}
                        <div>
                            <label htmlFor="services" className="block text-sm font-medium text-gray-700">
                                Services Offered <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="services"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="e.g., SEO, redesign, performance, branding (comma-separated)"
                                value={servicesInput}
                                onChange={(e) => setServicesInput(e.target.value)}
                            />
                        </div>

                        {/* Target Industries (Optional) */}
                        <div>
                            <label htmlFor="target_industries" className="block text-sm font-medium text-gray-700">
                                Target Industries (Optional)
                            </label>
                            <input
                                type="text"
                                id="target_industries"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="e.g., restaurants, retail, dental (comma-separated)"
                                value={industriesInput}
                                onChange={(e) => setIndustriesInput(e.target.value)}
                            />
                        </div>

                        {/* Selling Points (Optional) */}
                        <div>
                            <label htmlFor="selling_points" className="block text-sm font-medium text-gray-700">
                                Selling Points (Optional)
                            </label>
                            <input
                                type="text"
                                id="selling_points"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                placeholder="e.g., fast turnaround, modern UX, better conversions (comma-separated)"
                                value={sellingPointsInput}
                                onChange={(e) => setSellingPointsInput(e.target.value)}
                            />
                        </div>

                        {/* Lead Count */}
                        <div>
                            <label htmlFor="lead_count" className="block text-sm font-medium text-gray-700">
                                Number of Leads
                            </label>
                            <input
                                type="number"
                                id="lead_count"
                                min="1"
                                max="100"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                                value={formData.lead_count}
                                onChange={(e) =>
                                    setFormData({ ...formData, lead_count: parseInt(e.target.value) || 25 })
                                }
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Generating Leads...' : 'Generate Leads'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
