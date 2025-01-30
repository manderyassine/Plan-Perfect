import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About PlanPerfect
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary-900">
              What is PlanPerfect?
            </h3>
            <p>
              PlanPerfect is a powerful task management application designed to help you 
              streamline your productivity and take control of your daily tasks and projects.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary-900">
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Task Creation:</strong> Easily create and organize tasks with 
                detailed information like title, description, priority, and status.
              </li>
              <li>
                <strong>Task Management:</strong> Edit, update, and track the progress 
                of your tasks with intuitive status tracking.
              </li>
              <li>
                <strong>Dashboard Insights:</strong> Get a comprehensive overview of 
                your tasks, including completion rates, pending tasks, and in-progress items.
              </li>
              <li>
                <strong>Dark Mode:</strong> Work comfortably in any lighting with 
                a sleek dark mode that reduces eye strain.
              </li>
              <li>
                <strong>Responsive Design:</strong> Access your tasks from any device 
                with a fully responsive and mobile-friendly interface.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary-900">
              Our Mission
            </h3>
            <p>
              At PlanPerfect, we believe in empowering individuals and teams to 
              achieve more by providing a simple, intuitive, and powerful task 
              management solution that adapts to your workflow.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary-900">
              Technologies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with React, Tailwind CSS, Node.js, and MongoDB
            </p>
          </section>
        </div>

        <div className="p-6 border-t dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} PlanPerfect. Designed and developed with ❤️ By-MYassine
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
