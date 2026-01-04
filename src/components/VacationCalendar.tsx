import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vacation, LeaveType } from '@/types/vacation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VacationCalendarProps {
  vacations: Vacation[];
}

const leaveColors: Record<LeaveType, string> = {
  vacation: 'bg-leave-vacation',
  parental: 'bg-leave-parental',
  maternity: 'bg-leave-maternity',
  exams: 'bg-leave-exams',
};

const VacationCalendar = ({ vacations }: VacationCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getVacationsForDay = (day: Date) => {
    return vacations.filter((vacation) =>
      isWithinInterval(day, { start: vacation.startDate, end: vacation.endDate })
    );
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dayVacations = getVacationsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'min-h-[80px] p-1 rounded-md border transition-colors',
                      isCurrentMonth ? 'bg-background' : 'bg-muted/50',
                      isToday && 'ring-2 ring-primary',
                      dayVacations.length > 0 && 'cursor-pointer hover:bg-accent/50'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium mb-1',
                        !isCurrentMonth && 'text-muted-foreground',
                        isToday && 'text-primary'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5">
                      {dayVacations.slice(0, 3).map((vacation) => (
                        <div
                          key={vacation.id}
                          className={cn(
                            'text-xs px-1 py-0.5 rounded text-white truncate',
                            leaveColors[vacation.leaveType]
                          )}
                        >
                          {vacation.employeeName.split(' ')[0]}
                        </div>
                      ))}
                      {dayVacations.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayVacations.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                {dayVacations.length > 0 && (
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      {dayVacations.map((vacation) => (
                        <div key={vacation.id} className="text-sm">
                          <span className="font-medium">{vacation.employeeName}</span>
                          <span className="text-muted-foreground ml-1">
                            ({vacation.leaveType})
                          </span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-4 text-sm">
          {Object.entries(leaveColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded', color)} />
              <span className="capitalize">{type === 'parental' ? 'Parental Leave' : type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VacationCalendar;
