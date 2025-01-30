import React, { useState } from 'react';
import { 
  GithubIcon, 
  LinkedinIcon, 
  TwitterIcon,
  InfoIcon
} from 'lucide-react';
import AboutModal from './AboutModal';

const Footer = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: GithubIcon, 
      href: 'https://github.com/manderyassine', 
      label: 'GitHub' 
    },
    { 
      icon: LinkedinIcon, 
      href: 'https://www.linkedin.com/in/mander-yassine-5b3b98349/', 
      label: 'LinkedIn' 
    },
    { 
      icon: TwitterIcon, 
      href: 'https://twitter.com/manderyassine25', 
      label: 'Twitter' 
    }
  ];

  return (
    <>
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 ml-16">
            &copy; {currentYear} PlanPerfect
          </div>
          
          <div className="flex space-x-4 items-center">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="
                text-gray-600 
                dark:text-gray-400 
                hover:text-primary 
                dark:hover:text-primary-900 
                transition-colors
                mr-2
              "
              aria-label="About PlanPerfect"
            >
              <InfoIcon className="w-5 h-5" />
            </button>

            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-gray-600 
                  dark:text-gray-400 
                  hover:text-primary 
                  dark:hover:text-primary-900 
                  transition-colors
                "
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  );
};

export default Footer;
