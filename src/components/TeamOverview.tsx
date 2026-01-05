import { useMemo } from 'react';
import { isWithinInterval, startOfDay, format } from 'date-fns';
import { Vacation, ScrumTeam, LeaveType, Employee } from '@/types/vacation';
import { cn } from '@/lib/utils';
import { User, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamOverviewProps {
  vacations: Vacation[];
  employees: Employee[];
}

const TeamOverview = ({ vacations, employees }: TeamOverviewProps) => {
  const today = startOfDay(new Date());
  const teams: ScrumTeam[] = ['LLU', 'PTB - GSNB', 'Port Cluster'];

  const teamData = useMemo(() => {
    return teams.map((team) => {
      const teamMembers = employees.filter(e => e.scrumTeams.includes(team) || e.scrumTeams.includes('All'));
      return {
        team,
        members: teamMembers,
        onLeaveCount: teamMembers.filter(m => vacations.some(v => v.employeeId === m.id && isWithinInterval(today, {start: v.startDate, end: v.endDate}))).length
      };
    });
  }, [vacations, employees]);

  return (
    <div className="space-y-6">
      {teamData.map((t) => (
        <div key={t.team} className="p-4 border rounded-lg bg-card shadow-sm">
          <h3 className="font-bold text-lg border-b pb-2 mb-4">{t.team}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {t.members.map(m => (
              <div key={m.id} className="p-2 border rounded text-center text-sm">
                {m.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamOverview;
