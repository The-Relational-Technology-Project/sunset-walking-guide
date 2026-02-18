export function About() {
  return (
    <div className="px-6 py-6 pb-12 space-y-8 max-w-prose">
      <div className="space-y-4">
        <h2 className="serif text-lg font-medium text-foreground">About this guide</h2>
        <p className="text-sm leading-relaxed text-foreground/80">The Outer Sunset Field Guide is a neighborhood exploration companion. This version including past, present, and future landmarks centered on the blocks around 48th Avenue and Irving Street in San Francisco's Outer Sunset.


        </p>
        <p className="text-sm leading-relaxed text-foreground/80">It was made by neighbors, for neighbors. The content comes from community members, local historians, and people who love this place.




        </p>
        <p className="text-sm leading-relaxed text-foreground/80">

        </p>
      </div>

      <div className="border-t border-border pt-6 space-y-3">
        <h3 className="serif text-sm font-medium text-foreground">The time layers</h3>
        <div className="space-y-2">
          {[
          { circles: '● ○ ○', label: 'Past', desc: 'Historical sites, old photo locations, historical podcasts.' },
          { circles: '○ ● ○', label: 'Present', desc: 'Open businesses, active groups, current gathering spaces.' },
          { circles: '○ ○ ●', label: 'Future', desc: 'Community dreams, planned projects, neighbor aspirations.' }].
          map((row) =>
          <div key={row.label} className="flex items-start gap-3">
              <span className="text-xs text-foreground/60 font-mono mt-0.5 flex-shrink-0 w-14">
                {row.circles}
              </span>
              <div>
                <span className="text-xs font-medium text-foreground">{row.label}</span>
                <span className="text-xs text-muted-foreground"> — {row.desc}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-2">
        <h3 className="serif text-sm font-medium text-foreground">Community credits</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">Illustrated thumbnails are placeholder sketches for the prototype. Our intent is to commission a local Outer Sunset artist to create the final illustrations. Historical research informed by the Western Neighborhoods Project and the San Francisco Public Library.




        </p>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-xs text-muted-foreground/60 leading-relaxed">This is an early prototype. Content may be incomplete or inaccurate. Location data is used only within your browser and is never stored or transmitted.



        </p>
      </div>
    </div>);

}