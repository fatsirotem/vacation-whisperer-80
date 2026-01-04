import { useState } from 'react';
import Header from '@/components/Header';
import AddVacationForm from '@/components/AddVacationForm';
import VacationCalendar from '@/components/VacationCalendar';
import VacationList from '@/components/VacationList';
import StatsCards from '@/components/StatsCards';
import TeamFilter from '@/components/TeamFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vacation, ScrumTeam } from '@/types/vacation';
import { employees } from '@/data/employees';
import { CalendarDays, List } from 'lucide-react';

const Index = () => {
  const [vacations, setVacations] = useState<Vacation[]>([
    // Sample data for demonstration
    {
      id: '1',
      employeeId: '2',
      employeeName: 'Omer Gohar',
      startDate: new Date(2026, 0, 6),
      endDate: new Date(2026, 0, 10),
      leaveType: 'vacation',
      createdAt: new Date(),
    },
    {
      id: '2',
      employeeId: '13',
      employeeName: 'Shay Dahan',
      startDate: new Date(2026, 0, 12),
      endDate: new Date(2026, 0, 16),
      leaveType: 'exams',
      notes: 'Final exams period',
      createdAt: new Date(),
    },
    {
      id: '3',
      employeeId: '5',
      employeeName: 'Matan Bahat',
      startDate: new Date(2026, 0, 20),
      endDate: new Date(2026, 2, 20),
      leaveType: 'parental',
      notes: 'Parental leave - 2 months',
      createdAt: new Date(),
    },
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

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="animate-fade-in">
            <VacationCalendar vacations={filteredVacations} />
          </TabsContent>
          
          <TabsContent value="list" className="animate-fade-in">
            <VacationList
              vacations={filteredVacations}
              onDelete={handleDeleteVacation}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
