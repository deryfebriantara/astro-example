import { useState, useEffect, useMemo } from 'react';

const FLIGHT_STATUSES = {
  SCHEDULED: { label: 'Scheduled', color: 'bg-gray-400' },
  BOARDING: { label: 'Boarding', color: 'bg-gray-500' },
  DEPARTED: { label: 'Departed', color: 'bg-gray-600' },
  IN_FLIGHT: { label: 'In Flight', color: 'bg-gray-700' },
  LANDING: { label: 'Landing', color: 'bg-gray-700' },
  ARRIVED: { label: 'Arrived', color: 'bg-gray-900' },
  DELAYED: { label: 'Delayed', color: 'bg-gray-800' },
};

const FlightTracker = ({
  flightNumber = "AIT 737",
  origin = "Jakarta",
  originCode = "CGK",
  destination = "Bali",
  destinationCode = "DPS",
  departureTime = "10:00",
  arrivalTime = "13:00",
  distance = 1150, // km
  autoPlay = true
}) => {
  const [currentStatus, setCurrentStatus] = useState('SCHEDULED');
  const [flightProgress, setFlightProgress] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [remainingTime, setRemainingTime] = useState(180); // minutes
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [weather, setWeather] = useState({ temp: 28, condition: 'Clear' });
  const [events, setEvents] = useState([]);

  const maxAltitude = 37000; // feet
  const maxSpeed = 850; // km/h

  // Add flight event
  const addEvent = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [{
      id: Date.now(),
      timestamp,
      message,
      type: currentStatus
    }, ...prev].slice(0, 10)); // Keep last 10 events
  };

  // Simulate flight progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFlightProgress(prev => {
        const newProgress = Math.min(prev + 0.5, 100);

        // Update status based on progress
        if (newProgress === 0) {
          setCurrentStatus('SCHEDULED');
        } else if (newProgress < 5) {
          if (currentStatus !== 'BOARDING') {
            setCurrentStatus('BOARDING');
            addEvent('Boarding started - Gate B7');
          }
        } else if (newProgress < 10) {
          if (currentStatus !== 'DEPARTED') {
            setCurrentStatus('DEPARTED');
            addEvent('Flight departed from Jakarta (CGK)');
          }
        } else if (newProgress < 90) {
          if (currentStatus !== 'IN_FLIGHT') {
            setCurrentStatus('IN_FLIGHT');
            addEvent('Cruising at 37,000 feet');
          }
        } else if (newProgress < 95) {
          if (currentStatus !== 'LANDING') {
            setCurrentStatus('LANDING');
            addEvent('Beginning descent into Bali (DPS)');
          }
        } else if (newProgress === 100) {
          if (currentStatus !== 'ARRIVED') {
            setCurrentStatus('ARRIVED');
            addEvent('Flight arrived at Bali (DPS)');
            setIsPlaying(false);
          }
        }

        // Update altitude (climb, cruise, descend)
        if (newProgress < 10) {
          setAltitude((newProgress / 10) * maxAltitude);
        } else if (newProgress < 90) {
          setAltitude(maxAltitude);
        } else {
          setAltitude(maxAltitude * ((100 - newProgress) / 10));
        }

        // Update speed
        if (newProgress < 5) {
          setSpeed((newProgress / 5) * 200);
        } else if (newProgress < 10) {
          setSpeed(200 + ((newProgress - 5) / 5) * (maxSpeed - 200));
        } else if (newProgress < 90) {
          setSpeed(maxSpeed + Math.sin(Date.now() / 1000) * 20);
        } else if (newProgress < 100) {
          setSpeed(maxSpeed * ((100 - newProgress) / 10));
        } else {
          setSpeed(0);
        }

        // Update remaining time
        const totalMinutes = 180;
        setRemainingTime(Math.max(0, totalMinutes - (totalMinutes * newProgress / 100)));

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStatus]);

  // Random weather updates
  useEffect(() => {
    const weatherConditions = [
      { temp: 28, condition: 'Clear' },
      { temp: 26, condition: 'Partly Cloudy' },
      { temp: 24, condition: 'Cloudy' },
      { temp: 22, condition: 'Light Rain' },
    ];

    const interval = setInterval(() => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeather(randomWeather);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Calculate current position on map
  const planePosition = useMemo(() => {
    const progress = flightProgress / 100;
    // Simple curved path
    const x = 10 + (progress * 80);
    const y = 50 - Math.sin(progress * Math.PI) * 20;
    return { x, y };
  }, [flightProgress]);

  // Format time remaining
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs}h ${mins}m`;
  };

  const resetFlight = () => {
    setFlightProgress(0);
    setCurrentStatus('SCHEDULED');
    setAltitude(0);
    setSpeed(0);
    setRemainingTime(180);
    setEvents([]);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${FLIGHT_STATUSES[currentStatus].color} text-white p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-1">Flight {flightNumber}</h2>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>{origin} ({originCode})</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>{destination} ({destinationCode})</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold uppercase tracking-wide">{FLIGHT_STATUSES[currentStatus].label}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300 ease-linear"
            style={{ width: `${flightProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Flight Map */}
        <div className="mb-6 bg-gray-50 rounded-lg p-6 relative overflow-hidden border border-gray-200">
          {/* Clouds */}
          <div className="absolute top-4 left-10 text-4xl opacity-10 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>
          <div className="absolute top-12 right-20 text-5xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>
          <div className="absolute bottom-10 left-1/3 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>

          {/* Flight path */}
          <svg className="w-full h-48" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Path line */}
            <path
              d="M 10 50 Q 50 20, 90 50"
              stroke="#9CA3AF"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
              opacity="0.5"
            />

            {/* Traveled path */}
            <path
              d="M 10 50 Q 50 20, 90 50"
              stroke="#4B5563"
              strokeWidth="1"
              fill="none"
              strokeDasharray={`${flightProgress * 1.2} ${120 - flightProgress * 1.2}`}
              className="transition-all duration-100"
            />
          </svg>

          {/* Origin marker */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
              {originCode}
            </div>
          </div>

          {/* Destination marker */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
              {destinationCode}
            </div>
          </div>

          {/* Airplane */}
          <div
            className="absolute transition-all duration-100 ease-linear transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${planePosition.x}%`,
              top: `${planePosition.y}%`,
              transform: `translate(-50%, -50%) rotate(${flightProgress < 50 ? 0 : 10}deg)`
            }}
          >
            <svg className="w-10 h-10 drop-shadow-lg text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>

          {/* Distance indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow">
            {Math.round(distance * flightProgress / 100)} / {distance} km
          </div>
        </div>

        {/* Flight stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Altitude */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-700 font-medium mb-1">Altitude</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(altitude).toLocaleString()}
              <span className="text-sm font-normal ml-1">ft</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gray-700 h-full transition-all duration-300"
                style={{ width: `${(altitude / maxAltitude) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Speed */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-700 font-medium mb-1">Speed</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(speed)}
              <span className="text-sm font-normal ml-1">km/h</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gray-700 h-full transition-all duration-300"
                style={{ width: `${(speed / maxSpeed) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Time remaining */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-700 font-medium mb-1">Time Remaining</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(remainingTime)}
            </div>
            <div className="mt-2 text-xs text-gray-700">
              Arrives at {arrivalTime}
            </div>
          </div>

          {/* Weather */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-700 font-medium mb-1">Weather</div>
            <div className="flex items-center gap-2">
              <div>
                <div className="text-xl font-bold text-gray-900">{weather.temp}°C</div>
                <div className="text-xs text-gray-700">{weather.condition}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 ${isPlaying ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-600 hover:bg-gray-700'} text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play
              </>
            )}
          </button>
          <button
            onClick={resetFlight}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>

        {/* Flight events timeline */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Flight Events
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No events yet. Click Play to start tracking.</p>
            ) : (
              events.map(event => (
                <div key={event.id} className="flex items-start gap-3 text-sm bg-white rounded p-2 border border-gray-200">
                  <div className="text-gray-500 font-mono text-xs whitespace-nowrap">{event.timestamp}</div>
                  <div className="flex-1">
                    <span className="text-gray-900">{event.message}</span>
                  </div>
                  <div className={`${FLIGHT_STATUSES[event.type].color} text-white text-xs px-2 py-0.5 rounded font-medium`}>
                    {FLIGHT_STATUSES[event.type].label}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Flight info */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-700 font-medium">Departure:</span>
              <span className="ml-2 text-gray-900">{departureTime}</span>
            </div>
            <div>
              <span className="text-gray-700 font-medium">Arrival:</span>
              <span className="ml-2 text-gray-900">{arrivalTime}</span>
            </div>
            <div>
              <span className="text-gray-700 font-medium">Duration:</span>
              <span className="ml-2 text-gray-900">3h 00m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightTracker;
