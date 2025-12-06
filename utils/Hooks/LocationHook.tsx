import { useEffect, useState, useRef } from 'react';
import { getLocation, setLocation } from '../genralCall';


interface LocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
}

const useLocation = (session: any) => {
    const [location, setLocationState] = useState<LocationPosition | null>(null);
    const [shouldSendLocation, setShouldSendLocation] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Stable session reference to avoid effect loops if session object changes but content is same
    // Actually, session changes when token refreshes. We want that.
    // However, if session is just referentially different but same content, we might loop.
    // But next-auth useSession usually handles this well.
    // The issue might be `session` prop passed in is unstable.

    const idToken = session?.id_token;

    useEffect(() => {
        if (!idToken) return;
        const getServerLocation = async () => {
             try {
                const loc = await getLocation(idToken);
                if (loc) {
                    setLocationState(loc);
                    localStorage.setItem('user_location', JSON.stringify({ latitude: loc.latitude, longitude: loc.longitude, accuracy: loc.accuracy }));
                }
             } catch(err) {
                 // ignore
             }
        };
        getServerLocation();
    }, [idToken]); // Use idToken instead of full session object

    useEffect(() => {
        if (!idToken) return;
        let geoId: number | null = null;
        let permissionChecked = false;
        let cancelled = false;

        const getPermissionAndLocation = async () => {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                return;
            }

            if (!permissionChecked && navigator.permissions) {
                try {
                    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                    permissionChecked = true;
                    if (permissionStatus.state === 'denied') {
                        setError('Location permission denied');
                        return;
                    }
                } catch (err) {
                    // Removed console.error
                }
            }

            geoId = navigator.geolocation.watchPosition(
                async (position) => {
                    if (cancelled) return;
                    const { latitude, longitude, accuracy } = position.coords;

                    if (accuracy > 50) {
                        setError("Location accuracy too low, waiting for better fix...");
                        return;
                    }

                    setLocationState({ latitude, longitude, accuracy });

                    const prevLocationStr = localStorage.getItem('user_location');
                    let distance = 1000; // default large distance

                    if (prevLocationStr) {
                        try {
                            const prevLocation: LocationPosition = JSON.parse(prevLocationStr);
                            const toRad = (val: number) => (val * Math.PI) / 180;
                            const R = 6371000;
                            const dLat = toRad(latitude - prevLocation.latitude);
                            const dLon = toRad(longitude - prevLocation.longitude);
                            const lat1 = toRad(prevLocation.latitude);
                            const lat2 = toRad(latitude);
                            const a = Math.sin(dLat / 2) ** 2 +
                                Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            distance = R * c;

                            if (distance <= 200) {
                                setShouldSendLocation(false);
                            } else {
                                setShouldSendLocation(true);
                            }
                        } catch (e: any) {
                            setError(e.message);
                        }
                    }

                    localStorage.setItem('user_location', JSON.stringify({ latitude, longitude, accuracy }));

                    // We need access to the *current* shouldSendLocation state, but in a callback it might be stale?
                    // actually this effect runs when idToken changes.
                    // But inside watchPosition callback, we rely on closure.
                    // However, we are not depending on 'shouldSendLocation' in dep array because we want to avoid resetting watchPosition.
                    // Let's use the local calculation of distance.

                    let shouldSend = true;
                     if (prevLocationStr && distance <= 200) {
                        shouldSend = false;
                     }

                    if (!shouldSend) {
                        return;
                    }

                    if (idToken) {
                        const locationString = `${latitude},${longitude},${accuracy.toFixed(2)}`;
                        try {
                            const response = await setLocation(idToken, locationString);
                            if (response.update_required) {
                                if (window.confirm("Your location seems outdated. Update now?")) {
                                    await setLocation(idToken, locationString, { update: "true" });
                                }
                            }
                        } catch (apiError) {
                            setError("Error sending location to server");
                        }
                    }
                },
                (geoError) => {
                    setError("Error getting location: " + geoError.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 60000,
                    maximumAge: 0,
                }
            );
        };

        getPermissionAndLocation();

        return () => {
            cancelled = true;
            if (geoId !== null) navigator.geolocation.clearWatch(geoId);
        };
    }, [idToken]);

    return { location, error };
};

export default useLocation;
