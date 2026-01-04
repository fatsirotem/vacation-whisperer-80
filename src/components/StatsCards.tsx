import { CalendarDays, Users, Clock, AlertCircle } from 'lucide-react';
import { Vacation } from '@/types/vacation';
import { isWithinInterval, addDays, startOfDay } from 'date-fns';

interface StatsCardsProps {
  vacations: Vacation[];
}

const StatsCards = ({ vacations }: StatsCardsProps) => {
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);
  const nextMonth = addDays(today, 30);

  const currentlyOnLeave = vacations.filter((v) =>
    isWithinInterval(today, { start: v.startDate, end: v.endDate })
  ).length;

  const upcomingThisWeek = vacations.filter((v) =>
    isWithinInterval(v.startDate, { start: today, end: nextWeek })
  ).length;

  const upcomingThisMonth = vacations.filter((v) =>
    isWithinInterval(v.startDate, { start: today, end: nextMonth })
  ).length;

  const stats = [
    {
      label: 'Currently on Leave',
      value: currentlyOnLeave,
      icon: Users,
      color: 'text-info bg-info/10',
    },
    {
      label: 'Upcoming (7 days)',
      value: upcomingThisWeek,
      icon: Clock,
      color: 'text-warning bg-warning/10',
    },
    {
      label: 'Upcoming (30 days)',
      value: upcomingThisMonth,
      icon: CalendarDays,
      color: 'text-success bg-success/10',
    },
    {
      label: 'Total Scheduled',
      value: vacations.length,
      icon: AlertCircle,
      color: 'text-primary bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-lg border shadow-sm p-4 animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
