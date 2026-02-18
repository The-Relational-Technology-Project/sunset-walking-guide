import { useEffect, useState, useCallback } from 'react';
import { PLACES, DEFAULT_CENTER, FIELD_GUIDE_RADIUS_KM, Place } from '@/data/places';
import { distanceKm } from '@/utils/geo';
import { Header, ExploreView } from '@/components/Header';
import { PlacePanel } from '@/components/PlacePanel';
import { PlaceDetail } from '@/components/PlaceDetail';
import { TourList, Tour } from '@/components/TourList';
import { MapView } from '@/components/MapView';
import { AllStops } from '@/components/AllStops';
import { About } from '@/components/About';
import { BottomNav, BottomTab } from '@/components/BottomNav';

const LOCATION_HINT_KEY = 'osfg_loc_hint_shown';

export default function Index() {
  // User location
  const [userLat, setUserLat] = useState(DEFAULT_CENTER.lat);
  const [userLng, setUserLng] = useState(DEFAULT_CENTER.lng);
  const [locationDenied, setLocationDenied] = useState(false);

  // Navigation state
  const [mainTab, setMainTab] = useState<BottomTab>('explore');
  const [exploreView, setExploreView] = useState<ExploreView>('cards');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [activePlaces, setActivePlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

  // Initialize places on mount
  useEffect(() => {
    setActivePlaces(getExplorePlaces());
  }, []);

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

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 30000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update explore sort when location changes (only if not in a tour)
  useEffect(() => {
    if (!activeTour) {
      const sorted = getExplorePlaces();
      setActivePlaces(sorted);
    }
  }, [userLat, userLng, activeTour, getExplorePlaces]);

  const handleSelectTour = (tour: Tour, places: Place[]) => {
    setActiveTour(tour);
    setActivePlaces(places);
    setCurrentIndex(0);
    setMainTab('explore');
    setExploreView('cards');
  };

  const handleBackToExplore = () => {
    setActiveTour(null);
    setActivePlaces(getExplorePlaces());
    setCurrentIndex(0);
    setExploreView('cards');
  };

  const handleMainTab = (tab: BottomTab) => {
    setMainTab(tab);
    // Switching away from tour tab resets nothing; switching to explore keeps current view
  };

  const isOutOfRange = !inRange() && !locationDenied;

  // Render main content
  const renderContent = () => {
    if (mainTab === 'about') {
      return <About />;
    }

    if (mainTab === 'tour') {
      return (
        <TourList
          allPlaces={PLACES}
          userLat={userLat}
          userLng={userLng}
          onSelectTour={handleSelectTour}
        />
      );
    }

    // Explore tab
    if (exploreView === 'map') {
      return (
        <MapView
          places={PLACES}
          userLat={userLat}
          userLng={userLng}
          onOpenDetail={setSelectedPlace}
        />
      );
    }

    if (exploreView === 'scan') {
      return (
        <AllStops
          places={PLACES}
          userLat={userLat}
          userLng={userLng}
          onOpenDetail={setSelectedPlace}
        />
      );
    }

    // Cards view (default)
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
        isFirstVisit={false}
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
        <Header
          mainTab={mainTab}
          exploreView={exploreView}
          onExploreViewChange={setExploreView}
          activeTourLabel={activeTour?.name}
          onBackToExplore={activeTour ? handleBackToExplore : undefined}
        />

        {/* Location denied notice */}
        {locationDenied && mainTab === 'explore' && exploreView === 'cards' && (
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

        <BottomNav activeTab={mainTab} onTabChange={handleMainTab} />

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
