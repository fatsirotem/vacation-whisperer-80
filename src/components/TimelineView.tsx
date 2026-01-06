import { useState, useMemo } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { Vacation, Employee } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LeaveBadge from './LeaveBadge';

interface TimelineViewProps {
  vacations: Vacation[];
  employees: Employee[];
}

type TimeRange = 3 | 6 | 9 | 12;

const TimelineView = ({ vacations, employees }: TimelineViewProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(3);
  
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(addMonths(today, timeRange - 1));
  
  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < timeRange; i++) {
      result.push(addMonths(today, i));
    }
    return result;
  }, [timeRange, today]);

  const filteredVacations = vacations.filter(v => 
    isWithinInterval(v.startDate, { start: startDate, end: endDate }) ||
    isWithinInterval(v.endDate, { start: startDate, end: endDate }) ||
    (v.startDate <= startDate && v.endDate >= endDate)
  );

  return (
    <div className="space-y-4">
      {/* Time Range Filter */}
      <div className="flex gap-2">
        <Button 
          variant={timeRange === 3 ? "default" : "outline"}
          onClick={() => setTimeRange(3)}
        >
          3 Months
        </Button>
        <Button 
          variant={timeRange === 6 ? "default" : "outline"}
          onClick={() => setTimeRange(6)}
        >
          6 Months
        </Button>
        <Button 
          variant={timeRange === 9 ? "default" : "outline"}
          onClick={() => setTimeRange(9)}
        >
          9 Months
        </Button>
        <Button 
          variant={timeRange === 12 ? "default" : "outline"}
          onClick={() => setTimeRange(12)}
        >
          1 Year
        </Button>
      </div>

      {/* Timeline Grid */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Month Headers */}
          <div className="flex border-b pb-2">
            <div className="w-48 font-semibold">Employee</div>
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${timeRange}, 1fr)` }}>
              {months.map((month, idx) => (
                <div key={idx} className="text-center font-semibold text-sm">
                  {format(month, 'MMM yyyy')}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Rows */}
          {employees.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No employees found
            </div>
          ) : (
            employees.map((employee) => {
              const employeeVacations = filteredVacations.filter(v => v.employeeId === employee.id);
              
              return (
                <div key={employee.id} className="flex border-b pb-4">
                  <div className="w-48">
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.role}</div>
                  </div>
                  <div className="flex-1 relative" style={{ minHeight: '60px' }}>
                    {employeeVacations.map((vacation) => {
                      const vacStart = vacation.startDate < startDate ? startDate : vacation.startDate;
                      const vacEnd = vacation.endDate > endDate ? endDate : vacation.endDate;
                      
                      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                      const startOffset = ((vacStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                      const width = ((vacEnd.getTime() - vacStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                      
                      return (
                        <div
                          key={vacation.id}
                          className="absolute h-8 flex items-center px-2 rounded"
                          style={{
                            left: `${startOffset}%`,
                            width: `${width}%`,
                            top: '8px',
                          }}
                        >
                          <LeaveBadge type={vacation.leaveType} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredVacations.length} vacation{filteredVacations.length !== 1 ? 's' : ''} across {employees.length} employee{employees.length !== 1 ? 's' : ''} 
        {' '}from {format(startDate, 'MMM yyyy')} to {format(endDate, 'MMM yyyy')}
      </div>
    </div>
  );
};

export default TimelineView;
