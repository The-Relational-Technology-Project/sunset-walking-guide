import { useEffect, useState, useCallback } from 'react';
import { PLACES, DEFAULT_CENTER, FIELD_GUIDE_RADIUS_KM, Place } from '@/data/places';
import { distanceKm } from '@/utils/geo';
import { WelcomeOverlay } from '@/components/WelcomeOverlay';
import { Header } from '@/components/Header';
import { PlacePanel } from '@/components/PlacePanel';
import { PlaceDetail } from '@/components/PlaceDetail';
import { TourList, Tour } from '@/components/TourList';
import { MapView } from '@/components/MapView';
import { AllStops } from '@/components/AllStops';
import { About } from '@/components/About';
import { BottomNav, BottomTab } from '@/components/BottomNav';

const FIRST_VISIT_KEY = 'osfg_visited';
const LOCATION_HINT_KEY = 'osfg_loc_hint_shown';

export default function Index() {
  // First-visit welcome
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem(FIRST_VISIT_KEY);
  });
  const [isFirstVisit] = useState(() => !localStorage.getItem(FIRST_VISIT_KEY));

  // User location
  const [userLat, setUserLat] = useState(DEFAULT_CENTER.lat);
  const [userLng, setUserLng] = useState(DEFAULT_CENTER.lng);
  const [locationDenied, setLocationDenied] = useState(false);

  // Mode / navigation state
  const [mode, setMode] = useState<'explore' | 'tour'>('explore');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [activePlaces, setActivePlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [bottomTab, setBottomTab] = useState<BottomTab>('explore');

  // Build sorted explore places
  const getExplorePlaces = useCallback(() => {
    return [...PLACES].sort(
      (a, b) =>
        distanceKm(userLat, userLng, a.lat, a.lng) -
        distanceKm(userLat, userLng, b.lat, b.lng)
    );
  }, [userLat, userLng]);

  // Check if user is in range
  const inRange = useCallback(() => {
    return PLACES.some(
      (p) => distanceKm(userLat, userLng, p.lat, p.lng) <= FIELD_GUIDE_RADIUS_KM * 2
    );
  }, [userLat, userLng]);

  // Initialize places
  useEffect(() => {
    if (mode === 'explore' && !activeTour) {
      setActivePlaces(getExplorePlaces());
      setCurrentIndex(0);
    }
  }, [mode, activeTour, getExplorePlaces]);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;

    const handleSuccess = (pos: GeolocationPosition) => {
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
      setLocationDenied(false);
    };

    const handleError = () => {
      setLocationDenied(true);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 8000,
    });

    // Periodic refresh
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 30000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update explore sort when location changes
  useEffect(() => {
    if (mode === 'explore' && !activeTour) {
      const sorted = getExplorePlaces();
      setActivePlaces(sorted);
    }
  }, [userLat, userLng, mode, activeTour, getExplorePlaces]);

  const handleDismissWelcome = () => {
    localStorage.setItem(FIRST_VISIT_KEY, '1');
    setShowWelcome(false);
    setActivePlaces(getExplorePlaces());
  };

  const handleToggleMode = (newMode: 'explore' | 'tour') => {
    if (newMode === 'explore') {
      setMode('explore');
      setActiveTour(null);
      setActivePlaces(getExplorePlaces());
      setCurrentIndex(0);
      setBottomTab('explore');
    } else {
      setMode('tour');
      setActiveTour(null);
      setBottomTab('explore');
    }
  };

  const handleSelectTour = (tour: Tour, places: Place[]) => {
    setActiveTour(tour);
    setActivePlaces(places);
    setCurrentIndex(0);
    setMode('explore'); // return to swipe view
    setBottomTab('explore');
  };

  const handleBackToExplore = () => {
    setMode('explore');
    setActiveTour(null);
    setActivePlaces(getExplorePlaces());
    setCurrentIndex(0);
  };

  const handleBottomTab = (tab: BottomTab) => {
    setBottomTab(tab);
    // Switching to explore tab returns to swipe UI
    if (tab === 'explore') {
      // no-op, stays in current mode
    }
  };

  const isOutOfRange = !inRange() && !locationDenied;

  // Render main content based on tab / mode
  const renderContent = () => {
    if (bottomTab === 'map') {
      return (
        <MapView
          places={PLACES}
          userLat={userLat}
          userLng={userLng}
          onOpenDetail={setSelectedPlace}
        />
      );
    }
    if (bottomTab === 'stops') {
      return (
        <AllStops
          places={PLACES}
          userLat={userLat}
          userLng={userLng}
          onOpenDetail={setSelectedPlace}
        />
      );
    }
    if (bottomTab === 'about') {
      return <About />;
    }

    // Default: explore tab
    if (mode === 'tour' && !activeTour) {
      return (
        <TourList
          allPlaces={PLACES}
          userLat={userLat}
          userLng={userLng}
          onSelectTour={handleSelectTour}
        />
      );
    }

    if (isOutOfRange) {
      return (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You've wandered beyond the field guide's range. Head toward the ocean and
            we'll find you something.
          </p>
        </div>
      );
    }

    return (
      <PlacePanel
        places={activePlaces}
        currentIndex={currentIndex}
        userLat={userLat}
        userLng={userLng}
        onIndexChange={setCurrentIndex}
        onOpenDetail={setSelectedPlace}
        isFirstVisit={isFirstVisit}
      />
    );
  };

  return (
    <>
      {/* SEO */}
      <title>Outer Sunset Field Guide</title>
      <meta
        name="description"
        content="A neighborhood walking companion for the Outer Sunset, San Francisco."
      />

      <div className="min-h-dvh flex flex-col bg-background pb-20">
        {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}

        <Header
          activeMode={mode}
          onToggleMode={handleToggleMode}
          tourLabel={activeTour?.name}
          onBackToExplore={activeTour ? handleBackToExplore : undefined}
        />

        {/* Location denied notice */}
        {locationDenied && bottomTab === 'explore' && (
          <div className="px-5 pb-2">
            <p className="text-xs text-muted-foreground/60 italic">
              Allow location access to see what's nearest to you.
            </p>
          </div>
        )}

        {/* Scrollable content area */}
        <main className="flex-1 pt-2">
          {renderContent()}
        </main>

        <BottomNav activeTab={bottomTab} onTabChange={handleBottomTab} />

        {/* Place detail sheet */}
        {selectedPlace && (
          <PlaceDetail
            place={selectedPlace}
            userLat={userLat}
            userLng={userLng}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </div>
    </>
  );
}
