import { useMemo } from 'react';
import catechismData from '../catechism-st-pius-x/catechism-st-pius-x.json';

// Recursive function to flatten subsections for searching
const flattenSubsections = (subsections, parentTitles = []) => {
  if (!subsections) return [];
  
  return subsections.flatMap(subsection => {
    const currentTitles = [...parentTitles, subsection.title];
    const questions = subsection.questions?.map(q => ({
      ...q,
      sectionTitle: currentTitles[0],
      subsectionTitle: currentTitles.join(' > ')
    })) || [];
    
    const nestedQuestions = flattenSubsections(subsection.subsections, currentTitles);
    return [...questions, ...nestedQuestions];
  });
};

export function useCatechism(searchQuery) {
  const sections = catechismData.sections;

  // Flatten the data structure for easier searching, handling nested subsections
  const flattenedQuestions = useMemo(() => {
    return sections.flatMap(section => 
      flattenSubsections(section.subsections, [section.title])
    );
  }, [sections]);

  const results = useMemo(() => {
    if (!searchQuery?.trim()) return [];
    const searchTerm = searchQuery.trim().toLowerCase();
    
    // Case-insensitive text search across questions and answers
    return flattenedQuestions.filter(q => 
      q.question.toLowerCase().includes(searchTerm) || 
      q.answer.toLowerCase().includes(searchTerm)
    );
  }, [searchQuery, flattenedQuestions]);

  return { sections, results };
}
