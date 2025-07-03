import { useMemo } from 'react';
import catechismData from '../catechism-st-pius-x/catechism-st-pius-x.json';

export function useCatechism(searchQuery) {
  const sections = catechismData.sections;

  // Flatten the data structure for easier searching
  const flattenedQuestions = useMemo(() => {
    return sections.flatMap(section => 
      section.subsections.flatMap(subsection => 
        subsection.questions.map(question => ({
          ...question,
          sectionTitle: section.title,
          subsectionTitle: subsection.title
        }))
      )
    );
  }, [sections]);

  const results = useMemo(() => {
    if (!searchQuery?.trim()) return [];
    const searchTerm = searchQuery.trim().toLowerCase();
    
    // Simple case-insensitive text search across questions and answers
    return flattenedQuestions.filter(q => 
      q.question.toLowerCase().includes(searchTerm) || 
      q.answer.toLowerCase().includes(searchTerm)
    );
  }, [searchQuery, flattenedQuestions]);

  return { sections, results };
}
