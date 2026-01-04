import { useMemo } from 'react';
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addMonths } from 'date-fns';
import { Vacation, LeaveType } from '@/types/vacation';
import { employees } from '@/data/employees';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimelineViewProps {
  vacations: Vacation[];
}

const leaveColors: Record<LeaveType, string> = {
  vacation: 'bg-leave-vacation',
  parental: 'bg-leave-parental',
  maternity: 'bg-leave-maternity',
  exams: 'bg-leave-exams',
  rd: 'bg-leave-rd',
};

const TimelineView = ({ vacations }: TimelineViewProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(addMonths(today, 2)); // Show 3 months
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const totalDays = days.length;

  // Group vacations by employee
  const employeeVacations = useMemo(() => {
    const grouped = new Map<string, Vacation[]>();
    vacations.forEach((vacation) => {
      const existing = grouped.get(vacation.employeeId) || [];
      grouped.set(vacation.employeeId, [...existing, vacation]);
    });
    return grouped;
  }, [vacations]);

  // Get unique employees who have vacations
  const employeesWithVacations = useMemo(() => {
    return Array.from(employeeVacations.keys()).map((id) => 
      employees.find((e) => e.id === id)
    ).filter(Boolean);
  }, [employeeVacations]);

  const getVacationStyle = (vacation: Vacation) => {
    const startOffset = Math.max(0, differenceInDays(vacation.startDate, monthStart));
    const endOffset = Math.min(totalDays - 1, differenceInDays(vacation.endDate, monthStart));
    const width = ((endOffset - startOffset + 1) / totalDays) * 100;
    const left = (startOffset / totalDays) * 100;
    return { width: `${width}%`, left: `${left}%` };
  };

  // Generate month labels
  const months = useMemo(() => {
    const result: { name: string; width: number; start: number }[] = [];
    let currentMonth = monthStart;
    let dayIndex = 0;

    while (currentMonth <= monthEnd) {
      const monthDays = eachDayOfInterval({
        start: currentMonth > monthStart ? currentMonth : monthStart,
        end: endOfMonth(currentMonth) < monthEnd ? endOfMonth(currentMonth) : monthEnd,
      });
      result.push({
        name: format(currentMonth, 'MMMM yyyy'),
        width: (monthDays.length / totalDays) * 100,
        start: (dayIndex / totalDays) * 100,
      });
      dayIndex += monthDays.length;
      currentMonth = addMonths(startOfMonth(currentMonth), 1);
    }
    return result;
  }, [monthStart, monthEnd, totalDays]);

  if (employeesWithVacations.length === 0) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No vacations to display in timeline.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Timeline View</h3>
        <p className="text-sm text-muted-foreground">Next 3 months overview</p>
      </div>

      {/* Month headers */}
      <div className="relative h-8 bg-table-header flex">
        {months.map((month) => (
          <div
            key={month.name}
            className="text-xs text-header-foreground font-medium flex items-center justify-center border-r border-header/30"
            style={{ width: `${month.width}%` }}
          >
            {month.name}
          </div>
        ))}
      </div>

      {/* Timeline rows */}
      <div className="divide-y">
        {employeesWithVacations.map((employee) => {
          if (!employee) return null;
          const empVacations = employeeVacations.get(employee.id) || [];
          
          return (
            <div key={employee.id} className="flex items-center">
              <div className="w-40 flex-shrink-0 p-3 border-r bg-muted/30">
                <p className="font-medium text-sm truncate">{employee.name}</p>
                <p className="text-xs text-muted-foreground">{employee.role}</p>
              </div>
              <div className="flex-1 relative h-14 bg-background">
                {/* Today indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                  style={{ left: `${(differenceInDays(today, monthStart) / totalDays) * 100}%` }}
                />
                
                {empVacations.map((vacation) => {
                  const style = getVacationStyle(vacation);
                  return (
                    <Tooltip key={vacation.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'absolute top-2 bottom-2 rounded-md cursor-pointer transition-opacity hover:opacity-80',
                            leaveColors[vacation.leaveType]
                          )}
                          style={style}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-medium capitalize">{vacation.leaveType === 'rd' ? 'R&D' : vacation.leaveType}</p>
                          <p className="text-muted-foreground">
                            {format(vacation.startDate, 'MMM d')} - {format(vacation.endDate, 'MMM d, yyyy')}
                          </p>
                          {vacation.notes && (
                            <p className="text-muted-foreground mt-1">{vacation.notes}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex flex-wrap gap-4 text-sm">
          {Object.entries(leaveColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded', color)} />
              <span className="capitalize">{type === 'parental' ? 'Parental Leave' : type === 'rd' ? 'R&D' : type}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <div className="w-0.5 h-3 bg-destructive" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
