import { Map, List, Info } from 'lucide-react';

export type BottomTab = 'explore' | 'map' | 'stops' | 'about';

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const TABS: { id: BottomTab; label: string; Icon: typeof Map }[] = [
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'stops', label: 'All stops', Icon: List },
  { id: 'about', label: 'About', Icon: Info },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border"
      style={{ maxWidth: 430, margin: '0 auto' }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ id, label, Icon }) => {
          const isActive =
            activeTab === id || (id === 'map' && activeTab === 'explore');
          // We won't highlight "map" when in explore, because explore uses a full swipe UI
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors
                ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'}`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div className="h-safe-bottom" />
    </nav>
  );
}
