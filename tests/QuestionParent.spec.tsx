import { render, screen } from '@testing-library/react';
import { QuestionParent } from '../src/Question Stuff/QuestionParent';
import type { Assign } from '../src/Assignment-Components/Dashboard';
//ChatGPT was used to help generate this code 

// Mock QuestionTeacherView (used when StudentTeacher is true)
jest.mock('../src/Question Stuff/QuestionTeacherView', () => ({
  QuestionDropDown: jest.fn(() => <div>QuestionDropDown</div>),
}));

// Mock QuestionStudentView (used when StudentTeacher is false)
jest.mock('../src/Question Stuff/QuestionStudentView', () => ({
  QuestionStudent: jest.fn(() => <div>QuestionStudent</div>),
}));

describe('QuestionParent Component', () => {
  const mockSetQList = jest.fn();
  const mockSetAList = jest.fn();
  const mockQlist = [
    { Question: 'Sample Question 1', Answers: ['A', 'B'], Answer: 'A', Points: 1, Type: 'Multiple Choice', StudentAnswer: 'A', MultipleAnswers: false },
  ];
  const mockAList: Assign[] = [];
  const mockAindex = 0;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when StudentTeacher is true (Teacher View)', () => {
    it('renders QuestionDropDown', () => {
      render(
        <QuestionParent
          StudentTeacher={true}
          Qlist={mockQlist}
          setQList={mockSetQList}
          AList={mockAList}
          setAList={mockSetAList}
          Aindex={mockAindex}
        />
      );

      // Check if QuestionDropDown is rendered
      expect(screen.getByText('QuestionDropDown')).toBeInTheDocument();
    });
  });

  describe('when StudentTeacher is false (Student View)', () => {
    it('renders QuestionStudent', () => {
      render(
        <QuestionParent
          StudentTeacher={false}
          Qlist={mockQlist}
          setQList={mockSetQList}
          AList={mockAList}
          setAList={mockSetAList}
          Aindex={mockAindex}
        />
      );

      // Check if QuestionStudent is rendered
      expect(screen.getByText('QuestionStudent')).toBeInTheDocument();
    });
  });
});
