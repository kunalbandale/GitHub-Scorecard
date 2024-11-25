import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, Users, GitFork } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    location: string;
    blog: string;
    created_at: string;
    followers: number;
    following: number;
    public_repos: number;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-start gap-6">
        <img
          src={profile.avatar_url}
          alt={profile.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-100"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <a
            href={`https://github.com/${profile.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            @{profile.login}
          </a>
          <p className="mt-2 text-gray-600">{profile.bio}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>{profile.location}</span>
          </div>
        )}
        {profile.blog && (
          <div className="flex items-center gap-2">
            <LinkIcon size={18} className="text-gray-600" />
            <a
              href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 truncate"
            >
              {profile.blog}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          <span>Joined {joinDate}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Users size={18} className="text-gray-600" />
            <span className="text-xl font-bold text-gray-900">{profile.followers}</span>
          </div>
          <p className="text-sm text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Users size={18} className="text-gray-600" />
            <span className="text-xl font-bold text-gray-900">{profile.following}</span>
          </div>
          <p className="text-sm text-gray-600">Following</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <GitFork size={18} className="text-gray-600" />
            <span className="text-xl font-bold text-gray-900">{profile.public_repos}</span>
          </div>
          <p className="text-sm text-gray-600">Repositories</p>
        </div>
      </div>
    </div>
  );
}