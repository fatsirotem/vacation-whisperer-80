import { useState } from 'react';
import Header from '@/components/Header';
import AddVacationForm from '@/components/AddVacationForm';
import VacationCalendar from '@/components/VacationCalendar';
import VacationList from '@/components/VacationList';
import TimelineView from '@/components/TimelineView';
import TeamOverview from '@/components/TeamOverview';
import EmployeeManagement from '@/components/EmployeeManagement';
import StatsCards from '@/components/StatsCards';
import TeamFilter from '@/components/TeamFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vacation, ScrumTeam, Employee } from '@/types/vacation';
import { employees as initialEmployees } from '@/data/employees';
import { CalendarDays, List, GanttChart, Users, Database } from 'lucide-react';

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [vacations, setVacations] = useState<Vacation[]>([
    // Sample data - you can edit or delete these in the List View
  ]);

  const [selectedTeam, setSelectedTeam] = useState<ScrumTeam | 'all'>('all');

  const handleAddVacation = (vacation: Omit<Vacation, 'id' | 'createdAt'>) => {
    const newVacation: Vacation = {
      ...vacation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setVacations((prev) => [...prev, newVacation]);
  };

  const handleDeleteVacation = (id: string) => {
    setVacations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVacation = (updatedVacation: Vacation) => {
    setVacations((prev) =>
      prev.map((v) => (v.id === updatedVacation.id ? updatedVacation : v))
    );
  };

  // Employee management handlers
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
    );
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    // Also remove vacations for this employee
    setVacations((prev) => prev.filter((v) => v.employeeId !== id));
  };

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: crypto.randomUUID(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const filteredVacations = vacations.filter((vacation) => {
    if (selectedTeam === 'all') return true;
    const employee = employees.find((e) => e.id === vacation.employeeId);
    return employee?.scrumTeams.includes(selectedTeam) || employee?.scrumTeams.includes('All');
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Manage team vacations and leave</p>
          </div>
          <AddVacationForm onAdd={handleAddVacation} />
        </div>

        <StatsCards vacations={vacations} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
        </div>

        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="teams" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team Overview</span>
              <span className="sm:hidden">Teams</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <GanttChart className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
              <span className="sm:hidden">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
              <span className="sm:hidden">DB</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="animate-fade-in">
            <TeamOverview vacations={filteredVacations} />
          </TabsContent>

          <TabsContent value="timeline" className="animate-fade-in">
            <TimelineView vacations={filteredVacations} />
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in">
            <VacationCalendar vacations={filteredVacations} />
          </TabsContent>
          
          <TabsContent value="list" className="animate-fade-in">
            <VacationList
              vacations={filteredVacations}
              onDelete={handleDeleteVacation}
              onUpdate={handleUpdateVacation}
            />
          </TabsContent>

          <TabsContent value="employees" className="animate-fade-in">
            <EmployeeManagement
              employees={employees}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onAddEmployee={handleAddEmployee}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
