import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Pencil } from 'lucide-react';
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
import { LeaveType, Vacation } from '@/types/vacation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EditVacationDialogProps {
  vacation: Vacation;
  onUpdate: (vacation: Vacation) => void;
}

const EditVacationDialog = ({ vacation, onUpdate }: EditVacationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(vacation.startDate);
  const [endDate, setEndDate] = useState<Date>(vacation.endDate);
  const [leaveType, setLeaveType] = useState<LeaveType>(vacation.leaveType);
  const [notes, setNotes] = useState(vacation.notes || '');
  const { toast } = useToast();

  useEffect(() => {
    setStartDate(vacation.startDate);
    setEndDate(vacation.endDate);
    setLeaveType(vacation.leaveType);
    setNotes(vacation.notes || '');
  }, [vacation]);

  const handleSubmit = () => {
    if (endDate < startDate) {
      toast({
        title: 'Invalid Dates',
        description: 'End date must be after start date.',
        variant: 'destructive',
      });
      return;
    }

    onUpdate({
      ...vacation,
      startDate,
      endDate,
      leaveType,
      notes: notes || undefined,
    });

    toast({
      title: 'Vacation Updated',
      description: `Leave updated for ${vacation.employeeName}`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Leave - {vacation.employeeName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
              <SelectTrigger id="leaveType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="parental">Parental Leave</SelectItem>
                <SelectItem value="maternity">Maternity</SelectItem>
                <SelectItem value="exams">Exams</SelectItem>
                <SelectItem value="rd">R&D</SelectItem>
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditVacationDialog;
