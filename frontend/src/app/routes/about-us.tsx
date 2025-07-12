import { 
  Users, 
  Clock, 
  MapPin, 
  Heart, 
  Code, 
  Globe, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Eye,
  Rocket,
  Shield,
  TrendingUp,
  Quote,
  ThumbsUp,
  Lightbulb,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Head } from '@/components/seo';
import { Navbar } from '@/components/ui/navbar/navbar';
import { Footer } from '@/components/ui/footer/footer';
import { paths } from '@/config/paths';

const AboutUsRoute: FC = () => {
  const stats = [
    { label: 'Volunteer Developers', value: '200+', icon: Users },
    { label: 'Projects Completed', value: '50+', icon: CheckCircle },
    { label: 'Organizations Helped', value: '30+', icon: Building },
    { label: 'Active Sponsors', value: '15+', icon: Heart },
  ];

  const services = [
    {
      icon: Code,
      title: 'Team-Based Development',
      description: 'Projects are assigned to balanced teams with specialized roles rather than individual developers.',
      benefits: ['Project managers', 'Frontend & backend developers', 'UI/UX designers', 'QA engineers']
    },
    {
      icon: Users,
      title: 'Skill-Based Matching',
      description: 'Advanced matching system that forms teams based on developer specializations and project requirements.',
      benefits: ['Role specification', 'Experience-based matching', 'Complementary skill sets', 'Team collaboration tools']
    },
    {
      icon: Heart,
      title: 'Sponsor Integration',
      description: 'Dedicated sponsor role for individuals and organizations who want to financially support projects.',
      benefits: ['Project sponsorship', 'Developer support', 'Impact tracking', 'Tax documentation']
    },
    {
      icon: Shield,
      title: 'Enhanced Collaboration',
      description: 'Comprehensive project management with GitHub-style discussions, file sharing, and progress tracking.',
      benefits: ['Team workspaces', 'Discussion threads', 'Task management', 'Real-time progress updates']
    }
  ];

  const testimonials = [
    {
      quote: "The team formation feature was incredible. We got matched with a project manager, two developers, and a UX designer who perfectly understood our education mission.",
      author: "Maria Santos",
      role: "Executive Director",
      organization: "Education for All Foundation",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b23c?w=60&h=60&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "As a sponsor, I love being able to track exactly how my donation supported the farming app development. The transparency is outstanding!",
      author: "Dr. Robert Chen",
      role: "Healthcare Sponsor",
      organization: "Community Health Initiative",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The skill-based matching helped me join a team where I could focus on backend development while others handled frontend and design. Perfect collaboration!",
      author: "Sarah Kim",
      role: "Backend Developer",
      organization: "GoodDevs Volunteer",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
      rating: 5
    }
  ];

  const storyMilestones = [
    {
      year: 'Phase 1',
      title: 'Platform Foundation',
      description: 'Building the core platform with user registration, project submission, and basic matching features.',
      icon: Lightbulb,
      detail: 'Establishing secure user authentication for requesters, developers, and admins with fundamental project management tools.'
    },
    {
      year: 'Phase 2',
      title: 'Enhanced Features',
      description: 'Adding advanced project collaboration tools, status tracking, and communication features.',
      icon: Users,
      detail: 'Implementing comprehensive project management with real-time updates and developer-requester communication channels.'
    },
    {
      year: 'Phase 3',
      title: 'Quality & Trust',
      description: 'Introducing feedback systems, performance reviews, and enhanced admin moderation tools.',
      icon: Shield,
      detail: 'Building trust through transparent rating systems and comprehensive quality assurance processes.'
    },
    {
      year: 'Phase 4',
      title: 'Community Growth',
      description: 'Expanding platform reach and introducing donation/sponsorship features for sustainability.',
      icon: Heart,
      detail: 'Growing our community of volunteer developers and supporting organizations while ensuring platform longevity.'
    },
    {
      year: 'Future',
      title: 'Global Impact',
      description: 'Scaling to serve tech-for-good projects worldwide with advanced matching algorithms.',
      icon: Globe,
      detail: 'Creating a global network where technology expertise flows freely to those who need it most.'
    }
  ];

  const achievements = [
    { metric: '98%', label: 'Project Success Rate', icon: TrendingUp },
    { metric: '4.9/5', label: 'Client Satisfaction', icon: Star },
    { metric: '45 Days', label: 'Average Project Delivery', icon: Clock },
    { metric: '24/7', label: 'Global Support Coverage', icon: Shield }
  ];

  const values = [
    {
      icon: Users,
      title: 'Team-First Approach',
      description: 'We believe great projects come from balanced teams with diverse, specialized skills working together.'
    },
    {
      icon: Target,
      title: 'Skill Specialization',
      description: 'Matching the right expertise to project needs ensures higher quality outcomes and better learning experiences.'
    },
    {
      icon: Heart,
      title: 'Inclusive Participation',
      description: 'Our platform welcomes requesters, developers, sponsors, and supporters - everyone has a role in tech for good.'
    },
    {
      icon: Shield,
      title: 'Transparent Impact',
      description: 'From project progress to donation tracking, we provide clear visibility into how contributions create change.'
    }
  ];

  return (
    <>
      <Head 
        title="About Us" 
        description="Learn about GoodDevs mission to connect skilled developers with meaningful projects that make a difference in communities worldwide."
      />
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/5 px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Connecting Purpose with Technology
            </div>
            <h1 className="mb-8 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Where <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Good Developers</span><br />
              Meet Good Causes
            </h1>
            <p className="text-xl leading-8 text-slate-600 max-w-3xl mx-auto">
              A web-based platform that connects individuals and nonprofit organizations in need of technical solutions 
              with volunteer developers who are willing to offer their skills for free, promoting social good through technology.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              {/* Vision */}
              <div className="group">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Vision</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mt-2 rounded-full"></div>
                  </div>
                </div>
                <p className="mb-6 text-lg leading-8 text-slate-600">
                  A world where every individual, community group, and nonprofit organization has access to 
                  the technical support they need, regardless of their funding limitations.
                </p>
                <p className="text-lg leading-8 text-slate-600">
                  We envision a centralized platform that bridges the gap between those who need technical help 
                  and volunteer developers willing to contribute their skills for meaningful causes.
                </p>
                <div className="mt-8 flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
                  <Target className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="text-sm text-slate-700">
                    <strong>Our Goal:</strong> Bridge the gap between nonprofits needing tech support and developers seeking meaningful experience
                  </div>
                </div>
              </div>

              {/* Mission */}
              <div className="group">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 ring-1 ring-accent/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Rocket className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Mission</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-accent to-primary mt-2 rounded-full"></div>
                  </div>
                </div>
                <p className="mb-6 text-lg leading-8 text-slate-600">
                  To create a comprehensive platform that connects nonprofits with specialized development teams 
                  while enabling sponsors to support meaningful tech-for-good initiatives.
                </p>
                <div className="space-y-4">
                  {[
                    'Form balanced teams with specialized roles (frontend, backend, project managers, designers)',
                    'Enable skill-based matching between projects and developer expertise areas',
                    'Provide sponsors with transparent ways to support projects and developers',
                    'Facilitate comprehensive project collaboration through advanced workspace tools'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Development Roadmap
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
                Many individuals, community groups, and nonprofits need technical support but lack funding 
                to hire professional developers. Meanwhile, many developers seek opportunities to gain experience 
                and contribute to meaningful causes. GoodDevs bridges this gap.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform md:-translate-x-0.5"></div>
              
              <div className="space-y-16">
                {storyMilestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg transform md:-translate-x-8 z-10">
                      <milestone.icon className="h-8 w-8" />
                    </div>
                    
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} ml-24 md:ml-0`}>
                      <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                          {milestone.title}
                        </h3>
                        <p className="mb-4 text-slate-600 leading-relaxed">{milestone.description}</p>
                        <p className="text-sm text-slate-500 italic border-l-4 border-primary/20 pl-4">
                          {milestone.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services & Benefits Section */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Briefcase className="h-4 w-4" />
                Platform Features
              </div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                How Our Platform Works
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
                From team formation to project completion, our platform provides comprehensive 
                tools for requesters, developers, sponsors, and admins to collaborate effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {services.map((service, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-accent mt-1 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                    </div>
                    <p className="mb-6 text-slate-600 leading-relaxed">{service.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-900 mb-3">Key Benefits:</div>
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                    <achievement.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{achievement.metric}</div>
                  <div className="text-sm text-slate-600">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof & Testimonials Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <ThumbsUp className="h-4 w-4" />
                User Success Stories
              </div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Voices from Our Community
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
                Hear from requesters, developers, and sponsors who have experienced 
                the power of our team-based, skill-specialized approach to tech for good.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group relative">
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Quote icon */}
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>
                    
                    {/* Star rating */}
                    <div className="mb-6 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <Star key={starIndex} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="mb-6 text-slate-600 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.author}</div>
                        <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                        <div className="text-sm text-slate-500">{testimonial.organization}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-16 border-t border-slate-200 pt-16">                <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Organizations & Supported by Sponsors</h3>
                <p className="text-slate-600">Join hundreds of organizations and generous sponsors who believe in technology for social good</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center justify-items-center opacity-60">
                {/* Placeholder logos - replace with actual client logos */}
                <div className="flex items-center justify-center h-16 w-32 bg-slate-100 rounded-lg">
                  <span className="text-slate-500 font-medium text-sm">Education NGO</span>
                </div>
                <div className="flex items-center justify-center h-16 w-32 bg-slate-100 rounded-lg">
                  <span className="text-slate-500 font-medium text-sm">Health Initiative</span>
                </div>
                <div className="flex items-center justify-center h-16 w-32 bg-slate-100 rounded-lg">
                  <span className="text-slate-500 font-medium text-sm">Climate Action</span>
                </div>
                <div className="flex items-center justify-center h-16 w-32 bg-slate-100 rounded-lg">
                  <span className="text-slate-500 font-medium text-sm">Rural Development</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Our Core Values
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
                These principles guide every decision we make and every line of code we write.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {values.map((value, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-slate-200 p-8 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                    </div>
                    <p className="leading-7 text-slate-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative bg-gradient-to-r from-primary via-primary/90 to-accent px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              Join the Movement
            </div>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Code for Good?
            </h2>
            <p className="mb-8 text-xl text-white/90 max-w-2xl mx-auto">
              Whether you're a requester needing technical solutions, a developer with specialized skills, 
              or a sponsor wanting to support meaningful projects, we're here to connect you.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                className="w-full whitespace-nowrap bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-xl sm:w-auto"
              >
                Join a Team
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full whitespace-nowrap border-2 border-white px-8 py-4 text-lg font-semibold text-white bg-transparent transition-all duration-200 hover:bg-white hover:text-primary sm:w-auto"
              >
                Become a Sponsor
              </Button>
            </div>
            
            {/* Contact info */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Global Remote Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Impact Focused</span>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutUsRoute;
