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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: empData } = await supabase.from('employees').select('*').order('name');
      if (empData) setEmployees(empData);

      const { data: vacData } = await supabase.from('vacations').select('*');
      if (vacData) {
        const formatted = vacData.map(v => ({
          ...v,
          employeeId: v.employee_id,
          employeeName: v.employee_name,
          startDate: new Date(v.start_date),
          endDate: new Date(v.end_date),
          leaveType: v.leave_type
        }));
        setVacations(formatted);
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddVacation = async (vacation: Omit<Vacation, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('vacations').insert([{
      employee_id: vacation.employeeId,
      employee_name: vacation.employeeName,
      start_date: vacation.startDate.toISOString(),
      end_date: vacation.endDate.toISOString(),
      leave_type: vacation.leaveType,
      notes: vacation.notes
    }]);
    if (error) toast.error(error.message);
    else { toast.success("Saved!"); fetchData(); }
  };

  const filteredVacations = vacations.filter((v) => {
    if (selectedTeam === 'all') return true;
    const emp = employees.find((e) => e.id === v.employeeId);
    return emp?.scrumTeams.includes(selectedTeam) || emp?.scrumTeams.includes('All');
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading Cloud Data...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <AddVacationForm onAdd={handleAddVacation} employees={employees} />
        </div>
        <StatsCards vacations={vacations} />
        <TeamFilter selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="teams"><Users className="h-4 w-4" /> Teams</TabsTrigger>
            <TabsTrigger value="timeline"><GanttChart className="h-4 w-4" /> Timeline</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4" /> Calendar</TabsTrigger>
            <TabsTrigger value="list"><List className="h-4 w-4" /> List</TabsTrigger>
            <TabsTrigger value="employees"><Database className="h-4 w-4" /> Database</TabsTrigger>
          </TabsList>
          <TabsContent value="teams"><TeamOverview vacations={filteredVacations} employees={employees} /></TabsContent>
          <TabsContent value="timeline"><TimelineView vacations={filteredVacations} employees={employees} /></TabsContent>
          <TabsContent value="calendar"><VacationCalendar vacations={filteredVacations} /></TabsContent>
          <TabsContent value="list"><VacationList 
  vacations={filteredVacations} 
  employees={employees} // Add this line
  onDelete={handleDeleteVacation} 
  onUpdate={fetchData} 
/>
          <TabsContent value="list">
  <VacationList 
    vacations={filteredVacations} 
    employees={employees} 
    onDelete={handleDeleteVacation} 
    onUpdate={fetchData} 
  />
</TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
