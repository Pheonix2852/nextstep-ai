/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


import HeroSection from "@/components/ui/hero";
import { features } from "../data/features"
import { howItWorks } from "../data/howItWorks"
import { testimonial } from "../data/testimonial"
import { faqs } from "../data/faqs"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>

      <div className="grid-background"></div>
  
      <HeroSection />
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Powerful features for your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) =>{
              return (
                  <Card key={index} className="border-2 hover:border-primary transition-colors duration-300">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="flex flex-col items-center justify-center">
                        {feature.icon}
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>

          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Four Simple Steps to Accelerate your Career Growth</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) =>{
              return (
                  <div key={index} className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">{item.icon}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) =>{
              return (
                  <Card key={index} className="bg-background">
                    <CardContent className="pt-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-12 w-12 shrink-0">
                            <Image 
                              src={testimonial.image}
                              alt={testimonial.author}
                              width={40}
                              height={40}
                              unoptimized 
                              className="rounded-full object-cover border-2 border-primary/20"
                              />
                          </div>
                          <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            <p className="text-sm text-primary">{testimonial.company}</p>
                          </div>
                        </div>
                        <blockquote>
                          <p className="text-muted-foreground italic relative">
                            <span className="text-3xl text-primary absolute -top-4 -left-2">
                              &quot;
                            </span>
                              {testimonial.quote}
                            <span className="text-3xl text-primary absolute -bottom-4">
                              &quot;
                            </span>
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Find Answers to Common Questions about our platform</p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) =>{
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto ">
          <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
            Ready to Accelerste your Career?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
            Take the Next Step in Your Career.
            <br />
            <span className="font-bold">Build smarter resumes, write impactful cover letters, and ace your interviews — all with AI.</span>
          </p>

          <Link href={"/dashboard"}>
              <Button
                size={"lg"}
                variant="secondary"
                className="h-11 mt-5 animate-bounce"
                >
                  Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />  
              </Button>
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
