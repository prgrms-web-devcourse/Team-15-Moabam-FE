import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@suspensive/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouteData, useTheme } from '@/core/hooks';
import timeOption from '@/core/api/options/time';
import getTimeRange from '@/core/utils/getTimeRange';
import { Navbar } from '@/shared/Navbar';
import { UnknownFallback } from '@/shared/ErrorBoundary';
import { LoadingSpinner } from '@/shared/LoadingSpinner';
import { Deffered } from '@/shared/Deffered';
import useCheckAuthRequired from './useCheckAuthRequired';
import { AboutMoabam } from './AboutMoabam';
import { CommonMeta } from './Meta';
import 'swiper/css';
import 'swiper/css/bundle';

const App = () => {
  const { navBarRequired, path, pageName } = useRouteData();
  const { theme, setTheme } = useTheme();
  useCheckAuthRequired();

  const { data, isSuccess } = useQuery({
    ...timeOption,
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const today = data || new Date();
    setTheme(getTimeRange(today) === 'MORNING' ? 'light' : 'dark');
  }, [data, isSuccess, setTheme]);

  return (
    <>
      <CommonMeta pageName={pageName} />
      <div
        className={clsx('h-screen w-screen', {
          'dark min-[1024px]:bg-dark-main': theme === 'dark',
          'min-[1024px]:bg-light-main': theme !== 'dark'
        })}
      >
        <div className="app-container flex flex-col bg-light-main dark:bg-dark-main">
          <ErrorBoundary fallback={<UnknownFallback />}>
            <div className="h-full overflow-hidden bg-light-main text-black dark:bg-dark-main dark:text-white">
              <Suspense
                fallback={
                  <Deffered defferTime={500}>
                    <div className="flex h-full items-center justify-center">
                      <LoadingSpinner
                        colorStyle="text-light-point dark:text-dark-point"
                        size="7xl"
                      />
                    </div>
                  </Deffered>
                }
              >
                <Outlet />
              </Suspense>
            </div>

            {navBarRequired && <Navbar currentPath={`/${path}`} />}
          </ErrorBoundary>
        </div>
        <div className="app-info">
          <AboutMoabam theme={theme} />
        </div>
      </div>
    </>
  );
};

export default App;
