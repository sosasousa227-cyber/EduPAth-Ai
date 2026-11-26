import L from 'leaflet';
import {
  Compass,
  ExternalLink,
  Info,
  LocateFixed,
  Map as MapIcon,
  MapPin,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import type { Institution } from '../types/edu';

export const PARAGUAY_CENTER: [number, number] = [-23.4425, -58.4438];
export const ASUNCION_CENTER: [number, number] = [-25.2637, -57.5759];

interface ParaguayMapProps {
  institutions: Institution[];
  focusedInstitution?: Institution | null;
  onSelectInstitution: (institution: Institution) => void;
  heightClass?: string;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createCategoryIcon(color: string, isFocused: boolean) {
  const size = isFocused ? 38 : 32;
  const ring = isFocused ? '#29243A' : '#FFFFFF';
  return L.divIcon({
    className: 'edupath-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3C11.3726 3 6 8.37258 6 15C6 23.25 18 33 18 33C18 33 30 23.25 30 15C30 8.37258 24.6274 3 18 3Z" fill="${color}" stroke="${ring}" stroke-width="2.5"/>
      <circle cx="18" cy="14.5" r="4.5" fill="#FFFFFF"/>
    </svg>`,
  });
}

function MapViewportController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.7 });
  }, [center, zoom, map]);
  return null;
}

export function ParaguayMap({
  institutions,
  focusedInstitution,
  onSelectInstitution,
  heightClass = 'h-[460px] lg:h-[560px]',
}: ParaguayMapProps) {
  const [viewport, setViewport] = useState<{
    center: [number, number];
    zoom: number;
  }>({
    center: PARAGUAY_CENTER,
    zoom: 6,
  });

  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (focusedInstitution) {
      setViewport({
        center: [focusedInstitution.latitude, focusedInstitution.longitude],
        zoom: 14,
      });
    }
  }, [focusedInstitution]);

  const handleRequestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('Tu navegador no admite geolocalización.');
      return;
    }
    setGeoLoading(true);
    setGeoStatus(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserCoords(coords);
        setViewport({ center: coords, zoom: 13 });
        setGeoStatus('Ubicación actual activada en el mapa.');
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus(
            'No autorizaste el acceso a tu ubicación. Podés seguir explorando el mapa libremente.'
          );
        } else {
          setGeoStatus('No pudimos obtener tu ubicación en este momento.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const iconsByKey = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const inst of institutions) {
      const color = inst.category?.color || '#A78BFA';
      const isFocused = focusedInstitution?.id === inst.id;
      const key = `${color}-${isFocused}`;
      if (!map.has(key)) {
        map.set(key, createCategoryIcon(color, isFocused));
      }
    }
    return map;
  }, [institutions, focusedInstitution]);

  return (
    <div className="space-y-3">
      {/* Map toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#29243A]/10 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewport({ center: PARAGUAY_CENTER, zoom: 6 })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF9F5] hover:bg-[#A78BFA]/15 border border-[#29243A]/10 text-xs font-bold text-[#29243A] transition-colors cursor-pointer whitespace-nowrap"
          >
            <MapIcon className="w-3.5 h-3.5 text-[#5B3CC4]" aria-hidden="true" />
            <span>Todo Paraguay</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport({ center: ASUNCION_CENTER, zoom: 12 })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF9F5] hover:bg-[#91C9F7]/20 border border-[#29243A]/10 text-xs font-bold text-[#29243A] transition-colors cursor-pointer whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5 text-[#5B3CC4]" aria-hidden="true" />
            <span>Asunción</span>
          </button>

          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5B3CC4] hover:bg-[#4C31A8] disabled:opacity-60 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <LocateFixed className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{geoLoading ? 'Ubicando...' : 'Mi ubicación'}</span>
          </button>
        </div>

        {/* Category color legend (clean inline text) */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#29243A]/75 px-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" aria-hidden="true" />
            Academias
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A9D9BD]" aria-hidden="true" />
            Bibliotecas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#91C9F7]" aria-hidden="true" />
            Capacitación
          </span>
        </div>
      </div>

      {geoStatus && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#91C9F7]/20 border border-[#91C9F7]/40 text-xs font-semibold text-[#29243A]">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
          <span>{geoStatus}</span>
        </div>
      )}

      {/* Map frame */}
      <div
        className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-[#29243A]/12 shadow-sm z-10`}
      >
        <MapContainer
          center={PARAGUAY_CENTER}
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapViewportController center={viewport.center} zoom={viewport.zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userCoords && (
            <CircleMarker
              center={userCoords}
              radius={9}
              pathOptions={{
                color: '#5B3CC4',
                fillColor: '#F4A6C1',
                fillOpacity: 0.9,
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-1 text-xs font-semibold text-[#29243A]">
                  Tu ubicación aproximada
                </div>
              </Popup>
            </CircleMarker>
          )}

          {institutions.map((inst) => {
            const color = inst.category?.color || '#A78BFA';
            const isFocused = focusedInstitution?.id === inst.id;
            const icon = iconsByKey.get(`${color}-${isFocused}`);
            const distanceKm = userCoords
              ? haversineKm(
                  userCoords[0],
                  userCoords[1],
                  inst.latitude,
                  inst.longitude
                )
              : null;

            const routeUrl = userCoords
              ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userCoords[0]}%2C${userCoords[1]}%3B${inst.latitude}%2C${inst.longitude}`
              : `https://www.openstreetmap.org/directions?to=${inst.latitude},${inst.longitude}`;

            return (
              <Marker
                key={inst.id}
                position={[inst.latitude, inst.longitude]}
                icon={icon}
              >
                <Popup maxWidth={270}>
                  <div className="p-1.5 space-y-2 text-[#29243A]">
                    <div className="text-[11px] font-bold text-[#5B3CC4]">
                      {inst.category?.name || 'Institución'}
                      {inst.is_demo && (
                        <span className="text-[#9A5B13]">
                          {' '}
                          · Ubicación de demostración
                        </span>
                      )}
                    </div>

                    <div className="font-display text-sm font-bold leading-snug">
                      {inst.name}
                    </div>

                    <div className="text-xs text-[#29243A]/75 leading-snug">
                      {inst.address}
                      <br />
                      {inst.city}, {inst.department}
                      {distanceKm !== null && (
                        <span className="block mt-1 font-mono-tabular font-semibold text-[#5B3CC4]">
                          A {distanceKm.toFixed(1)} km de tu ubicación
                        </span>
                      )}
                    </div>

                    <div className="pt-1 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectInstitution(inst)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#5B3CC4] hover:bg-[#4C31A8] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Ver ficha de la institución
                      </button>
                      <a
                        href={routeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#29243A]/15 hover:bg-[#FFF9F5] text-[#29243A] text-xs font-semibold transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#5B3CC4]" aria-hidden="true" />
                        <span>Ruta en OpenStreetMap</span>
                        <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
