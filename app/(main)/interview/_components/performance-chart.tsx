"use client"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { QuestionResult } from './quiz-result'

  type StatsCardsProps = {
    assessments: Assessment[];
  };


  type Assessment = {
    quizScore: number;
    questions: QuestionResult[];
    improvementTip?: string | null;
    createdAt?: Date;
  };


const PerformanceChart: React.FC<StatsCardsProps> = ({ assessments }) => {

const [chartData, setChartData] = useState<{ date: string; score: number }[]>([]);

  useEffect(()=>{
    if(assessments){
      const formattedData = assessments.map((assessment) => ({
      date: format(new Date(assessment.createdAt ?? new Date()), "MMM dd"),
      score: assessment.quizScore,
    }));


      setChartData(formattedData)
    }
  },[assessments])
  return (
      <Card>
        <CardHeader>
          <CardTitle className='gradient-title text-3xl md:text-4xl'>Performance Trend</CardTitle>
          <CardDescription>Your Quiz Scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
              > 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]}/>
                <Tooltip content={({active, payload}) => {
                  if (active && payload?.length){
                    return (
                      <div className='bg-background border rounded-lg p-2 shadow-md'>
                        <p className='text-sm font-medium'>
                          Score: {payload[0].value}%
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {payload[0].payload.date  }
                        </p>
                      </div>
                    )
                  }
                }}/>
                <Line type="monotone" dataKey="score" stroke="#ebebeb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
  )
}

export default PerformanceChart