import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionDropDown } from '../src/Question Stuff/QuestionTeacherView';
import type { QuestionObject } from '../src/Question Stuff/QuestionParent';
//ChatGPT was used to help generate this code 

// -------------------------
// Mock child components
// -------------------------
jest.mock('../src/Question Stuff/QuestionTypesTeacher/MultipleChoiceTeacher', () => ({
  MultipleChoiceTeacher: () => <div>Multiple Choice Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/TrueFalseTeacher', () => ({
  TrueFalseTeacher: () => <div>True False Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/FreeResponseTeacher', () => ({
  FreeResponseTeacher: () => <div>Free Response Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/CodingTeacher', () => ({
  CodingTeacher: () => <div>Coding Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/FillInTheBlankTeacher', () => ({
  FillInTheBlankTeacher: () => <div>Fill in the Blank Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/PageBreakTeacher', () => ({
  PagerBreak: () => <div>Page Break Teacher Question</div>,
}));

jest.mock('../src/Question Stuff/QuestionTypesTeacher/InstructionBox', () => ({
  InstructionBox: () => <div>Instruction Box Teacher Question</div>,
}));

// -------------------------
// Test suite
// -------------------------
describe('QuestionDropDown (Teacher View)', () => {
  let list: QuestionObject[];
  let setList: jest.Mock;

  const allOptions = [
    'Multiple Choice',
    'True False',
    'Free Response',
    'Coding',
    'Fill in the Blank',
    'Page Break',
    'Instruction Box'
  ];

  beforeEach(() => {
    list = [];
    setList = jest.fn();
  });

  test('renders initial "no questions" message', () => {
    render(<QuestionDropDown allOptions={allOptions} list={list} setList={setList} />);
    expect(screen.getByText(/no questions yet/i)).toBeInTheDocument();
  });

  test('adds a multiple choice question', () => {
    render(<QuestionDropDown allOptions={allOptions} list={list} setList={setList} />);

    // Click "Add Question"
    fireEvent.click(screen.getByRole('button', { name: /add question/i }));

    // Expect setList to be called
    expect(setList).toHaveBeenCalled();
  });

  test('adds different question types from dropdown', () => {
    render(<QuestionDropDown allOptions={allOptions} list={list} setList={setList} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'True False' } });
    fireEvent.click(screen.getByRole('button', { name: /add question/i }));

    expect(setList).toHaveBeenCalled();
  });

  test('renders correct child component for each question type', () => {
    // Mock a list with all question types
    const questions: QuestionObject[] = allOptions.map((type) => ({
      Question: `Question for ${type}`,
      Answers: [],
      Answer: '',
      Points: 0,
      Type: type === 'Fill in the Blank' ? 'Fill In The Blank Question' :
            type === 'Page Break' ? 'Page Break' :
            type === 'Instruction Box' ? 'Instruction Box' :
            `${type} Question`,
      StudentAnswer: '',
      MultipleAnswers: false
    }));

    render(<QuestionDropDown allOptions={allOptions} list={questions} setList={setList} />);

    // Check that each mocked component text is present
    expect(screen.getByText('Multiple Choice Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('True False Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('Free Response Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('Coding Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('Fill in the Blank Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('Page Break Teacher Question')).toBeInTheDocument();
    expect(screen.getByText('Instruction Box Teacher Question')).toBeInTheDocument();
  });

  test('clears questions when "Clear Questions" button is clicked', () => {
    render(<QuestionDropDown allOptions={allOptions} list={list} setList={setList} />);
    fireEvent.click(screen.getByRole('button', { name: /clear questions/i }));
    expect(setList).toHaveBeenCalledWith([]);
  });
});
