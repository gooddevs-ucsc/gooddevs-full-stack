import { GitBranch, TrendingUp, Code } from 'lucide-react';
import { useState } from 'react';

import { ContentLayout } from '@/components/layouts';

type BaseProject = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

type WorkspaceProject = BaseProject & {
  progress: string;
  team: string[];
  tasks: { id: number; title: string; status: string }[];
};

const ProjectsRoute = () => {
  const [activeTab, setActiveTab] = useState('available');

  const tabs = [
    { id: 'available', label: 'Available Projects' },
    { id: 'applied', label: 'Applied Projects' },
    { id: 'workspace', label: 'Project Workspace' },
  ];

  const availableProjects: BaseProject[] = [
    {
      id: 1,
      title: 'Weather Monitoring System',
      description: 'Track and analyze weather patterns globally.',
      icon: GitBranch,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Build a scalable online shopping experience.',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 3,
      title: 'AI Chatbot',
      description: 'Develop a conversational AI for customer support.',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const appliedProjects: BaseProject[] = [
    {
      id: 1,
      title: 'Social Media Analytics',
      description: 'Analyze trends and user engagement on social platforms.',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 2,
      title: 'Blockchain Wallet',
      description: 'Create a secure wallet for cryptocurrency transactions.',
      icon: GitBranch,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const workspaceProjects: WorkspaceProject[] = [
    {
      id: 1,
      title: 'Project Management Tool',
      description: 'Collaborate and manage tasks efficiently.',
      icon: Code,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      progress: '75%',
      team: ['Alice', 'Bob', 'Charlie'],
      tasks: [
        { id: 1, title: 'Setup environment', status: 'Completed' },
        { id: 2, title: 'Design UI', status: 'In Progress' },
        { id: 3, title: 'Implement API', status: 'Pending' },
      ],
    },
    {
      id: 2,
      title: 'Fitness Tracker App',
      description: 'Track workouts and monitor health metrics.',
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      progress: '50%',
      team: ['David', 'Emma', 'Frank'],
      tasks: [
        { id: 1, title: 'Create wireframes', status: 'Completed' },
        { id: 2, title: 'Develop backend', status: 'In Progress' },
        { id: 3, title: 'Integrate frontend', status: 'Pending' },
      ],
    },
  ];

  const getProjectsForTab = () => {
    switch (activeTab) {
      case 'available':
        return availableProjects;
      case 'applied':
        return appliedProjects;
      case 'workspace':
        return workspaceProjects;
      default:
        return [];
    }
  };

  return (
    <ContentLayout title="Projects">
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getProjectsForTab().map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${project.bgColor}`}>
                  <project.icon className={`size-6 ${project.color}`} />
                </div>
                {activeTab === 'workspace' && 'progress' in project && (
                  <span className="text-sm font-medium text-green-600">
                    {`Progress: ${project.progress}`}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600">{project.description}</p>
              </div>
              {activeTab === 'workspace' && 'team' in project && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Team Members:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600">
                    {(project as WorkspaceProject).team.map(
                      (member: string, index: number) => (
                        <li key={index}>{member}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
              {activeTab === 'workspace' && 'tasks' in project && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Tasks:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600">
                    {(project as WorkspaceProject).tasks.map((task) => (
                      <li key={task.id}>
                        {task.title} -{' '}
                        <span
                          className={`font-semibold ${
                            task.status === 'Completed'
                              ? 'text-green-600'
                              : task.status === 'In Progress'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
                View More
              </button>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
};

export default ProjectsRoute;
