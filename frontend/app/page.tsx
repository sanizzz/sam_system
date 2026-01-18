import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cold Calling Lead Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            AI-powered local business lead aggregator with tailored pitches
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How it works:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Enter your freelancer profile and service offerings</li>
                <li>Our AI agents discover local business leads in your area</li>
                <li>Each business is analyzed for website issues and opportunities</li>
                <li>Custom cold call pitches are generated for every lead</li>
                <li>Review your tailored lead list with ready-to-use pitches</li>
              </ol>
            </div>

            <Link
              href="/intake"
              className="inline-flex items-center justify-center w-full py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started →
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Powered by Solace Agent Mesh with multi-agent AI collaboration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
