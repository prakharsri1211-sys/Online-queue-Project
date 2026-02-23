import { RouterProvider } from 'react-router';
import { router } from './routes';

import HealthTrackerCard from './components/HealthTrackerCard';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <HealthTrackerCard />
    </>
  );
}
