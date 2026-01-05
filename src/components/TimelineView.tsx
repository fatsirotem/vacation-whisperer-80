import { useMemo } from 'react';
import { Vacation, Employee } from '@/types/vacation';

interface TimelineViewProps {
  vacations: Vacation[];
  employees: Employee[];
}

const TimelineView = ({ vacations, employees }: TimelineViewProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
      <p className="text-muted-foreground">
        Timeline View connected to {employees.length} team members.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Data is live from Supabase.
      </p>
    </div>
  );
};

export default TimelineView;
