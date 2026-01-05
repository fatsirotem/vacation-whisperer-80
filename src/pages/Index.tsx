import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
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
import { CalendarDays, List, GanttChart, Users, Database, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees || []);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ScrumTeam | 'all'>('all');

  // --- MIGRATION LOGIC ---
  const migrateData = async () => {
    const { error } = await supabase
      .from('employees')
      .upsert(initialEmployees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        scrum_teams: emp.scrumTeams
      })));

    if (error) {
      toast.error('Migration failed: ' + error.message);
    } else {
      toast.success('Success! Employees synced to Supabase.');
    }
  };

  // --- DATA LOADING ---
  useEffect(() => {
    // Load from localStorage as backup/initial state
    try {
      const saved = localStorage.getItem('vacations');
      if (saved) {
        setVacations(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load local vacations', e);
    }
  }, []);

  // --- CRUD HANDLERS ---
  const handleAddVacation = (vacation: Omit<Vacation, 'id' | 'createdAt'>) => {
    const newVacation: Vacation = {
      ...vacation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const updated = [...vacations, newVacation];
    setVacations(updated);
    localStorage.setItem('vacations', JSON.stringify(updated));
  };

  const handleDeleteVacation = (id: string) => {
    const updated = vacations.filter((v) => v.id !== id);
    setVacations(updated);
    localStorage.setItem('vacations', JSON.stringify(updated));
  };

  const handleUpdateVacation = (updatedVacation: Vacation) => {
    const updated = vacations.map((v) => (v.id === updatedVacation.id ? updatedVacation : v));
    setVacations(updated);
    localStorage.setItem('vacations', JSON.stringify(updated));
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e)));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setVacations((prev) => prev.filter((v) => v.employeeId !== id));
  };

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...employee, id: crypto.randomUUID() };
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Manage team vacations and leave</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={migrateData} className="gap-2">
               <CloudUpload className="h-4 w-4" /> Sync Employees
            </Button>
            <AddVacationForm onAdd={handleAddVacation} />
          </div>
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
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <GanttChart className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
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
