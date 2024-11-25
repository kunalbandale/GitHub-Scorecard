import React, { useState } from 'react';
import { Search, Github, Loader2, Info } from 'lucide-react';
import ProfileCard from './components/ProfileCard';
import RepoStats from './components/RepoStats';
import RecruiterInsights from './components/RecruiterInsights';
import GithubScorecard from './components/GithubScorecard';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchGithubData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setProfile(null);
    setRepos([]);

    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
      ]);

      if (!profileRes.ok || !reposRes.ok) {
        throw new Error('Profile not found');
      }

      const profileData = await profileRes.json();
      const reposData = await reposRes.json();

      setProfile(profileData);
      setRepos(reposData);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Github className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">GitHub Scorecard</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About GitHub Scorecard</h2>
              <div className="prose text-gray-600 space-y-4">
                <p>
                  GitHub Scorecard is a powerful tool designed to help developers showcase their GitHub profile professionally. 
                  Generate beautiful, data-rich scorecards perfect for resumes, portfolios, and job applications.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">Who can use this?</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium text-gray-800">Developers</span> - Showcase your GitHub achievements and technical expertise in a professional format</li>
                  <li><span className="font-medium text-gray-800">Job Seekers</span> - Add a comprehensive GitHub analysis to your resume</li>
                  <li><span className="font-medium text-gray-800">Tech Recruiters</span> - Get detailed insights into candidates' coding experience and expertise</li>
                  <li><span className="font-medium text-gray-800">Team Leaders</span> - Evaluate potential team members' technical background</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Downloadable professional scorecard with graphs and metrics</li>
                  <li>Detailed analysis of coding languages and expertise</li>
                  <li>Key metrics for technical recruitment</li>
                  <li>Project showcase and impact analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={fetchGithubData} className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Scorecard'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="max-w-5xl mx-auto space-y-8">
            <GithubScorecard profile={profile} repos={repos} />
            <ProfileCard profile={profile} />
            <RecruiterInsights profile={profile} repos={repos} />
            <RepoStats repos={repos} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;