import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LeaveType, Vacation, Employee } from '@/types/vacation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddVacationFormProps {
  onAdd: (vacation: Omit<Vacation, 'id' | 'createdAt'>) => void;
  employees: Employee[];
}

const AddVacationForm = ({ onAdd, employees }: AddVacationFormProps) => {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<LeaveType>('vacation');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const selectedEmployee = employees.find(e => e.id === employeeId);

  const handleSubmit = () => {
    if (!employeeId || !startDate || !endDate) return;
    onAdd({
      employeeId,
      employeeName: selectedEmployee?.name || '',
      startDate,
      endDate,
      leaveType,
      notes: notes || undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Vacation</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Leave</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Employee</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>
              {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Leave</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVacationForm;
