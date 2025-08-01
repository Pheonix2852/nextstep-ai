"use client"

import { generateQuiz, saveQuizResult } from '@/actions/interview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useFetch from '@/hooks/use-fetch'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import QuizResult, { QuestionResult } from './quiz-result'

const Quiz = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<(string | null)[]>([]);
    const [showExplanation, setShowExplanation] = useState(false)

    const {
        loading: genaratingQuiz,
        fn: generateQuizFn,
        data: quizData
    } = useFetch(generateQuiz);

    const {
        loading: savingResult,
        fn: saveQuizResultFn,
        data: resultData,
        setData: setResultData,
    } = useFetch(saveQuizResult);

    useEffect(()=>{
        if(quizData)
            setAnswers(new Array(quizData.length).fill(null))
    },[quizData])

    const handleAnswer = (answer: string | null) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = ()=>{
        if (currentQuestion < quizData.length - 1){
            setCurrentQuestion(currentQuestion + 1)
            setShowExplanation(false)
        } else{
            finishQuiz()
        }
    }

    const calculateScore = () => {
        let correct = 0
        answers.forEach((answer, index)=>{
            if(answer === quizData[index].correctAnswer){
                correct++
            }
        })
        return (correct/quizData.length) * 100
    }

    const finishQuiz = async () =>{
        const score = calculateScore()

        try {
            await saveQuizResultFn(quizData, answers as string[], score)
            toast.success("Quiz Completed")
        } catch (error) {
            if (error instanceof Error) {
            toast.error(error.message);
            } else {
            toast.error("Failed to save Quiz Results");
            }
        }
    }

    const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplanation(false);
        generateQuizFn();
        setResultData(null)
    }

    if (genaratingQuiz){
        return (
            <BarLoader className='mt-4' width={"100%"} color='gray' />
        )
    }

    if (resultData){

        const typedResult = {
        ...resultData,
        questions: resultData.questions as unknown as QuestionResult[],
        };

        return (
            <div className='mx-2'>
                <QuizResult result={typedResult} onStartNew={startNewQuiz} />
            </div>
        )
    }

    if(!quizData){
        return (
            <Card className='mx-2'>
                <CardHeader>
                    <CardTitle>Ready to Test Your Knowledge?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground'>
                        The quiz contains 10 questions specific to your industry an skills. Take your time to choose the best answer for each question
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={generateQuizFn}>Start Quiz</Button>
                </CardFooter>
            </Card>
        )
    }

    const question = quizData[currentQuestion]

  return (
    <div>
        <Card className='mx-2'>
                <CardHeader>
                    <CardTitle>Question {currentQuestion + 1} of {quizData.length}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-lg font-medium'>
                        {question.question}
                    </p>

                    <RadioGroup 
                        className='space-y-2'
                        onValueChange={handleAnswer}
                        value={answers[currentQuestion]}>
                        {question.options.map((option: string, index: number)=>{
                            return (
                                <div className="flex items-center space-x-2" key={index}>
                                    <RadioGroupItem value={option} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`}>{option}</Label>
                                </div>
                            )
                        })}
                    </RadioGroup>

                    {showExplanation && (
                        <div className='mt-4 p-4 bg-muted rounded-lg'>
                            <p className='font-medium'>Explanation:</p>
                            <p className='text-muted-foreground'>{question.explanation}</p>
                        </div>)}
                </CardContent>
                <CardFooter>
                    {!showExplanation && (
                        <Button
                            onClick={()=>setShowExplanation(true)} variant="outline" disabled={!answers[currentQuestion]}>
                                Show Explanation
                        </Button>
                    )}

                    <Button
                            onClick={handleNext} 
                            className='ml-auto' 
                            disabled={!answers[currentQuestion] || savingResult}
                            >
                            {savingResult && <Loader2 className='mr-2 h-4 w-4 animate-spin'/>}
                            {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                </CardFooter>
            </Card>
    </div>
  )
}

export default Quiz