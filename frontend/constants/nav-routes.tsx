
import { SquareGanttChart, Settings, UserRoundPen, ArrowDownUp, Workflow, House } from 'lucide-react';

export const navRoutes = [
  {
    id: 1,
    href: "/",
    label: "Home",
    icon: <House className='h-full w-full'/>
  },
  {
    id: 2,
    href: "/workflow",
    label: "Workflow",
    icon: <Workflow className='h-full w-full'/>
  },
  {
    id: 3,
    href: "/execution-workflow",
    label: "Execution Workflow",
    icon: <UserRoundPen className='h-full w-full'/>
  },
  {
    id: 5,
    href: "/settings",
    label: "Settings",
    icon: <Settings className='h-full w-full'/>
  },
];



