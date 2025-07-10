import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-6">
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-3xl font-bold text-transparent">
              GoodDevs
            </span>
          </div>
          <p className="mb-8 text-lg text-slate-200">
            Connecting developers with meaningful projects that make a
            difference
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-8">
            <a
              href="#"
              className="text-slate-200 transition-colors hover:text-accent"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-200 transition-colors hover:text-accent"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-slate-200 transition-colors hover:text-accent"
            >
              Contact Us
            </a>
          </div>
          <div className="text-sm text-slate-300">
            © {new Date().getFullYear()} GoodDevs. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
