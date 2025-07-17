import { MessageCircle, Send, User, Clock, ThumbsUp, Reply, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { formatDate } from '@/utils/format';

type ProjectThreadProps = {
  projectId: string;
};

// Enhanced mock data with more GitHub-like comments
const generateMockComments = (projectId: string) => [
  {
    id: '1',
    content: `Hey team! 👋 I'm really excited about this project. I have 3+ years of experience with React and Node.js and would love to contribute to the frontend development.

**My expertise includes:**
- React/TypeScript
- Responsive design
- API integration
- State management (Redux/Zustand)

When can we schedule a kickoff meeting?`,
    author: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: null,
      role: 'Frontend Developer'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    replies: [],
  },
  {
    id: '2',
    content: `@Sarah Johnson Great to have you on board! 🎉 

I can handle the backend development. I'm thinking we could use:
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT tokens
- **API**: RESTful with proper validation

What do you think about the tech stack? Any suggestions?`,
    author: {
      firstName: 'Mike',
      lastName: 'Chen',
      avatar: null,
      role: 'Backend Developer'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 3,
    replies: [],
  },
  {
    id: '3',
    content: `Perfect timing! I was just thinking about the project structure. 

**Proposed Timeline:**
- Week 1-2: Setup & Architecture
- Week 3-4: Core Features Development  
- Week 5-6: Testing & Deployment

I'll create a GitHub repo and set up the initial project structure. Who wants access?`,
    author: {
      firstName: 'Alex',
      lastName: 'Rivera',
      avatar: null,
      role: 'Project Lead'
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    replies: [],
  },
  {
    id: '4',
    content: `@Alex Rivera I'd love GitHub access! My username is \`sarah-codes\`

Also, should we set up a Discord server for quick communication? Sometimes it's faster than comments for quick questions.

**Questions:**
1. Do we have any design mockups?
2. What's the target launch date?
3. Any specific accessibility requirements?`,
    author: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: null,
      role: 'Frontend Developer'
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 2,
    replies: [],
  },
  {
    id: '5',
    content: `I can help with UI/UX design! 🎨 I have experience with Figma and creating developer-friendly design systems.

Let me know if you need:
- Wireframes
- High-fidelity mockups  
- Component library design
- User flow diagrams

Happy to contribute to this great cause! 💪`,
    author: {
      firstName: 'Jessica',
      lastName: 'Wong',
      avatar: null,
      role: 'UI/UX Designer'
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 6,
    replies: [],
  },
];

export const ProjectThread = ({ projectId }: ProjectThreadProps) => {
  const { addNotification } = useNotifications();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [comments, setComments] = useState(() => generateMockComments(projectId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (values: { content: string }) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      content: values.content,
      author: {
        firstName: 'You',
        lastName: '',
        avatar: null,
        role: 'Volunteer'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setComments(prev => [...prev, newComment]);
    setIsSubmitting(false);
    setIsCommentFormOpen(false);
    
    addNotification({
      type: 'success',
      title: 'Comment posted successfully',
    });
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <MessageCircle className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Project Discussion
              </h3>
              <p className="text-sm text-slate-600">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'} • 
                <span className="ml-1 text-green-600">Active collaboration</span>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCommentFormOpen(!isCommentFormOpen)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <MessageCircle className="mr-2 size-4" />
            {isCommentFormOpen ? 'Cancel' : 'Join Discussion'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-slate-200/60">
        {comments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
              <MessageCircle className="size-8 text-slate-400" />
            </div>
            <h4 className="mb-2 text-lg font-medium text-slate-900">
              Start the conversation
            </h4>
            <p className="text-slate-600">
              Share your ideas, ask questions, or introduce yourself to the team
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id} className="p-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
                  <User className="size-6 text-slate-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Comment Header */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {comment.author.role}
                    </span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-500">
                      {formatDate(new Date(comment.createdAt).getTime())}
                    </span>
                    {index === 0 && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        OP
                      </span>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="prose prose-sm max-w-none text-slate-700 mb-4">
                    <div 
                      className="whitespace-pre-wrap leading-relaxed"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {comment.content}
                    </div>
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 text-sm">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="size-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors">
                      <Reply className="size-4" />
                      Reply
                    </button>
                    <div className="relative">
                      <button className="text-slate-500 hover:text-slate-700 transition-colors">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {isCommentFormOpen && (
        <div className="border-t border-slate-200/60 bg-gradient-to-br from-slate-50/30 to-white p-6">
          <Form
            onSubmit={handleAddComment}
            schema={z.object({
              content: z.string().min(1, 'Comment content is required').max(2000, 'Comment is too long'),
            })}
          >
            {({ register, formState, reset }) => (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0">
                    <User className="size-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your ideas, ask questions, or contribute to the discussion...

You can use **markdown** formatting:
- **bold text**
- *italic text*  
- `code snippets`
- Lists and more!"
                      registration={register('content')}
                      error={formState.errors['content']}
                      rows={6}
                      className="resize-none border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="mt-2 text-xs text-slate-500">
                      💡 <strong>Tip:</strong> Introduce yourself, share your skills, ask questions, or propose ideas
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>✨ Be respectful and constructive</span>
                    <span>• 📝 Markdown supported</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCommentFormOpen(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isSubmitting}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Send className="mr-2 size-4" />
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}

      {/* Thread Stats Footer */}
      <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>Last activity: {formatDate(new Date(comments[comments.length - 1]?.createdAt || Date.now()).getTime())}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="size-4" />
              <span>{comments.reduce((sum, c) => sum + c.likes, 0)} total reactions</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="size-4" />
              <span>{new Set(comments.map(c => `${c.author.firstName} ${c.author.lastName}`)).size} participants</span>
            </div>
            <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              💬 Live Discussion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};