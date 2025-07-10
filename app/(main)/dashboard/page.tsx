// page.tsx
import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';
import DashboardView, { SalaryRange } from './_components/dashboard-view';

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  // Transform insights into your expected shape
  const formattedInsights = {
    id: insights.id,
    industry: insights.industry,
    salaryRanges: insights.salaryRanges as SalaryRange[],
    marketOutlook: insights.marketOutlook as string,
    demandLevel: insights.demandLevel as string,
    nextUpdate: insights.nextUpdate ?? new Date(),
    lastUpdated: insights.updatedAt,
    growthRate: insights.growthRate,
    topSkills: insights.topSkills,
    keyTrends: insights.keyTrends,
    recommendedSkills: insights.recommendedSkills,
  };

  return (
    <div className='container mx-auto'>
      <DashboardView insights={formattedInsights} />
    </div>
  );
};

export default IndustryInsightsPage;
