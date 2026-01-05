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
import { CalendarDays, List, GanttChart, Users, Database } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ScrumTeam | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. LOAD DATA FROM SUPABASE ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get Employees
      const { data: empData } = await supabase.from('employees').select('*').order('name');
      if (empData) setEmployees(empData);

      // Get Vacations
      const { data: vacData } = await supabase.from('vacations').select('*');
      if (vacData) {
        // We map database fields to our code's expected format (Dates must be converted from strings)
        const formattedVacations = vacData.map(v => ({
          ...v,
          employeeId: v.employee_id,
          employeeName: v.employee_name,
          startDate: new Date(v.start_date),
          endDate: new Date(v.end_date),
          leaveType: v.leave_type,
          createdAt: new Date(v.created_at)
        }));
        setVacations(formattedVacations);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to sync with cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. ADD VACATION TO SUPABASE ---
  const handleAddVacation = async (vacation: Omit<Vacation, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('vacations').insert([{
      employee_id: vacation.employeeId,
      employee_name: vacation.employeeName,
      start_date: vacation.startDate.toISOString(),
      end_date: vacation.endDate.toISOString(),
      leave_type: vacation.leaveType,
      notes: vacation.notes
    }]);

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Vacation saved to cloud!");
      fetchData(); // Refresh local state
    }
  };

  // --- 3. DELETE FROM SUPABASE ---
  const handleDeleteVacation = async (id: string) => {
    const { error } = await supabase.from('vacations').delete().eq('id', id);
    if (!error) {
      toast.success("Vacation removed");
      fetchData();
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-background text-muted-foreground animate-pulse">
      Connecting to Supabase...
    </div>
  );

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
            <p className="text-muted-foreground">Live Team Tracking</p>
          </div>
          <AddVacationForm onAdd={handleAddVacation} />
        </div>

        <StatsCards vacations={vacations} />
        <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />

        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="teams" className="gap-2"><Users className="h-4 w-4" />Teams</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2"><GanttChart className="h-4 w-4" />Timeline</TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2"><CalendarDays className="h-4 w-4" />Calendar</TabsTrigger>
            <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" />List</TabsTrigger>
            <TabsTrigger value="employees" className="gap-2"><Database className="h-4 w-4" />Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams"><TeamOverview vacations={filteredVacations} /></TabsContent>
          <TabsContent value="timeline"><TimelineView vacations={filteredVacations} /></TabsContent>
          <TabsContent value="calendar"><VacationCalendar vacations={filteredVacations} /></TabsContent>
          <TabsContent value="list">
            <VacationList vacations={filteredVacations} onDelete={handleDeleteVacation} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="employees">
            <EmployeeManagement 
              employees={employees} 
              onUpdateEmployee={fetchData} 
              onDeleteEmployee={fetchData} 
              onAddEmployee={fetchData} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
