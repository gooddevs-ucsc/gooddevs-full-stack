import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/features/requester/components/project-card';

interface RequesterProject {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'Pending'; // Exact literal types
  progress: number;
  createdAt: string;
  teamSize: number;
  estimatedCompletion: string;
}

// Mock data - replace with real API data later
const mockProjects: RequesterProject[] = [
  {
    id: '1',
    title: 'Environmental Tracker',
    description:
      'Mobile app for tracking personal carbon footprint and environmental impact with real-time analytics',
    status: 'Active',
    progress: 75,
    createdAt: '2024-01-15',
    teamSize: 3,
    estimatedCompletion: '2024-03-15',
  },
  {
    id: '2',
    title: 'Community Food Bank App',
    description:
      'Web platform connecting food donors with local food banks and community organizations',
    status: 'Pending',
    progress: 0,
    createdAt: '2024-01-20',
    teamSize: 0,
    estimatedCompletion: '2024-04-20',
  },
  {
    id: '3',
    title: 'Local Library System',
    description:
      'Digital catalog and book reservation system for community library with user management',
    status: 'Active',
    progress: 45,
    createdAt: '2024-01-10',
    teamSize: 2,
    estimatedCompletion: '2024-02-28',
  },
  {
    id: '4',
    title: 'Youth Education Platform',
    description:
      'Interactive learning platform for underprivileged youth with gamification features',
    status: 'Completed',
    progress: 100,
    createdAt: '2023-12-01',
    teamSize: 4,
    estimatedCompletion: '2024-01-15',
  },
  {
    id: '5',
    title: 'Senior Care Connect',
    description:
      'Healthcare management system for elderly care coordination and family communication',
    status: 'Completed',
    progress: 100,
    createdAt: '2023-11-15',
    teamSize: 3,
    estimatedCompletion: '2024-01-01',
  },
  {
    id: '6',
    title: 'Animal Shelter Management',
    description:
      'Comprehensive system for managing animal adoptions, volunteers, and shelter operations',
    status: 'Pending',
    progress: 0,
    createdAt: '2024-01-25',
    teamSize: 0,
    estimatedCompletion: '2024-05-01',
  },
];

type ProjectStatus = 'All' | 'Active' | 'Completed' | 'Pending';

const RequesterProjectsRoute = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('All');

  const statusTabs: ProjectStatus[] = ['All', 'Active', 'Completed', 'Pending'];

  // Filter projects based on search term and status
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get count for each status
  const getStatusCount = (status: ProjectStatus) => {
    if (status === 'All') return mockProjects.length;
    return mockProjects.filter((project) => project.status === status).length;
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'All':
        return 'border-primary/20 bg-primary/5 text-primary';
      case 'Active':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'Completed':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'Pending':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <ContentLayout title="My Projects">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-600">
              Manage and track your submitted projects
            </p>
          </div>
          <Button
            className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl"
            size="lg"
          >
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusTabs.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all hover:shadow-sm ${
                  selectedStatus === status
                    ? getStatusColor(status)
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{status}</span>
                <span className="bg-current/20 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCount(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <p className="text-sm text-slate-600">
            Showing {filteredProjects.length} of {mockProjects.length} projects
            {selectedStatus !== 'All' && ` • ${selectedStatus} projects`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </p>
          {(searchTerm || selectedStatus !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 py-12">
            <div className="rounded-full bg-slate-100 p-3">
              <Filter className="size-6 text-slate-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No projects found
            </h3>
            <p className="mt-2 max-w-sm text-center text-slate-600">
              {searchTerm || selectedStatus !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : "You haven't submitted any projects yet. Create your first project to get started."}
            </p>
            {!searchTerm && selectedStatus === 'All' && (
              <Button className="mt-4" size="lg">
                <Plus className="mr-2 size-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default RequesterProjectsRoute;
