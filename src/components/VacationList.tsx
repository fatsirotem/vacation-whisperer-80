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
import { Vacation, Employee } from '@/types/vacation';
import LeaveBadge from './LeaveBadge';
import EditVacationDialog from './EditVacationDialog';

interface VacationListProps {
  vacations: Vacation[];
  employees: Employee[]; // Add this prop
  onDelete: (id: string) => void;
  onUpdate: (vacation: Vacation) => void;
}

const VacationList = ({ vacations, employees, onDelete, onUpdate }: VacationListProps) => {
  const sortedVacations = [...vacations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  // We find employee details from the list passed down from the database
  const getEmployeeDetails = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId);
  };

  if (vacations.length === 0) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No vacations scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="text-header-foreground font-semibold">Employee</TableHead>
            <TableHead className="text-header-foreground font-semibold">Start Date</TableHead>
            <TableHead className="text-header-foreground font-semibold">End Date</TableHead>
            <TableHead className="text-header-foreground font-semibold">Type</TableHead>
            <TableHead className="text-header-foreground font-semibold w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVacations.map((vacation, index) => {
            const employee = getEmployeeDetails(vacation.employeeId);
            return (
              <TableRow key={vacation.id} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                <TableCell className="font-medium">
                  {vacation.employeeName}
                  {employee && <span className="text-xs text-muted-foreground ml-2">({employee.role})</span>}
                </TableCell>
                <TableCell>{format(vacation.startDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(vacation.endDate, 'MMM d, yyyy')}</TableCell>
                <TableCell><LeaveBadge type={vacation.leaveType} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(vacation.id)}
                      className="text-destructive"
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
