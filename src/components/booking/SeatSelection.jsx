import { useState, useMemo, useEffect } from 'react';

// Seat types with pricing
const SEAT_TYPES = {
  ECONOMY: { label: 'Economy', price: 0, color: 'bg-blue-500' },
  ECONOMY_PLUS: { label: 'Economy Plus', price: 50, color: 'bg-purple-500' },
  EXIT_ROW: { label: 'Exit Row', price: 75, color: 'bg-green-500' },
  BUSINESS: { label: 'Business', price: 200, color: 'bg-amber-500' },
  OCCUPIED: { label: 'Occupied', price: 0, color: 'bg-gray-400' },
};

// Generate realistic seat map for Boeing 737-800
const generateSeatMap = () => {
  const rows = [];

  // Business Class (Rows 1-4) - 2-2 configuration
  for (let row = 1; row <= 4; row++) {
    rows.push({
      row,
      section: 'Business',
      seats: [
        { id: `${row}A`, type: 'BUSINESS', position: 'window' },
        { id: `${row}B`, type: 'BUSINESS', position: 'aisle' },
        null, // aisle gap
        { id: `${row}C`, type: 'BUSINESS', position: 'aisle' },
        { id: `${row}D`, type: 'BUSINESS', position: 'window' },
      ]
    });
  }

  // Exit Row (Row 12) - 3-3 configuration
  rows.push({
    row: 12,
    section: 'Exit Row',
    isExitRow: true,
    seats: [
      { id: '12A', type: 'EXIT_ROW', position: 'window' },
      { id: '12B', type: 'EXIT_ROW', position: 'middle' },
      { id: '12C', type: 'EXIT_ROW', position: 'aisle' },
      null, // aisle gap
      { id: '12D', type: 'EXIT_ROW', position: 'aisle' },
      { id: '12E', type: 'EXIT_ROW', position: 'middle' },
      { id: '12F', type: 'EXIT_ROW', position: 'window' },
    ]
  });

  // Economy Plus (Rows 5-11, 13-15) - 3-3 configuration
  const economyPlusRows = [...Array.from({length: 7}, (_, i) => i + 5), 13, 14, 15];
  economyPlusRows.forEach(row => {
    if (row !== 12) { // Skip exit row
      rows.push({
        row,
        section: 'Economy Plus',
        seats: [
          { id: `${row}A`, type: 'ECONOMY_PLUS', position: 'window' },
          { id: `${row}B`, type: 'ECONOMY_PLUS', position: 'middle' },
          { id: `${row}C`, type: 'ECONOMY_PLUS', position: 'aisle' },
          null, // aisle gap
          { id: `${row}D`, type: 'ECONOMY_PLUS', position: 'aisle' },
          { id: `${row}E`, type: 'ECONOMY_PLUS', position: 'middle' },
          { id: `${row}F`, type: 'ECONOMY_PLUS', position: 'window' },
        ]
      });
    }
  });

  // Economy (Rows 16-30) - 3-3 configuration
  for (let row = 16; row <= 30; row++) {
    rows.push({
      row,
      section: 'Economy',
      seats: [
        { id: `${row}A`, type: 'ECONOMY', position: 'window' },
        { id: `${row}B`, type: 'ECONOMY', position: 'middle' },
        { id: `${row}C`, type: 'ECONOMY', position: 'aisle' },
        null, // aisle gap
        { id: `${row}D`, type: 'ECONOMY', position: 'aisle' },
        { id: `${row}E`, type: 'ECONOMY', position: 'middle' },
        { id: `${row}F`, type: 'ECONOMY', position: 'window' },
      ]
    });
  }

  return rows;
};

// Randomly mark some seats as occupied
const markRandomSeatsOccupied = (seatMap) => {
  const occupiedSeats = new Set();
  const allSeats = seatMap.flatMap(row =>
    row.seats.filter(seat => seat !== null)
  );

  // Mark 30-40% of seats as occupied
  const occupiedCount = Math.floor(allSeats.length * (0.3 + Math.random() * 0.1));

  while (occupiedSeats.size < occupiedCount) {
    const randomSeat = allSeats[Math.floor(Math.random() * allSeats.length)];
    occupiedSeats.add(randomSeat.id);
  }

  return occupiedSeats;
};

