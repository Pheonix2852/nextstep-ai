import React from 'react'
import { QuestionResult } from './quiz-result';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrophyIcon } from 'lucide-react';

  type StatsCardsProps = {
    assessments: Assessment[];
  };


  type Assessment = {
    quizScore: number;
    questions: QuestionResult[];
    improvementTip?: string | null;
    createdAt?: Date;
  };


const StatsCards: React.FC<StatsCardsProps> = ({ assessments }) => {


  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum: number, assessment: Assessment) => sum + assessment.quizScore, 0
    )
    return (total/assessments.length).toFixed(1)
  }

  const getLatestAssessment = () => {
    if(!assessments?.length) return null
    return assessments[0]
  }

  const getTotalQuestions = () => {
    if(!assessments?.length) return 0;
    return assessments.reduce(
    (sum: number, assessment: Assessment) => sum + assessment.questions.length, 0
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{getAverageScore()}%</div>
            <p className='text-xs text-muted-foreground'>
              Across All Assessments
            </p>
          </CardContent>
      </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Practiced</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{getTotalQuestions()}%</div>
            <p className='text-xs text-muted-foreground'>
              Total Questions
            </p>
          </CardContent>
      </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
            <p className='text-xs text-muted-foreground'>
              Mist Recent Quiz
            </p>
          </CardContent>
      </Card>

    </div>
  )
}

export default StatsCards 
