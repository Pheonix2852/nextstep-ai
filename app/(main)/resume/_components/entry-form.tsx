"use client"

import { improveWithAI } from '@/actions/resume'
import { entrySchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = parse(dateString, "yyyy-MM", new Date())
    return format(date, "MMM yyyy")
}


type Entry = {
  title: string
  organization: string
  startDate: string
  endDate?: string
  description: string
  current?: boolean
}

type EntryFormProps = {
  type: string
  entries: Entry[]
  onChange: (entries: Entry[]) => void
}


const EntryForm: React.FC<EntryFormProps> = ({ type, entries, onChange }) => {  

const [isAdding, setIsAdding] = useState(false)

const {
    register, 
    handleSubmit : handleValidation, 
    watch, 
    formState :{ errors },
    reset,
    setValue
} = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues:{
        title:"",
        organization:"",
        startDate:"",
        endDate:"",
        description:"",
        current:false,
    }
})

const current = watch("current")

const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
} = useFetch(improveWithAI)

const handleAdd = handleValidation((data)=>{
    const formattedEntry = {
        ...data,
        startDate: formatDisplayDate(data.startDate ?? ""),
        endDate: data.current? "":formatDisplayDate(data.endDate ?? "")
    }

    onChange([...entries, formattedEntry])
    reset()
    setIsAdding(false)
})

const handleDelete = (index : number)=>{
    const newEntries = entries.filter((_,i) => i !==index)
    onChange(newEntries)
}

useEffect(() => {
    if (improvedContent && !isImproving) {
        setValue("description", improvedContent)
        toast.success("Description Improved Successfully!")
    }

    if (improveError){
        toast.error(improveError.message || "Failed to improve description")
    }
},[improvedContent,improveError,isImproving])

const handleImproveDescription = async () => {
    const description = watch ("description");
    const company = watch ("organization")
    if (!description){
        toast.error("Please enter a description first");
        return
    }

    if (!company){
        toast.error("Please enter organization name first");
        return
    }

    await improveWithAIFn({
        current: description,
        type: type.toLowerCase(), //'experience', 'education', 'projects'
        organization: company
    })
}


return (
    <div className='space-y-4'>
        <div className='space-y-4'>
            {entries.map((item, index : number)=>{
                return(
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm text-medium'>
                                {item.title} @ {item.organization}
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="icon"
                                type='button'
                                onClick={() => handleDelete(index)}
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                {item.current? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                            </p>
                            <p className='mt-2 text-sm whitespace-pre-wrap'>
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add {type}</CardTitle>
                    </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input 
                                        placeholder='Title/Position'
                                        {...register("title")}
                                    />
                                    {errors.title && (
                                        <p className='text-sm text-red-500'>{errors.title.message}</p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Input 
                                        placeholder='Organization'
                                        {...register("organization")}
                                    />
                                    {errors.organization && (
                                        <p className='text-sm text-red-500'>{errors.organization.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input 
                                        type='month'
                                        {...register("startDate")}
                                    />
                                    {errors.startDate && (
                                        <p className='text-sm text-red-500'>{errors.startDate.message}</p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Input 
                                        type='month'
                                        {...register("endDate")}
                                        disabled={current}
                                    />
                                    {errors.endDate && (
                                        <p className='text-sm text-red-500'>{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <input 
                                    type="checkbox"
                                    id='current'
                                    {...register('current')}
                                    onChange={(e)=>{
                                        setValue("current",e.target.checked)
                                        if(e.target.checked){
                                            setValue("endDate","")
                                        }
                                    }} 
                                />
                                <label htmlFor="current">Current {type}</label>
                            </div>

                            <div className='space-y-2'>
                                <Textarea
                                    placeholder={`Description of your ${type.toLowerCase()}`}
                                    className='h-32'
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className='text-sm text-red-500'>
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type='button'
                                variant="ghost"
                                size="sm"
                                onClick={handleImproveDescription}
                                disabled={isImproving || !watch('description')}
                            >
                                {isImproving ? (
                                    <>
                                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                        Improving...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='h-4 w-4 mr-2' />
                                        Improve with AI
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    <CardFooter className='flex justify-end space-x-2'>
                        <Button 
                            type='button'
                            variant="outline"
                            onClick={() =>{
                                reset()
                                setIsAdding(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type='button' onClick={handleAdd}>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add Entry
                        </Button>
                    </CardFooter>
                </Card>
                )}

            {!isAdding && (
                <Button
                    className='w-full'
                    variant="outline"
                    onClick={()=> setIsAdding(true)}
                >
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Add {type}
                </Button>
            )}
        </div>
    )
}

export default EntryForm