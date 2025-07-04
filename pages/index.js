import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import GitHubLink from '../components/GitHubLink';
import { useCatechism } from '../utils/useCatechism';

// Helper function to recursively get all subsection keys
const getAllSubsectionKeys = (sections) => {
  const keys = {};
  
  sections.forEach((section, sIdx) => {
    section.subsections?.forEach((subsection, ssIdx) => {
      const subKey = `${sIdx}-${ssIdx}`;
      keys[subKey] = true;
      
      // Handle nested subsections
      subsection.subsections?.forEach((_, sssIdx) => {
        const nestedKey = `${sIdx}-${ssIdx}-${sssIdx}`;
        keys[nestedKey] = true;
      });
    });
  });
  
  return keys;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const { sections, results } = useCatechism(query);
  const [openSections, setOpenSections] = useState({});
  const [openSubsections, setOpenSubsections] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  
  const toggleAll = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    
    // Toggle all sections
    const newSectionsState = {};
    const newSubsectionsState = {};
    
    sections.forEach((section, sectionIndex) => {
      newSectionsState[sectionIndex] = newState;
      
      // Get all subsection keys and set their state
      const allKeys = getAllSubsectionKeys(sections);
      Object.keys(allKeys).forEach(key => {
        newSubsectionsState[key] = newState;
      });
    });
    
    setOpenSections(newSectionsState);
    setOpenSubsections(newSubsectionsState);
  };
  
  const toggleSection = (index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };
  
  const toggleSubsection = (path) => {
    setOpenSubsections(prev => ({ ...prev, [path]: !prev[path] }));
  };
  
  const isSubsectionOpen = (path) => {
    return openSubsections[path] === true;
  };
  
  // Recursive function to render subsections
  const renderSubsections = (subsections, path = '') => {
    if (!subsections || subsections.length === 0) return null;
    
    return subsections.map((subsection, index) => {
      const currentPath = path ? `${path}-${index}` : `${index}`;
      const isOpen = isSubsectionOpen(currentPath);
      
      return (
        <div key={index} className="space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          <button
            onClick={() => toggleSubsection(currentPath)}
            className="w-full text-left flex justify-between items-center py-2 font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="text-lg">{subsection.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="space-y-4 pl-4">
              {subsection.questions?.map((q, qIndex) => (
                <div key={qIndex} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="grid gap-2 mb-1" style={{gridTemplateColumns:'auto 1fr'}}>
                    <span className="font-bold text-gray-700 dark:text-gray-300">Q.</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{q.question}</p>
                  </div>
                  <div className="grid gap-2 mt-2" style={{gridTemplateColumns:'auto 1fr'}}>
                    <span className="font-bold text-gray-700 dark:text-gray-300">A.</span>
                    <p className="text-gray-700 dark:text-gray-300">{q.answer}</p>
                  </div>
                </div>
              ))}
              
              {/* Recursively render nested subsections */}
              {renderSubsections(subsection.subsections, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catechism of St. Pius X</h1>
        <div className="flex items-center gap-2">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
      <div className="mb-4">
        <input
        type="text"
        placeholder="Search questions..."
        className="w-full p-2 border rounded mb-8 dark:bg-gray-800 dark:border-gray-700"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />
        
      </div>
      <button
        onClick={toggleAll}
        className="px-3 py-2 border rounded mb-8 dark:border-gray-700"
      >
        {allExpanded ? 'Collapse All' : 'Expand All'}
      </button>

      {query ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            results.map((item, index) => (
              <div key={index} className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.sectionTitle} &gt; {item.subsectionTitle}
                </div>
                <div className="grid gap-2 mb-1" style={{gridTemplateColumns:'auto 1fr'}}>
                  <span className="font-semibold">Q.</span>
                  <p className="font-medium">{item.question}</p>
                </div>
                <div className="grid gap-2" style={{gridTemplateColumns:'auto 1fr'}}>
                  <span className="font-semibold">A.</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))
          )}
        </section>
      ) : (
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border rounded-lg overflow-hidden dark:border-gray-700">
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold">
                  {section.title}
                </h2>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openSections[sectionIndex] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections[sectionIndex] && (
                <div className="p-4 space-y-6">
                  {renderSubsections(section.subsections, sectionIndex.toString())}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
