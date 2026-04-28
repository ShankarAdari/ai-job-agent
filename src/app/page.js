'use client';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/Onboarding';
import AppShell from './components/AppShell';

function Inner() {
  const { state } = useApp();
  return state.onboarded ? <AppShell /> : <Onboarding />;
}

export default function Home() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
