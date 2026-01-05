import { useMemo } from 'react';
import { Vacation, Employee } from '@/types/vacation';

interface TimelineViewProps {
  vacations: Vacation[];
  employees: Employee[];
}

const TimelineView = ({ vacations, employees }: TimelineViewProps) => {
  return (
    <div className="p-8 border rounded-lg bg-card text-center text-muted-foreground">
      Timeline connected to {employees.length} employees in cloud database.
    </div>
  );
};

export default TimelineView;
