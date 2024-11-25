import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ScorecardProps {
  profile: {
    name: string;
    login: string;
    public_repos: number;
    followers: number;
    created_at: string;
    avatar_url: string;
  };
  repos: Array<{
    language: string;
    stargazers_count: number;
    forks_count: number;
    name: string;
  }>;
}

const COLORS = ['#818cf8', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];

export default function GithubScorecard({ profile, repos }: ScorecardProps) {
  const scorecardRef = useRef<HTMLDivElement>(null);

  const languages = repos.reduce((acc: Record<string, number>, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const languageData = Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(repo => ({
      name: repo.name.length > 15 ? `${repo.name.slice(0, 15)}...` : repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const yearsActive = ((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  const downloadScorecard = async () => {
    if (scorecardRef.current) {
      try {
        const dataUrl = await toPng(scorecardRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
        
        const link = document.createElement('a');
        link.download = `${profile.login}-github-scorecard.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error generating scorecard:', err);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={downloadScorecard}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          Download Scorecard
        </button>
      </div>

      <div ref={scorecardRef} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-24 h-24 rounded-full border-4 border-indigo-100"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GitHub Developer Scorecard</h1>
            <p className="text-xl text-gray-600">
              {profile.name} (@{profile.login})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-gray-900">{yearsActive}</p>
              <p className="text-sm text-gray-600">Years Active</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Impact</h3>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-gray-900">{totalStars}</p>
              <p className="text-sm text-gray-600">Total Stars</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Repositories</h3>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-gray-900">{profile.public_repos}</p>
              <p className="text-sm text-gray-600">Public Projects</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Language Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#374151' }}
                  >
                    {languageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Top Repositories</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRepos} margin={{ bottom: 50 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#374151' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="stars" fill={COLORS[0]} name="Stars" />
                  <Bar dataKey="forks" fill={COLORS[1]} name="Forks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-700 mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-600"></span>
                Total Forks: {totalForks}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                Followers: {profile.followers}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                Languages: {Object.keys(languages).length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                Most Used: {languageData[0]?.name}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                Top Repo: {topRepos[0]?.name}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                Active Since: {new Date(profile.created_at).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}