const SeatSelection = ({ passengers = 2, onSeatsSelected }) => {
  const seatMap = useMemo(() => generateSeatMap(), []);
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState(new Map());
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [passengerAssignments, setPassengerAssignments] = useState(new Map());
  const [showLegend, setShowLegend] = useState(true);

  // Initialize occupied seats on client-side only (after mount)
  useEffect(() => {
    setOccupiedSeats(markRandomSeatsOccupied(seatMap));
  }, [seatMap]);

  // Debug: Component mounted
  useEffect(() => {
    console.log('SeatSelection component mounted');
    console.log('Passengers:', passengers);
    console.log('Total seats:', seatMap.length);
    console.log('Occupied seats:', occupiedSeats.size);
  }, [passengers, seatMap, occupiedSeats]);

  // Debug: selectedSeats changes
  useEffect(() => {
    console.log('Selected seats changed:', selectedSeats.size);
    console.log('Selected seats:', Array.from(selectedSeats.keys()));
  }, [selectedSeats]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = 0;
    selectedSeats.forEach((seatInfo) => {
      total += SEAT_TYPES[seatInfo.type].price;
    });
    return total;
  }, [selectedSeats]);

  // Handle seat click
  const handleSeatClick = (seat) => {
    if (!seat || occupiedSeats.has(seat.id)) {
      console.log('Seat click blocked:', seat?.id);
      return;
    }

    console.log('Seat clicked:', seat.id, 'Current selected:', selectedSeats.size);

    setSelectedSeats(prevSelected => {
      const newSelectedSeats = new Map(prevSelected);

      if (newSelectedSeats.has(seat.id)) {
        // Deselect seat
        console.log('Deselecting seat:', seat.id);
        newSelectedSeats.delete(seat.id);

        // Remove passenger assignment
        setPassengerAssignments(prevAssignments => {
          const newAssignments = new Map(prevAssignments);
          for (const [passenger, seatId] of newAssignments.entries()) {
            if (seatId === seat.id) {
              newAssignments.delete(passenger);
            }
          }
          return newAssignments;
        });
      } else {
        // Select seat (limit to number of passengers)
        if (newSelectedSeats.size < passengers) {
          console.log('Selecting seat:', seat.id);
          newSelectedSeats.set(seat.id, seat);

          // Auto-assign to next unassigned passenger
          setPassengerAssignments(prevAssignments => {
            const newAssignments = new Map(prevAssignments);
            for (let i = 1; i <= passengers; i++) {
              if (!newAssignments.has(i)) {
                newAssignments.set(i, seat.id);
                break;
              }
            }
            return newAssignments;
          });
        } else {
          console.log('Cannot select more seats, limit reached');
        }
      }

      console.log('New selected seats count:', newSelectedSeats.size);

      if (onSeatsSelected) {
        onSeatsSelected(Array.from(newSelectedSeats.values()));
      }

      return newSelectedSeats;
    });
  };

  // Handle drag selection
  const handleMouseDown = (seat, event) => {
    if (!seat || occupiedSeats.has(seat.id)) return;

    console.log('Mouse down on seat:', seat.id);
    setIsDragging(true);
    setDragStart(seat.id);
    setHasDragged(false);
  };

  const handleMouseEnter = (seat) => {
    setHoveredSeat(seat?.id);

    if (isDragging && seat && !occupiedSeats.has(seat.id)) {
      setHasDragged(true);
      handleSeatClick(seat);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      console.log('Mouse up - dragging:', isDragging, 'hasDragged:', hasDragged);

      // If mouse down on a seat but didn't drag, it was a click
      if (isDragging && !hasDragged && dragStart) {
        console.log('Click detected on:', dragStart);
        // Find the seat object
        const seat = seatMap.flatMap(row => row.seats).find(s => s?.id === dragStart);
        if (seat) {
          handleSeatClick(seat);
        }
      }

      setIsDragging(false);
      setDragStart(null);
      setHasDragged(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, hasDragged, dragStart, seatMap]);

  // Get seat status
  const getSeatStatus = (seat) => {
    if (!seat) return 'empty';
    if (occupiedSeats.has(seat.id)) return 'occupied';
    if (selectedSeats.has(seat.id)) return 'selected';
    return 'available';
  };

  // Get seat styling
  const getSeatStyling = (seat) => {
    if (!seat) return '';

    const status = getSeatStatus(seat);
    const isHovered = hoveredSeat === seat.id;

    const baseClasses = 'relative w-8 h-8 md:w-10 md:h-10 rounded-lg cursor-pointer transition-all duration-200 transform select-none';

    if (status === 'occupied') {
      return `${baseClasses} bg-gray-400 cursor-not-allowed opacity-60`;
    }

    if (status === 'selected') {
      return `${baseClasses} ${SEAT_TYPES[seat.type].color} ring-2 ring-white scale-110 shadow-lg`;
    }

    if (status === 'available') {
      const hoverClasses = isHovered ? 'scale-105 shadow-md ring-2 ring-primary-300' : '';
      return `${baseClasses} ${SEAT_TYPES[seat.type].color} opacity-40 hover:opacity-70 ${hoverClasses}`;
    }

    return baseClasses;
  };

  // Get passenger number for seat
  const getPassengerNumber = (seatId) => {
    for (const [passenger, assignedSeatId] of passengerAssignments.entries()) {
      if (assignedSeatId === seatId) {
        return passenger;
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Select Your Seats</h2>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showLegend ? 'Hide' : 'Show'} Legend
          </button>
        </div>
        <p className="text-gray-600">
          Choose {passengers} seat{passengers > 1 ? 's' : ''} for your flight
        </p>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(SEAT_TYPES).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${value.color} ${key === 'OCCUPIED' ? 'opacity-60' : ''}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{value.label}</p>
                  {value.price > 0 && (
                    <p className="text-xs text-gray-600">+${value.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seat Map */}
      <div className="mb-6 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Aircraft nose */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-t-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>

          {/* Seat rows */}
          <div className="space-y-2">
            {seatMap.map((rowData, idx) => (
              <div key={rowData.row}>
                {/* Section header */}
                {(idx === 0 || seatMap[idx - 1].section !== rowData.section) && (
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-xs md:text-sm font-semibold text-gray-600 px-2">
                      {rowData.section}
                    </span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                )}

                {/* Row */}
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Row number */}
                  <div className="w-8 text-center">
                    <span className="text-xs md:text-sm font-medium text-gray-600">{rowData.row}</span>
                  </div>

                  {/* Seats */}
                  <div className="flex-1 flex items-center justify-center gap-1 md:gap-2">
                    {rowData.seats.map((seat, seatIdx) => {
                      if (seat === null) {
                        // Aisle gap
                        return <div key={`aisle-${seatIdx}`} className="w-8 md:w-12"></div>;
                      }

                      const status = getSeatStatus(seat);
                      const passengerNum = getPassengerNumber(seat.id);

                      return (
                        <div
                          key={seat.id}
                          className={getSeatStyling(seat)}
                          onMouseDown={(e) => handleMouseDown(seat, e)}
                          onMouseEnter={() => handleMouseEnter(seat)}
                          title={`${seat.id} - ${SEAT_TYPES[seat.type].label} ${SEAT_TYPES[seat.type].price > 0 ? `(+$${SEAT_TYPES[seat.type].price})` : ''}`}
                        >
                          {/* Seat icon */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {status === 'selected' && passengerNum && (
                              <span className="text-white text-xs md:text-sm font-bold">{passengerNum}</span>
                            )}
                            {status === 'occupied' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                            )}
                          </div>

                          {/* Exit row indicator */}
                          {rowData.isExitRow && (
                            <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
                              E
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row number (right side) */}
                  <div className="w-8 text-center">
                    <span className="text-xs md:text-sm font-medium text-gray-600">{rowData.row}</span>
                  </div>
                </div>

                {/* Exit row label */}
                {rowData.isExitRow && (
                  <div className="text-center mt-1">
                    <span className="text-xs text-green-600 font-medium">Emergency Exit</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Aircraft tail */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-8 bg-gray-300 rounded-b-lg"></div>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Selected seats list */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Selected Seats ({selectedSeats.size}/{passengers})
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedSeats.values()).map((seat) => {
                const passengerNum = getPassengerNumber(seat.id);
                return (
                  <div
                    key={seat.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg"
                  >
                    <span className="text-sm font-bold text-primary-900">{seat.id}</span>
                    <span className="text-xs text-primary-700">
                      {SEAT_TYPES[seat.type].label}
                    </span>
                    {passengerNum && (
                      <span className="text-xs bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        P{passengerNum}
                      </span>
                    )}
                    {SEAT_TYPES[seat.type].price > 0 && (
                      <span className="text-xs font-semibold text-primary-600">
                        +${SEAT_TYPES[seat.type].price}
                      </span>
                    )}
                    <button
                      onClick={() => handleSeatClick(seat)}
                      className="text-primary-600 hover:text-primary-800 ml-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              {selectedSeats.size === 0 && (
                <p className="text-sm text-gray-500 italic">No seats selected yet</p>
              )}
            </div>
          </div>

          {/* Total price */}
          <div className="md:text-right">
            <p className="text-sm text-gray-600 mb-1">Additional Seat Fees</p>
            <p className="text-3xl font-bold text-primary-600">
              ${totalPrice}
            </p>
            {selectedSeats.size > 0 && (
              <button
                onClick={() => {
                  setSelectedSeats(new Map());
                  setPassengerAssignments(new Map());
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Continue button */}
        {selectedSeats.size === passengers && (
          <div className="mt-6">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02]">
              Continue to Payment
            </button>
          </div>
        )}

        {selectedSeats.size > 0 && selectedSeats.size < passengers && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Please select {passengers - selectedSeats.size} more seat{passengers - selectedSeats.size > 1 ? 's' : ''} to continue
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click or drag to select multiple seats</li>
          <li>• Window seats are on the edges (A & F)</li>
          <li>• Exit row seats have extra legroom but restrictions may apply</li>
          <li>• Business class seats are in rows 1-4</li>
        </ul>
      </div>
    </div>
  );
};

export default SeatSelection;
