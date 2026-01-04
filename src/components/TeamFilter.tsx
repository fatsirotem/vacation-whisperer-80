import { ScrumTeam } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TeamFilterProps {
  selectedTeam: ScrumTeam | 'all';
  onSelect: (team: ScrumTeam | 'all') => void;
}

const teams: (ScrumTeam | 'all')[] = ['all', 'LLU', 'PTB - GSNB', 'Port Cluster'];

const TeamFilter = ({ selectedTeam, onSelect }: TeamFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {teams.map((team) => (
        <Button
          key={team}
          variant={selectedTeam === team ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(team)}
          className={cn(
            'transition-all',
            selectedTeam === team && 'shadow-sm'
          )}
        >
          {team === 'all' ? 'All Teams' : team}
        </Button>
      ))}
    </div>
  );
};

export default TeamFilter;
