export const DEMO_REPORTS = [
  {
    id: 'A', sourceId: 'Reporter A', sourceType: 'citizen_form', language: 'English', channel: 'Citizen form',
    timestamp: '2026-08-15T14:05:00+05:30',
    text: 'Five people trapped inside a flooded house on Gandhi Street, Velachery.',
    location: { lat: 12.9818, lng: 80.2180 }, status: 'linked', incidentId: 'INC-21'
  },
  {
    id: 'B', sourceId: 'Reporter B', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T14:09:00+05:30',
    text: 'Two elderly people waiting on a rooftop near Gandhi Street pharmacy.',
    location: { lat: 12.9821, lng: 80.2183 }, status: 'linked', incidentId: 'INC-21'
  },
  {
    id: 'C', sourceId: 'Reporter C', sourceType: 'citizen_form', language: 'English', channel: 'Citizen form',
    timestamp: '2026-08-15T14:12:00+05:30',
    text: 'Family at Gandhi Street already rescued.',
    location: { lat: 12.9817, lng: 80.2182 }, status: 'linked', incidentId: 'INC-21'
  },
  {
    id: 'D', sourceId: 'Reporter D', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T14:14:00+05:30',
    text: 'Water is rising. People are still shouting from the roof near Gandhi Street.',
    location: { lat: 12.9819, lng: 80.2181 }, status: 'linked', incidentId: 'INC-21'
  },
  {
    id: 'E', sourceId: 'Reporter E', sourceType: 'citizen_form', language: 'English', channel: 'Citizen form',
    timestamp: '2026-08-15T14:16:00+05:30',
    text: 'Tree fallen across Gandhi Nagar Road.',
    location: { lat: 12.9875, lng: 80.2245 }, status: 'separate', incidentId: 'INC-22'
  },
  {
    id: 'G', sourceId: 'Reporter G', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T14:07:00+05:30',
    text: 'Caller says five people are stranded in a flooded home close to Gandhi Street in Velachery.',
    location: { lat: 12.9816, lng: 80.2178 }, status: 'review'
  },
  {
    id: 'H', sourceId: 'Reporter H', sourceType: 'citizen_form', language: 'Tamil', channel: 'Citizen form',
    timestamp: '2026-08-15T14:10:00+05:30',
    text: 'காந்தி ஸ்ட்ரீட், வேளச்சேரியில் வெள்ளம்; இரண்டு முதியவர்கள் மாடியில் சிக்கியுள்ளனர்.',
    location: { lat: 12.9820, lng: 80.2184 }, status: 'review'
  },
  {
    id: 'I', sourceId: 'Reporter I', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T13:20:00+05:30',
    text: 'Earlier call: flood water entered a house on Gandhi Street; occupants moved upstairs.',
    location: { lat: 12.9815, lng: 80.2181 }, status: 'review', stale: true
  },
  {
    id: 'J', sourceId: 'Reporter J', sourceType: 'citizen_form', language: 'English', channel: 'Citizen form',
    timestamp: '2026-08-15T14:11:00+05:30',
    text: 'Two children trapped in flood water. Address unclear.',
    location: null, status: 'review'
  },
  {
    id: 'K', sourceId: 'Reporter K', sourceType: 'field_note', language: 'English', channel: 'Field note',
    timestamp: '2026-08-15T14:03:00+05:30',
    text: 'Car with three occupants stranded in flood water near Taramani Link Road.',
    location: { lat: 12.9852, lng: 80.2408 }, status: 'review'
  },
  {
    id: 'L', sourceId: 'Reporter L', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T14:13:00+05:30',
    text: 'Vehicle occupants are standing beside a stalled car near Taramani Link Road after water rose.',
    location: { lat: 12.9850, lng: 80.2405 }, status: 'review'
  },
  {
    id: 'M', sourceId: 'Reporter M', sourceType: 'citizen_form', language: 'English', channel: 'Citizen form',
    timestamp: '2026-08-15T14:01:00+05:30',
    text: 'Smoke and fire reported from a ground-floor shop in Adyar.',
    location: { lat: 13.0067, lng: 80.2572 }, status: 'review'
  },
  {
    id: 'N', sourceId: 'Reporter N', sourceType: 'call_note', language: 'English', channel: 'Call note',
    timestamp: '2026-08-15T14:08:00+05:30',
    text: 'Second caller reports flames visible from the same Adyar shop; people are outside.',
    location: { lat: 13.0069, lng: 80.2570 }, status: 'review'
  },
  {
    id: 'O', sourceId: 'Reporter O', sourceType: 'field_note', language: 'English', channel: 'Field note',
    timestamp: '2026-08-15T14:06:00+05:30',
    text: 'Medical assistance requested for an injured cyclist on Velachery Main Road.',
    location: { lat: 12.9765, lng: 80.2205 }, status: 'review'
  },
  {
    id: 'P', sourceId: 'Reporter P', sourceType: 'citizen_form', language: 'Tamil', channel: 'Citizen form',
    timestamp: '2026-08-15T14:15:00+05:30',
    text: 'வேளச்சேரி பகுதியில் தண்ணீர் அதிகரிக்கிறது; வீட்டு முகவரி தெளிவாக இல்லை.',
    location: null, status: 'review'
  }
];

export const CANONICAL_FIELD_EVIDENCE = {
  sourceId: 'Field Unit 3',
  sourceType: 'field_unit',
  language: 'English',
  channel: 'Field confirmation',
  verified: true,
  timestamp: '2026-08-15T14:18:00+05:30',
  text: 'Rescue has not been completed. Two elderly people remain on the rooftop near Gandhi Street.',
  location: { lat: 12.9820, lng: 80.2182 }
};
