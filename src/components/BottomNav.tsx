import { Compass, Map, Info } from 'lucide-react';

export type BottomTab = 'explore' | 'tour' | 'about';

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const TABS: { id: BottomTab; label: string; Icon: typeof Compass }[] = [
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'tour', label: 'Tour', Icon: Map },
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
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors
              min-h-[56px] ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'}`}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.5} />
            <span className="text-xs tracking-wide font-medium">{label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div className="h-safe-bottom" />
    </nav>
  );
}
