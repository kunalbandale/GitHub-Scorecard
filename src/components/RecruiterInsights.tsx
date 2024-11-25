import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Star, GitFork, Code, Activity } from 'lucide-react';

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
}

interface RecruiterInsightsProps {
  profile: {
    public_repos: number;
    created_at: string;
  };
  repos: Repository[];
}

export default function RecruiterInsights({ profile, repos }: RecruiterInsightsProps) {
  // Calculate experience level based on account age and activity
  const accountAge = formatDistanceToNow(new Date(profile.created_at));
  const activeRepos = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  ).length;

  // Calculate technical expertise
  const languages = repos.reduce((acc: Record<string, number>, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang);

  // Find showcase projects
  const showcaseProjects = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(repo => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
    }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Key Highlights for Recruiters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Experience Overview</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• GitHub account age: {accountAge}</li>
              <li>• Total public repositories: {profile.public_repos}</li>
              <li>• Active repositories (last 6 months): {activeRepos}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Technical Expertise</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Primary languages: {topLanguages.join(', ')}</li>
              <li>• Project diversity: {Object.keys(languages).length} different languages used</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" />
          Showcase Projects
        </h2>
        
        <div className="space-y-4">
          {showcaseProjects.map(project => (
            <div key={project.name} className="border-b last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-indigo-600">{project.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{project.description || 'No description available'}</p>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={16} />
                    <span>{project.forks}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {project.language && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Code size={12} className="mr-1" />
                    {project.language}
                  </span>
                )}
                {project.topics?.map(topic => (
                  <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="text-green-500" />
          Activity Analysis
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Contribution Patterns</h3>
            <p className="text-gray-600">
              • Actively maintained repositories: {activeRepos} out of {profile.public_repos} ({Math.round((activeRepos / profile.public_repos) * 100)}%)
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Project Diversity</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(languages)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([lang, count]) => (
                  <span key={lang} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {lang}: {count} projects
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}