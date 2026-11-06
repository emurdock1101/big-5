import React from 'react';
import Quiz from './Quiz';
import {questionData} from '../constants/questionData';

/** Development-only page: walk the test without an account. Submitting needs a real login. */
const TestPreview: React.FC = () => <Quiz onComplete={() => {}} questionData={questionData} />;

export default TestPreview;
