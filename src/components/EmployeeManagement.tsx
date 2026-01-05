import { useState } from 'react';
import { Employee, Role, ScrumTeam } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeManagementProps {
  employees: Employee[];
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

const roles: Role[] = ['DV', 'RTL', 'Manager - DV', 'Manager - RTL', 'Manager'];
const scrumTeamOptions: ScrumTeam[] = ['LLU', 'PTB - GSNB', 'Port Cluster', 'All'];

const EmployeeManagement = ({
  employees,
  onUpdateEmployee,
  onDeleteEmployee,
  onAddEmployee,
}: EmployeeManagementProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Role>('DV');
  const [newTeams, setNewTeams] = useState<ScrumTeam[]>([]);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Role>('DV');
  const [editTeams, setEditTeams] = useState<ScrumTeam[]>([]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.scrumTeams.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditName(employee.name);
    setEditRole(employee.role);
    setEditTeams([...employee.scrumTeams]);
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingEmployee) return;
    if (!editName.trim()) {
      toast.error('Name is required');
      return;
    }
    if (editTeams.length === 0) {
      toast.error('At least one scrum team is required');
      return;
    }
    onUpdateEmployee({
      ...editingEmployee,
      name: editName.trim(),
      role: editRole,
      scrumTeams: editTeams,
    });
    setIsEditOpen(false);
    setEditingEmployee(null);
    toast.success('Employee updated successfully');
  };

  const handleAddSave = () => {
    if (!newName.trim()) {
      toast.error('Name is required');
      return;
    }
    if (newTeams.length === 0) {
      toast.error('At least one scrum team is required');
      return;
    }
    onAddEmployee({
      name: newName.trim(),
      role: newRole,
      scrumTeams: newTeams,
    });
    setIsAddOpen(false);
    setNewName('');
    setNewRole('DV');
    setNewTeams([]);
    toast.success('Employee added successfully');
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDeleteEmployee(employee.id);
      toast.success('Employee deleted');
    }
  };

  const toggleTeam = (team: ScrumTeam, teams: ScrumTeam[], setTeams: (teams: ScrumTeam[]) => void) => {
    if (teams.includes(team)) {
      setTeams(teams.filter((t) => t !== team));
    } else {
      setTeams([...teams, team]);
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold">Employee Database</h3>
          <p className="text-sm text-muted-foreground">{employees.length} employees</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Employee</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name">Name</Label>
                  <Input
                    id="add-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter employee name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scrum Teams</Label>
                  <div className="flex flex-wrap gap-3">
                    {scrumTeamOptions.map((team) => (
                      <div key={team} className="flex items-center gap-2">
                        <Checkbox
                          id={`add-${team}`}
                          checked={newTeams.includes(team)}
                          onCheckedChange={() => toggleTeam(team, newTeams, setNewTeams)}
                        />
                        <Label htmlFor={`add-${team}`} className="text-sm font-normal cursor-pointer">
                          {team}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSave}>Add Employee</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="text-header-foreground">Name</TableHead>
              <TableHead className="text-header-foreground">Role</TableHead>
              <TableHead className="text-header-foreground">Scrum Teams</TableHead>
              <TableHead className="text-header-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.scrumTeams.map((team) => (
                      <Badge key={team} variant="secondary" className="text-xs">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(employee)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scrum Teams</Label>
              <div className="flex flex-wrap gap-3">
                {scrumTeamOptions.map((team) => (
                  <div key={team} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-${team}`}
                      checked={editTeams.includes(team)}
                      onCheckedChange={() => toggleTeam(team, editTeams, setEditTeams)}
                    />
                    <Label htmlFor={`edit-${team}`} className="text-sm font-normal cursor-pointer">
                      {team}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
