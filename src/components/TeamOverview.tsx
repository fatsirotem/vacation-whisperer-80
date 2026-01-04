import { useMemo } from 'react';
import { isWithinInterval, startOfDay, addDays, format } from 'date-fns';
import { Vacation, ScrumTeam, LeaveType } from '@/types/vacation';
import { employees } from '@/data/employees';
import { cn } from '@/lib/utils';
import { User, Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TeamOverviewProps {
  vacations: Vacation[];
}

const leaveColors: Record<LeaveType, string> = {
  vacation: 'bg-leave-vacation',
  parental: 'bg-leave-parental',
  maternity: 'bg-leave-maternity',
  exams: 'bg-leave-exams',
  rd: 'bg-leave-rd',
};

const leaveBorderColors: Record<LeaveType, string> = {
  vacation: 'border-leave-vacation',
  parental: 'border-leave-parental',
  maternity: 'border-leave-maternity',
  exams: 'border-leave-exams',
  rd: 'border-leave-rd',
};

const TeamOverview = ({ vacations }: TeamOverviewProps) => {
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);

  const teams: ScrumTeam[] = ['LLU', 'PTB - GSNB', 'Port Cluster'];

  const getEmployeeStatus = (employeeId: string) => {
    const onLeaveNow = vacations.find((v) =>
      v.employeeId === employeeId &&
      isWithinInterval(today, { start: v.startDate, end: v.endDate })
    );
    
    const upcomingLeave = vacations.find((v) =>
      v.employeeId === employeeId &&
      v.startDate > today &&
      isWithinInterval(v.startDate, { start: today, end: nextWeek })
    );

    return { onLeaveNow, upcomingLeave };
  };

  const teamData = useMemo(() => {
    return teams.map((team) => {
      const teamMembers = employees.filter(
        (e) => e.scrumTeams.includes(team) || e.scrumTeams.includes('All')
      );
      const membersWithStatus = teamMembers.map((member) => ({
        ...member,
        ...getEmployeeStatus(member.id),
      }));
      const onLeaveCount = membersWithStatus.filter((m) => m.onLeaveNow).length;
      const availableCount = membersWithStatus.length - onLeaveCount;

      return {
        team,
        members: membersWithStatus,
        onLeaveCount,
        availableCount,
        totalCount: membersWithStatus.length,
      };
    });
  }, [vacations]);

  return (
    <div className="space-y-6">
      {teamData.map(({ team, members, onLeaveCount, availableCount, totalCount }) => (
        <div key={team} className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="bg-table-header p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-header-foreground">{team}</h3>
              <p className="text-sm text-header-foreground/70">
                {availableCount} available / {totalCount} total
              </p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/20 text-success rounded text-sm">
                <User className="h-3 w-3" />
                {availableCount} here
              </span>
              {onLeaveCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/20 text-destructive rounded text-sm">
                  <Calendar className="h-3 w-3" />
                  {onLeaveCount} away
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {members.map((member) => (
                <Tooltip key={member.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all cursor-pointer',
                        member.onLeaveNow
                          ? cn('bg-muted/50 opacity-60', leaveBorderColors[member.onLeaveNow.leaveType])
                          : member.upcomingLeave
                          ? 'border-warning/50 bg-warning/5'
                          : 'border-border hover:border-primary/30 hover:bg-accent/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            member.onLeaveNow
                              ? leaveColors[member.onLeaveNow.leaveType]
                              : 'bg-success'
                          )}
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {member.role}
                        </span>
                      </div>
                      <p className="font-medium text-sm truncate">{member.name}</p>
                      {member.onLeaveNow && (
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {member.onLeaveNow.leaveType === 'rd' ? 'R&D' : member.onLeaveNow.leaveType}
                        </p>
                      )}
                      {!member.onLeaveNow && member.upcomingLeave && (
                        <p className="text-xs text-warning mt-1">
                          Leave starts {format(member.upcomingLeave.startDate, 'MMM d')}
                        </p>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="text-sm">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground">{member.role}</p>
                      <p className="text-muted-foreground">Teams: {member.scrumTeams.join(', ')}</p>
                      {member.onLeaveNow && (
                        <p className="text-muted-foreground mt-1">
                          On {member.onLeaveNow.leaveType === 'rd' ? 'R&D' : member.onLeaveNow.leaveType} until{' '}
                          {format(member.onLeaveNow.endDate, 'MMM d')}
                        </p>
                      )}
                      {!member.onLeaveNow && member.upcomingLeave && (
                        <p className="text-warning mt-1">
                          {member.upcomingLeave.leaveType === 'rd' ? 'R&D' : member.upcomingLeave.leaveType} starts{' '}
                          {format(member.upcomingLeave.startDate, 'MMM d')}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="font-medium">Status:</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Available</span>
        </div>
        {Object.entries(leaveColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', color)} />
            <span className="capitalize">{type === 'parental' ? 'Parental' : type === 'rd' ? 'R&D' : type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOverview;
