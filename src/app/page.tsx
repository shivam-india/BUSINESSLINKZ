'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { BusinessPortal } from '@/components/dashboard/BusinessPortal';
import { CustomerPortal } from '@/components/customer/CustomerPortal';

export default function HomePage() {
  const { appMode } = useBizLink();

  switch (appMode) {
    case 'landing':
      return <LandingPage />;
    case 'business_owner':
      return <BusinessPortal />;
    case 'customer':
      return <CustomerPortal />;
    default:
      return <LandingPage />;
  }
}
