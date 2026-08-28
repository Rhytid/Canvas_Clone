import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionStudent } from '../src/Question Stuff/QuestionStudentView';
import type { MultipleChoiceQ, QuestionObject } from '../src/Question Stuff/QuestionParent';
import type { Assign } from '../src/Assignment-Components/Dashboard';
//ChatGPT was used to help generate this code 

// Mocking the child components (MultipleChoiceStudent, FreeResponseStudent, etc.)
jest.mock('../src/Question Stuff/QuestionTypesStudent/MultipleChoiceStudent', () => ({
  MultipleChoiceStudent: jest.fn(() => <div>Multiple Choice Student Question</div>),
}));

jest.mock('../src/Question Stuff/QuestionTypesStudent/TrueFalseStudent', () => ({
  TrueFalseStudent: jest.fn(() => <div>True False Student Question</div>),
}));

jest.mock('../src/Question Stuff/QuestionTypesStudent/FreeResponseStudent', () => ({
  FreeResponseStudent: jest.fn(() => <div>Free Response Student Question</div>),
}));

jest.mock('../src/Question Stuff/QuestionTypesStudent/CodingStudent', () => ({
  CodingStudent: jest.fn(() => <div>Coding Student Question</div>),
}));

jest.mock('../src/Question Stuff/QuestionTypesStudent/FillinTheBlankStudent', () => ({
  FillinTheBlankStudent: jest.fn(() => <div>Fill in the Blank Student Question</div>),
}));

describe('QuestionStudent', () => {
  const mockSetList = jest.fn();
  const mockSetAlist = jest.fn();

  const mockQuestions: QuestionObject[] = [
    {
      Question: 'What is 2 + 2?',
      Answer: '4',
      Points: 1,
      Type: 'Multiple Choice Question',
      StudentAnswer: '4',
      MultipleAnswers: false,
    } as MultipleChoiceQ,
    {
      Question: 'Is the sky blue?',
      Answer: 'Yes',
      Points: 1,
      Type: 'True False Question',
      StudentAnswer: 'Yes',
      MultipleAnswers: false,
    } as QuestionObject,
  ];

  const mockAssignList: Assign[] = [
    {
        StudentAttempts: 0,
        Grade: 0,
        editMode: false,
        Title: '',
        dueDate: null,
        Totalpoints: 0,
        time: '',
        notes: '',
        description: '',
        showMetadata: false,
        Questions: [],
        QIndex: 0,
        collaborators: [],
        Attempts: 0,
        Published: false
    },
  ];

  test('renders with questions and shows progress bar', () => {
    render(
      <QuestionStudent
        allOptions={['Multiple Choice', 'True False']}
        list={mockQuestions}
        setList={mockSetList}
        Alist={mockAssignList}
        setAlist={mockSetAlist}
        Aindex={0}
      />
    );

    // Check if the progress bar is rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Check if questions are rendered
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('Is the sky blue?')).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('displays score and feedback after submission', async () => {
    render(
      <QuestionStudent
        allOptions={['Multiple Choice', 'True False']}
        list={mockQuestions}
        setList={mockSetList}
        Alist={mockAssignList}
        setAlist={mockSetAlist}
        Aindex={0}
      />
    );

    // Simulate submitting the questions
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if the score card is shown
    await waitFor(() => expect(screen.getByText(/You scored/i)).toBeInTheDocument());

    // Check if the score percentage is displayed
    expect(screen.getByRole("heading", { level: 1, name: /100%/ })).toBeInTheDocument();

    // Check if the feedback text shows correct answers
    const correctMessages = screen.getAllByText(/Correct!/);
    expect(correctMessages.length).toBeGreaterThan(0);
})

  /*test('shows correct feedback for answers', () => {
    const question: MultipleChoiceQ = {
        Question: 'What is 2 + 2?',
        Answer: '4',
        Points: 1,
        Type: 'Multiple Choice Question',
        StudentAnswer: '4',
        MultipleAnswers: false,
        Answers: []
    };
    
    const list: QuestionObject[]=[question];

    render(<QuestionStudent list={list} setList={() => {}} Alist={[]} setAlist={() => {}} Aindex={0} allOptions={[]} />);

    // Click the Submit button to show feedback
    const submitButton = screen.getByRole('button', { name: /submit/i });
    userEvent.click(submitButton);

    const feedback = screen.getByText((content) => content.includes("Correct!"));
    expect(feedback).toBeInTheDocument();

    });*/

  test('shows feedback with correct color after submission', async () => {
    render(
      <QuestionStudent
        allOptions={['Multiple Choice', 'True False']}
        list={mockQuestions}
        setList={mockSetList}
        Alist={mockAssignList}
        setAlist={mockSetAlist}
        Aindex={0}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByText(/You scored/i)).toBeInTheDocument());

    // Check the score card color
    const scoreCard = screen.getByText(/You scored/i).closest('.card');
    expect(scoreCard).toHaveStyle('background-color: rgb(76, 175, 80)'); // green for 100%
  });

  test('does not display questions if list is empty', () => {
    render(
      <QuestionStudent
        allOptions={['Multiple Choice']}
        list={[]}
        setList={mockSetList}
        Alist={mockAssignList}
        setAlist={mockSetAlist}
        Aindex={0}
      />
    );

    expect(screen.getByText('No questions available at this time. Check back later!')).toBeInTheDocument();
  });
});
