import { Quote, Star, ThumbsUp } from 'lucide-react';
import { FC } from 'react';

const testimonials = [
  {
    quote:
      'The team formation feature was incredible. We got matched with a project manager, two developers, and a UX designer who perfectly understood our education mission.',
    author: 'Maria Santos',
    role: 'Executive Director',
    organization: 'Education for All Foundation',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=60&h=60&fit=crop&crop=face',
    rating: 5,
  },
  {
    quote:
      'As a sponsor, I love being able to track exactly how my donation supported the farming app development. The transparency is outstanding!',
    author: 'Dr. Robert Chen',
    role: 'Healthcare Sponsor',
    organization: 'Community Health Initiative',
    avatar:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
    rating: 5,
  },
  {
    quote:
      'The skill-based matching helped me join a team where I could focus on backend development while others handled frontend and design. Perfect collaboration!',
    author: 'Sarah Kim',
    role: 'Backend Developer',
    organization: 'GoodDevs Volunteer',
    avatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=60&h=60&fit=crop&crop=face',
    rating: 5,
  },
];

export const TestimonialsSection: FC = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <ThumbsUp className="size-4" />
            User Success Stories
          </div>
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            Voices from Our Community
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
            Hear from requesters, developers, and sponsors who have experienced
            the power of our team-based, skill-specialized approach to tech for
            good.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Quote icon */}
                <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                  <Quote className="size-6 text-primary" />
                </div>

                {/* Star rating */}
                <div className="mb-6 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-6 leading-relaxed text-slate-600">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="size-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.organization}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Trusted by Organizations & Supported by Sponsors
            </h3>
            <p className="text-slate-600">
              Join hundreds of organizations and generous sponsors who believe
              in technology for social good
            </p>
          </div>

          <div className="grid grid-cols-2 items-center justify-items-center gap-8 opacity-60 md:grid-cols-4">
            {/* Placeholder logos - replace with actual client logos */}
            <div className="flex size-16 w-32 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-medium text-slate-500">
                Education NGO
              </span>
            </div>
            <div className="flex size-16 w-32 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-medium text-slate-500">
                Health Initiative
              </span>
            </div>
            <div className="flex size-16 w-32 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-medium text-slate-500">
                Climate Action
              </span>
            </div>
            <div className="flex size-16 w-32 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-medium text-slate-500">
                Rural Development
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
