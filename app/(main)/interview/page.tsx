import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/stats-card';
import PerformanceChart from './_components/performance-chart';
import QuizList, { QuestionResult } from './_components/quiz-list';

const InterviewPage = async () => {

  const rawAssessments = await getAssessments();

  const assessments = rawAssessments.map((a: any) => ({
    ...a,
    questions: (a.questions ?? []).filter((q: any) => q !== null) as QuestionResult[],
  }));

  return (
    <div>
      <h1 className='text-6xl font-bold mb-5 gradient-title'>
        IntervieW Preparation
      </h1>

      <div className='space-y-6'>
        <StatsCards assessments={assessments}></StatsCards>
        <PerformanceChart assessments={assessments}></PerformanceChart>
        <QuizList assessments={assessments}></QuizList>

      </div>
    </div>
  )
}

export default InterviewPage