import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function About() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length > 1000) {
      setErrorMsg('Message must be under 1,000 characters.');
      return;
    }

    setFormState('submitting');
    const { error } = await supabase.from('tour_requests').insert({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    if (error) {
      setFormState('error');
      setErrorMsg('Something went wrong. Please try again.');
    } else {
      setFormState('success');
    }
  };

  return (
    <div className="px-6 py-6 pb-12 space-y-8 max-w-prose">
      <div className="space-y-4">
        <h2 className="serif text-lg font-medium text-foreground">About this guide</h2>
        <p className="text-sm leading-relaxed text-foreground/80">The Outer Sunset Field Guide is a neighborhood exploration companion. This version including past, present, and future landmarks centered on the blocks around 48th Avenue and Irving Street in San Francisco's Outer Sunset.</p>
        <p className="text-sm leading-relaxed text-foreground/80">It was made by neighbors, for neighbors. The content comes from community members, local historians, and people who love this place.</p>
      </div>

      <div className="border-t border-border pt-6 space-y-3">
        <h3 className="serif text-sm font-medium text-foreground">The time layers</h3>
        <div className="space-y-2">
          {[
            { circles: '● ○ ○', label: 'Past', desc: 'Historical sites, old photo locations, historical podcasts.' },
            { circles: '○ ● ○', label: 'Present', desc: 'Local businesses, art, and gathering spaces.' },
            { circles: '○ ○ ●', label: 'Future', desc: 'Community dreams, planned projects, neighbor aspirations.' },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-xs text-foreground/60 font-mono mt-0.5 flex-shrink-0 w-14">{row.circles}</span>
              <div>
                <span className="text-xs font-medium text-foreground">{row.label}</span>
                <span className="text-xs text-muted-foreground"> — {row.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-2">
        <h3 className="serif text-sm font-medium text-foreground">Community credits</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Illustrated thumbnails are placeholder sketches for the prototype. Our intent is to commission a local Outer Sunset artist to create the final illustrations. Historical research informed by the Western Neighborhoods Project and the San Francisco Public Library.
        </p>
      </div>

      {/* Tour request form */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="serif text-sm font-medium text-foreground">Request a neighborhood tour</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Want to explore the Outer Sunset with a neighbor who knows the stories? Drop us a note.
        </p>

        {formState === 'success' ? (
          <div className="py-6 text-center space-y-1">
            <p className="serif text-sm text-foreground">Thanks for reaching out!</p>
            <p className="text-xs text-muted-foreground">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <textarea
              placeholder="Group size, preferred dates, what you're curious about..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
              rows={3}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
            {errorMsg && (
              <p className="text-xs text-destructive">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors py-2 disabled:opacity-40"
            >
              {formState === 'submitting' ? 'Sending…' : 'Send request →'}
            </button>
          </form>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          This is an early prototype. Content may be incomplete or inaccurate. Location data is used only within your browser and is never stored or transmitted.
        </p>
      </div>
    </div>
  );
}
