export type LeaveType = 'vacation' | 'parental' | 'maternity' | 'exams' | 'rd';

export type Role = 'DV' | 'RTL' | 'Manager - DV' | 'Manager - RTL' | 'Manager';

export type ScrumTeam = 'LLU' | 'PTB - GSNB' | 'Port Cluster' | 'All';

export interface Employee {
  id: string;
  name: string;
  role: Role;
  scrumTeams: ScrumTeam[];
  project?: string;
}

export interface Vacation {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  notes?: string;
  createdAt: Date;
}
