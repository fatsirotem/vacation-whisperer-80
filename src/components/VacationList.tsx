import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Vacation } from '@/types/vacation';
import LeaveBadge from './LeaveBadge';
import EditVacationDialog from './EditVacationDialog';
import { employees } from '@/data/employees';

interface VacationListProps {
  vacations: Vacation[];
  onDelete: (id: string) => void;
  onUpdate: (vacation: Vacation) => void;
}

const VacationList = ({ vacations, onDelete, onUpdate }: VacationListProps) => {
  const sortedVacations = [...vacations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  const getEmployeeDetails = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId);
  };

  if (vacations.length === 0) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No vacations scheduled yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Use the "Add Vacation" button to schedule employee leave.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="text-header-foreground font-semibold">Employee</TableHead>
            <TableHead className="text-header-foreground font-semibold">Team(s)</TableHead>
            <TableHead className="text-header-foreground font-semibold">Start Date</TableHead>
            <TableHead className="text-header-foreground font-semibold">End Date</TableHead>
            <TableHead className="text-header-foreground font-semibold">Type</TableHead>
            <TableHead className="text-header-foreground font-semibold">Notes</TableHead>
            <TableHead className="text-header-foreground font-semibold w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVacations.map((vacation, index) => {
            const employee = getEmployeeDetails(vacation.employeeId);
            return (
              <TableRow
                key={vacation.id}
                className={index % 2 === 1 ? 'bg-table-row-alt' : ''}
              >
                <TableCell className="font-medium">
                  <div>
                    <span>{vacation.employeeName}</span>
                    {employee && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({employee.role})
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee?.scrumTeams.map((team) => (
                      <span
                        key={team}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{format(vacation.startDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(vacation.endDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <LeaveBadge type={vacation.leaveType} />
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {vacation.notes || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EditVacationDialog vacation={vacation} onUpdate={onUpdate} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(vacation.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VacationList;
