"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema } from '@/app/lib/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import useFetch from '@/hooks/use-fetch'
import { updateUser } from '@/actions/user'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Industry = {
  id: string;
  name: string;
  subIndustries: string[];
};

type OnboardingFormValues = z.infer<typeof onboardingSchema>

const OnboardingForm = ({ industries }: { industries: Industry[] }) => {

  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const router = useRouter()

  const {loading : updateLoading, fn : updateUserFn, data : updateResult} = useFetch(updateUser)

  const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = async (values : OnboardingFormValues ) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`

      await updateUserFn({
      ...values,
      industry: formattedIndustry,
      bio: values.bio ?? "",
      skills: values.skills ?? []
    });

    } catch (error) {
      console.error("Onboarding Error",error)
    }
  }

  useEffect(()=>{
    if(updateResult?.success && !updateLoading){
      toast.success("Profile completed successfully")
      router.push("/dashboard")
      router.refresh()
    }
  },[updateResult, updateLoading])

  const watchIndustry = watch ("industry")

  return (
    <div className='flex items-center justify-center bg-background'>
      <Card className='w-full max-w-lg mt-10 mx-2'>
        <CardHeader>
          <CardTitle className='gradient-title text-4xl'>Complete Your Profile</CardTitle>
          <CardDescription>Seleect theindustry to get personalized career insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>

            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(industries.find((ind) => ind.id === value) || null);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id='industry'>
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind)=>{
                    return (
                      <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className='text-sm text-red-500'>
                  {errors.industry.message}
                </p>
              )}
            </div>

          {watchIndustry && (
            <div className='space-y-2'>
              <Label htmlFor='SubIndustry'>Specialization</Label>
              <Select
                onValueChange={(value) => setValue("subIndustry", value)}>
                <SelectTrigger id='subIndustry'>
                  <SelectValue placeholder="Select a Sub-Industry" />
                </SelectTrigger>
                <SelectContent>
                  {selectedIndustry?.subIndustries.map((ind)=>{
                    return (
                      <SelectItem value={ind} key={ind}>{ind}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className='text-sm text-red-500'>
                  {errors.subIndustry.message}
                </p>
              )}
            </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='experience'>Years of Experience</Label>
              <Input id='experience' type='number' min='0' max='50' placeholder='Enter Years of Experience' {...register("experience")}></Input>
              {errors.experience && (
                <p className='text-sm text-red-500'>
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='skills'>Skills</Label>
              <Input id='skills' placeholder='eg: Python, JavaScript, Project Management' {...register("skills")}></Input>

              <p className='text-sm text-muted-foreground'>
                Enter Multiple Skills with commas
              </p>

              {errors.skills && (
                <p className='text-sm text-red-500'>
                  {errors.skills.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio'>Professional Bio</Label>
              <Textarea id='bio' placeholder='Tell us about your Professional Background' className='h-32' {...register("bio")}></Textarea>

              {errors.bio && (
                <p className='text-sm text-red-500'>
                  {errors.bio.message}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
              "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OnboardingForm