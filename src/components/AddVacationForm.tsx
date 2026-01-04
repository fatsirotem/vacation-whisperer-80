import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { employees } from '@/data/employees';
import { LeaveType, Vacation } from '@/types/vacation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddVacationFormProps {
  onAdd: (vacation: Omit<Vacation, 'id' | 'createdAt'>) => void;
}

const AddVacationForm = ({ onAdd }: AddVacationFormProps) => {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<LeaveType>('vacation');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const selectedEmployee = employees.find(e => e.id === employeeId);

  const handleSubmit = () => {
    if (!employeeId || !startDate || !endDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: 'Invalid Dates',
        description: 'End date must be after start date.',
        variant: 'destructive',
      });
      return;
    }

    onAdd({
      employeeId,
      employeeName: selectedEmployee?.name || '',
      startDate,
      endDate,
      leaveType,
      notes: notes || undefined,
    });

    toast({
      title: 'Vacation Added',
      description: `Leave scheduled for ${selectedEmployee?.name}`,
    });

    // Reset form
    setEmployeeId('');
    setStartDate(undefined);
    setEndDate(undefined);
    setLeaveType('vacation');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vacation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Employee Leave</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="leaveType">Leave Type *</Label>
            <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
              <SelectTrigger id="leaveType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="parental">Parental Leave</SelectItem>
                <SelectItem value="maternity">Maternity</SelectItem>
                <SelectItem value="exams">Exams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVacationForm;
