import { LeaveType } from '@/types/vacation';
import { cn } from '@/lib/utils';

interface LeaveBadgeProps {
  type: LeaveType;
  className?: string;
}

const leaveTypeConfig: Record<LeaveType, { label: string; className: string }> = {
  vacation: { 
    label: 'Vacation', 
    className: 'bg-leave-vacation text-white' 
  },
  parental: { 
    label: 'Parental Leave', 
    className: 'bg-leave-parental text-white' 
  },
  maternity: { 
    label: 'Maternity', 
    className: 'bg-leave-maternity text-white' 
  },
  exams: { 
    label: 'Exams', 
    className: 'bg-leave-exams text-white' 
  },
};

const LeaveBadge = ({ type, className }: LeaveBadgeProps) => {
  const config = leaveTypeConfig[type];
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default LeaveBadge;
