import { useState, useMemo } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Vacation, Employee, ScrumTeam } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LeaveBadge from './LeaveBadge';

interface TimelineViewProps {
  vacations: Vacation[];
  employees: Employee[];
}

type TimeRange = 3 | 6 | 9 | 12;

const scrumTeams: ScrumTeam[] = ['LLU', 'PTB - GSNB', 'Port Cluster'];

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
  }, [timeRange]);

  // Filter vacations within the time range
  const filteredVacations = vacations.filter(v => 
    isWithinInterval(v.startDate, { start: startDate, end: endDate }) ||
    isWithinInterval(v.endDate, { start: startDate, end: endDate }) ||
    (v.startDate <= startDate && v.endDate >= endDate)
  );

  // Get employees who have vacations in this period, grouped by scrum team
  const teamData = useMemo(() => {
    return scrumTeams.map(team => {
      const teamEmployees = employees.filter(emp => 
        emp.scrumTeams.includes(team)
      );
      
      // Only include employees who have vacations in the selected period
      const employeesWithVacations = teamEmployees.filter(emp =>
        filteredVacations.some(v => v.employeeId === emp.id)
      );

      return {
        team,
        employees: employeesWithVacations,
        vacations: filteredVacations.filter(v => 
          employeesWithVacations.some(emp => emp.id === v.employeeId)
        )
      };
    }).filter(data => data.employees.length > 0); // Only show teams with vacations
  }, [filteredVacations, employees]);

  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  return (
    <div className="space-y-6">
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

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold mr-2">Legend:</span>
          <div className="flex items-center gap-2">
            <LeaveBadge type="vacation" />
            <span className="text-sm">Vacation</span>
          </div>
          <div className="flex items-center gap-2">
            <LeaveBadge type="parental" />
            <span className="text-sm">Parental Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <LeaveBadge type="maternity" />
            <span className="text-sm">Maternity Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <LeaveBadge type="exams" />
            <span className="text-sm">Exams</span>
          </div>
          <div className="flex items-center gap-2">
            <LeaveBadge type="rd" />
            <span className="text-sm">R&D Days</span>
          </div>
        </div>
      </Card>

      {/* Timeline by Scrum Team */}
      {teamData.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No vacations scheduled in the selected time period
          </p>
        </Card>
      ) : (
        teamData.map(({ team, employees: teamEmployees, vacations: teamVacations }) => (
          <Card key={team} className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">{team}</h3>
            
            <div className="space-y-4">
              {/* Month Headers */}
              <div className="flex border-b pb-2">
                <div className="w-48 font-semibold text-sm">Employee</div>
                <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${timeRange}, 1fr)` }}>
                  {months.map((month, idx) => (
                    <div key={idx} className="text-center font-semibold text-sm">
                      {format(month, 'MMM yyyy')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Rows */}
              {teamEmployees.map((employee) => {
                const employeeVacations = teamVacations.filter(v => v.employeeId === employee.id);
                
                return (
                  <div key={employee.id} className="flex items-center border-b last:border-0 pb-3 last:pb-0">
                    <div className="w-48">
                      <div className="font-medium text-sm">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.role}</div>
                    </div>
                    <div className="flex-1 relative" style={{ minHeight: '40px' }}>
                      {employeeVacations.map((vacation, idx) => {
                        const vacStart = vacation.startDate < startDate ? startDate : vacation.startDate;
                        const vacEnd = vacation.endDate > endDate ? endDate : vacation.endDate;
                        
                        const startOffset = ((vacStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                        const width = ((vacEnd.getTime() - vacStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                        
                        return (
                          <div
                            key={vacation.id}
                            className="absolute h-7 flex items-center px-2 rounded shadow-sm"
                            style={{
                              left: `${startOffset}%`,
                              width: `${Math.max(width, 2)}%`,
                              top: `${idx * 32}px`,
                            }}
                            title={`${employee.name}: ${format(vacation.startDate, 'MMM d')} - ${format(vacation.endDate, 'MMM d')} ${vacation.notes ? `(${vacation.notes})` : ''}`}
                          >
                            <LeaveBadge type={vacation.leaveType} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {teamEmployees.length} employee{teamEmployees.length !== 1 ? 's' : ''} on leave
            </div>
          </Card>
        ))
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        Period: {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')} 
        {' • '}
        {filteredVacations.length} total vacation{filteredVacations.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TimelineView;
