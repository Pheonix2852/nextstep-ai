"use client"

import { saveResume } from '@/actions/resume'
import { resumeSchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import EntryForm from './entry-form'
import { entriesToMarkdown } from '@/app/lib/helper'
import MDEditor from "@uiw/react-md-editor";
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

type ResumeBuilderProps = {
  initialContent?: any;
};


const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialContent }) => {

const [activeTab, setActiveTab] = useState("edit")
const [resumeMode, setResumeMode] = useState<"live" | "edit" | "preview">("preview");
const [previewContent, setPreviewContent] = useState(initialContent)
const [isGenerating, setIsGenerating] = useState(false)

const {user} = useUser()

const {
    control, 
    register, 
    handleSubmit, 
    watch, 
    formState :{ errors }
} = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues:{
        contactInfo:{},
        summary:"",
        skills:"",
        education:[],
        experience:[],
        projects:[],
    }
})

const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError
} = useFetch(saveResume)

const formValues = watch()

useEffect(() =>{
    if(initialContent) setActiveTab("preview")
},[initialContent])

useEffect(()=>{
    if(activeTab === "edit"){
        const newContent = getCombinedContent();
        setPreviewContent(newContent ? newContent : initialContent)
    }
},[formValues,activeTab])

const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    const name = user?.fullName || "Your Name";

    return parts.length > 0
      ? `## <div align="center">${name}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
    getContactMarkdown(),
    summary && `## Professional Summary\n\n${summary}`,
    skills && `## Skills\n\n${skills}`,
    entriesToMarkdown(experience, "Work Experience"),
    entriesToMarkdown(education, "Education"),
    entriesToMarkdown(projects, "Projects"),
    ]
    .filter(Boolean)
    .join("\n\n");
};

useEffect(()=>{
    if (saveResult && !isSaving){
        toast.success("Resume Saved Successfully")
    }
    if (saveError){
        toast.error(saveError.message || "Failed to save resume")
    }
},[saveResult, saveError, isSaving])

  const onSubmit = async () => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn({ content: formattedContent });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

const generatePDF = async () =>{
    setIsGenerating(true)
    try {
        const element = document.getElementById('resume-pdf')
        if (element) {
        element.style.backgroundColor = "#ffffff";
        }
        if (!element) throw new Error("Resume element not found");

        // @ts-ignore
        const html2pdf = (await import("html2pdf.js")).default;

        const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

        await html2pdf().set(opt).from(element).save()
    } catch (error) {
        console.error("PDF generation error:", error);
    } finally{
        setIsGenerating(false)
    }
}

  return (
    <div>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <h1 className='font-bold gradient-title text-5xl md:text-6xl'>
                Resume Builder
            </h1>

            <div className='space-x-2'>
                <Button
                    onClick={onSubmit}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className='h-4 w-4' />
                            Save
                        </>
                    )}
                </Button>

                <Button onClick={generatePDF} disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className='h-4 w-4'/>
                            Download PDF
                        </>
                    )}
                </Button>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="edit">Form</TabsTrigger>
                <TabsTrigger value="preview">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <form className='space-y-8'>
                    <div className='space-y-4'>
                        <h3 className='text-lg '>Contact Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50'>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>E-Mail</label>
                                <Input
                                    {...register("contactInfo.email")}
                                    type="email"
                                    placeholder="example@email.com"
                                    error={errors.contactInfo?.email?.message}
                                />

                                {errors.contactInfo?.email && (
                                    <p className='text-sm tex-red-500'>
                                        {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Mobile</label>
                                <Input
                                    {...register("contactInfo.mobile")}
                                    type="tel"
                                    placeholder="+01 234 456 7890"
                                    error={errors.contactInfo?.mobile?.message}
                                />

                                {errors.contactInfo?.email && (
                                    <p className='text-sm tex-red-500'>
                                        {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Linked In</label>
                                <Input
                                    {...register("contactInfo.linkedin")}
                                    type="url"
                                    placeholder="https://linkedin.com/in/your-profile"
                                    error={errors.contactInfo?.linkedin?.message}
                                />

                                {errors.contactInfo?.email && (
                                    <p className='text-sm tex-red-500'>
                                        {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Twitter/X Profile</label>
                                <Input
                                    {...register("contactInfo.twitter")}
                                    type="url"
                                    placeholder="https://x.com/your-handle"
                                    error={errors.contactInfo?.twitter?.message}
                                />

                                {errors.contactInfo?.email && (
                                    <p className='text-sm tex-red-500'>
                                        {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Professional Summary</h3>
                        <Controller
                            name='summary'
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className='h-32'
                                    placeholder='Write a compelling professional summary...'
                                    error={errors.summary?.message}
                                />
                            )}
                        />
                        {errors.summary && (
                            <p className='text-sm text-red-500'>{errors.summary.message}</p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Skills</h3>
                        <Controller
                            name='skills'
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className='h-32'
                                    placeholder='List your key skills...'
                                    error={errors.skills?.message}
                                />
                            )}
                        />
                        {errors.skills && (
                            <p className='text-sm text-red-500'>{errors.skills.message}</p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Work Experience</h3>
                        <Controller
                            name='experience'
                            control={control}
                            render={({ field }) => (
                                <EntryForm
                                    type="Experience"
                                    entries={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.experience && (
                            <p className='text-sm text-red-500'>{errors.experience.message}</p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Education</h3>
                        <Controller
                            name='education'
                            control={control}
                            render={({ field }) => (
                                <EntryForm
                                    type="Education"
                                    entries={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.education && (
                            <p className='text-sm text-red-500'>{errors.education.message}</p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Projects</h3>
                        <Controller
                            name="projects"
                            control={control}
                            render={({ field }) => (
                                <EntryForm
                                    type="Project"
                                    entries={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.projects && (
                        <p className='text-sm text-red-500'>{errors.projects.message}</p>
                        )}
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="preview">
                <Button variant="link" type='button' className='mb-2'
                        onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}>

                    {resumeMode === "preview" ? (
                        <>
                            <Edit className='h-4 w-4' />
                            Edit Resume
                        </>
                    ) : (
                        <>
                            <Monitor className='h-4 w-4' />
                            Show Preview
                        </>
                    )}
                </Button>

                {resumeMode !== "preview" &&  (
                    <div className='flex-3 p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2'>
                        <AlertTriangle className='h-5 w-5'/>
                        <span className='text-sm'>
                            You will lose the edited markdown if you update the form data
                        </span>
                    </div>
                )}

                <div className='rounded-lg border'>
                    <MDEditor value={previewContent} onChange={setPreviewContent} height={800} preview={resumeMode}/>
                </div>

                <div
                    id='resume-pdf'
                    style={{
                        backgroundColor: "#ffffff", // use safe hex
                        color: "#000000",
                        padding: "16px"
                    }}
                    >
                    <MDEditor.Markdown
                        source={previewContent}
                        style={{
                        backgroundColor: "#ffffff",
                        color: "#000000"
                        }}
                    />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ResumeBuilder