import { useEffect, useState } from 'react';

interface WelcomeOverlayProps {
  onDismiss: () => void;
}

export function WelcomeOverlay({ onDismiss }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow CSS animation on mount
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-8 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ maxWidth: 430, margin: '0 auto' }}
    >
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="serif text-3xl font-medium text-foreground tracking-tight leading-tight">
            Outer Sunset<br />Field Guide
          </h1>
          <div className="w-8 h-px bg-muted-foreground/30 mx-auto" />
        </div>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/75">
            A walking companion for the neighborhood around 48th and Irving. Swipe
            through nearby places, learn their stories, and explore at your own pace.
          </p>
          <p className="text-sm leading-relaxed text-foreground/60">
            Your walk starts wherever you are.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="inline-block text-sm text-foreground border border-foreground/30 px-6 py-2.5 rounded-sm hover:bg-foreground/5 transition-colors tracking-wide"
        >
          Start exploring
        </button>
      </div>

      {/* Footer note */}
      <p className="absolute bottom-8 text-xs text-muted-foreground/50 text-center px-8">
        Location is used only to sort nearby places. It is never stored or shared.
      </p>
    </div>
  );
}
