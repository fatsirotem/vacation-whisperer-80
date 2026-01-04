import { Calendar, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-header text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Vacation Manager</h1>
              <p className="text-sm text-header-foreground/70">Team Leave Tracking System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-header-foreground/80">
            <Users className="h-4 w-4" />
            <span>Management Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
