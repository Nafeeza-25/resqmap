import { useEffect } from 'react';
import {
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { Link } from 'react-router-dom';

const DEFAULT_CENTER = [12.9818, 80.218];

const HISTORICAL_CONTEXT = [
  {
    id: 'HIST-1',
    name: 'Velachery flood context',
    date: 'Historical context marker',
    lat: 12.9769,
    lng: 80.2212,
  },
  {
    id: 'HIST-2',
    name: 'Adyar flood context',
    date: 'Historical context marker',
    lat: 13.0065,
    lng: 80.2571,
  },
];

function getUrgencyStyle(level, selected) {
  const styles = {
    CRITICAL: {
      color: '#991B1B',
      fillColor: '#DC2626',
    },
    HIGH: {
      color: '#C2410C',
      fillColor: '#F97316',
    },
    MEDIUM: {
      color: '#A16207',
      fillColor: '#FACC15',
    },
    LOW: {
      color: '#1D4ED8',
      fillColor: '#3B82F6',
    },
  };

  const style = styles[level] ?? {
    color: '#334155',
    fillColor: '#64748B',
  };

  return {
    ...style,
    weight: selected ? 5 : 3,
    fillOpacity: selected ? 0.95 : 0.78,
    opacity: 1,
  };
}

function MapFocusController({ incident }) {
  const map = useMap();

  useEffect(() => {
    if (!incident?.location?.lat || !incident?.location?.lng) {
      return;
    }

    map.flyTo(
      [incident.location.lat, incident.location.lng],
      Math.max(map.getZoom(), 15),
      {
        duration: 0.65,
      },
    );
  }, [incident, map]);

  return null;
}

export default function IncidentMap({
  incidents = [],
  height = 520,
  showHistorical = true,
  selectedIncidentId = null,
  onSelectIncident,
}) {
  const located = incidents.filter(
    incident =>
      incident.location?.lat && incident.location?.lng,
  );

  const center = located[0]
    ? [located[0].location.lat, located[0].location.lng]
    : DEFAULT_CENTER;

  const selectedIncident = located.find(
    incident => incident.id === selectedIncidentId,
  );

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      style={{
        height,
        width: '100%',
      }}
      className="incident-map h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFocusController incident={selectedIncident} />

      <LayersControl position="topright">

        {/* Current incidents */}
        <LayersControl.Overlay
          checked
          name="Current reconstructed incidents"
        >
          <LayerGroup>
            {located.map(incident => {
              const selected =
                selectedIncidentId === incident.id;

              const urgency =
                incident.intelligence?.urgency?.level;

              const contradictionCount =
                incident.contradictions?.length ?? 0;

              return (
                <CircleMarker
                  key={incident.id}
                  center={[
                    incident.location.lat,
                    incident.location.lng,
                  ]}
                  radius={selected ? 15 : 11}
                  pathOptions={getUrgencyStyle(
                    urgency,
                    selected,
                  )}
                  eventHandlers={{
                    click: () =>
                      onSelectIncident?.(incident.id),
                  }}
                >
                  <Popup className="resqmap-popup">
                    <div className="min-w-[230px] p-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] font-bold text-rq-info">
                          {incident.id}
                        </span>

                        <span
                          className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                            urgency === 'CRITICAL'
                              ? 'bg-rq-red-soft text-rq-red'
                              : urgency === 'HIGH'
                                ? 'bg-rq-orange-soft text-rq-orange'
                                : urgency === 'MEDIUM'
                                  ? 'bg-rq-warning-soft text-rq-warning'
                                  : 'bg-rq-info/10 text-rq-info'
                          }`}
                        >
                          {urgency ?? 'Unknown'}
                        </span>
                      </div>

                      <strong className="mt-2 block text-sm leading-5 text-rq-text">
                        {incident.title}
                      </strong>

                      <p className="mt-1 text-xs text-rq-text-secondary">
                        {incident.locationLabel}
                      </p>

                      <div className="mt-3 space-y-2 border-t border-rq-border-soft pt-3">
                        <div className="flex justify-between gap-4 text-[11px]">
                          <span className="text-rq-text-secondary">
                            Evidence
                          </span>

                          <strong className="text-rq-text">
                            {incident.intelligence?.confidence
                              ?.level ?? 'Unknown'}
                          </strong>
                        </div>

                        <div className="flex justify-between gap-4 text-[11px]">
                          <span className="text-rq-text-secondary">
                            Workflow
                          </span>

                          <strong className="text-right text-rq-text">
                            {(
                              incident.intelligence?.workflow
                                ?.workflow ?? 'Unknown'
                            ).replaceAll('_', ' ')}
                          </strong>
                        </div>

                        <div className="flex justify-between gap-4 text-[11px]">
                          <span className="text-rq-text-secondary">
                            Conflicts
                          </span>

                          <strong
                            className={
                              contradictionCount > 0
                                ? 'text-rq-red'
                                : 'text-rq-text'
                            }
                          >
                            {contradictionCount}
                          </strong>
                        </div>
                      </div>

                      <Link
                        to={`/incidents/${incident.id}`}
                        className="mt-3 flex items-center justify-center rounded-lg bg-rq-surface-raised px-3 py-2 text-xs font-bold text-white no-underline transition hover:bg-rq-surface-hover"
                      >
                        Open incident intelligence
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* Historical context */}
        {showHistorical && (
          <LayersControl.Overlay name="Historical context (demo)">
            <LayerGroup>
              {HISTORICAL_CONTEXT.map(item => (
                <CircleMarker
                  key={item.id}
                  center={[item.lat, item.lng]}
                  radius={7}
                  pathOptions={{
                    color: '#64748B',
                    fillColor: '#94A3B8',
                    weight: 2,
                    fillOpacity: 0.25,
                    dashArray: '4 4',
                  }}
                >
                  <Popup className="resqmap-popup">
                    <div className="min-w-[210px] p-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-rq-text-muted">
                        Historical context
                      </span>

                      <strong className="mt-1.5 block text-sm text-rq-text">
                        {item.name}
                      </strong>

                      <p className="mt-1 text-xs text-rq-text-secondary">
                        {item.date}
                      </p>

                      <div className="mt-3 rounded-lg bg-rq-surface-raised p-2.5 text-[10px] leading-4 text-rq-text-secondary">
                        No casualty values are fabricated in this prototype.
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  );
}