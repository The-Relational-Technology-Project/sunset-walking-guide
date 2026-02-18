import { useEffect, useState, useCallback } from 'react';
import { DEFAULT_CENTER, FIELD_GUIDE_RADIUS_KM, Place } from '@/data/places';
import { distanceKm } from '@/utils/geo';
import { usePlaces } from '@/hooks/usePlaces';
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
  const { data: allPlaces = [] } = usePlaces();

  // User location
  const [userLat, setUserLat] = useState(DEFAULT_CENTER.lat);
  const [userLng, setUserLng] = useState(DEFAULT_CENTER.lng);
  const [locationDenied, setLocationDenied] = useState(false);
  // 'prompt' = not yet asked, 'denied' = blocked (need settings), 'granted' = ok
  const [locationPermState, setLocationPermState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Navigation state
  const [mainTab, setMainTab] = useState<BottomTab>('explore');
  const [exploreView, setExploreView] = useState<ExploreView>('cards');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [activePlaces, setActivePlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Build sorted explore places
  const getExplorePlaces = useCallback(() => {
    return [...allPlaces].sort(
      (a, b) =>
        distanceKm(userLat, userLng, a.lat, a.lng) -
        distanceKm(userLat, userLng, b.lat, b.lng)
    );
  }, [allPlaces, userLat, userLng]);

  // Check if user is in range
  const inRange = useCallback(() => {
    return allPlaces.some(
      (p) => distanceKm(userLat, userLng, p.lat, p.lng) <= FIELD_GUIDE_RADIUS_KM * 2
    );
  }, [allPlaces, userLat, userLng]);

  // Update explore sort whenever places load or location changes
  useEffect(() => {
    if (!activeTour && allPlaces.length > 0) {
      setActivePlaces(getExplorePlaces());
    }
  }, [allPlaces, userLat, userLng]);

  // Geolocation with Permissions API to distinguish prompt vs denied states
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setLocationPermState('denied');
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
      setLocationDenied(false);
      setLocationPermState('granted');
    };

    const handleError = (err: GeolocationPositionError) => {
      setLocationDenied(true);
      // PERMISSION_DENIED = 1; other codes = timeout/unavailable (still prompt-able)
      setLocationPermState(err.code === 1 ? 'denied' : 'prompt');
    };

    const opts = { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, opts);
    navigator.geolocation.watchPosition(handleSuccess, handleError, opts);
  }, []);

  useEffect(() => {
    // Check permission state first via Permissions API (supported in Chrome/Firefox mobile)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermState(result.state as 'prompt' | 'granted' | 'denied');
        if (result.state !== 'denied') {
          requestLocation();
        } else {
          setLocationDenied(true);
        }
        result.onchange = () => {
          setLocationPermState(result.state as 'prompt' | 'granted' | 'denied');
          if (result.state === 'granted') requestLocation();
          if (result.state === 'denied') setLocationDenied(true);
        };
      });
    } else {
      requestLocation();
    }
  }, [requestLocation]);

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
          allPlaces={allPlaces}
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
          places={allPlaces}
          userLat={userLat}
          userLng={userLng}
          onOpenDetail={setSelectedPlace}
        />
      );
    }

    if (exploreView === 'scan') {
      return (
        <AllStops
          places={allPlaces}
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

        {/* Location notice */}
        {locationDenied && mainTab === 'explore' && exploreView === 'cards' && (
          <div className="px-5 pb-2 flex items-center gap-3">
            <p className="text-xs text-muted-foreground/70 italic flex-1">
              {locationPermState === 'denied'
                ? 'Location blocked — enable in your browser settings to see nearby places.'
                : 'Showing all places — allow location to sort by distance.'}
            </p>
            {locationPermState !== 'denied' && (
              <button
                onClick={requestLocation}
                className="text-xs text-foreground underline underline-offset-2 shrink-0"
              >
                Enable
              </button>
            )}
          </div>
        )}

        {/* Scrollable content area — flex-1 + overflow hidden keeps cards vertically centered */}
        <main className="flex-1 flex flex-col overflow-hidden">
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
