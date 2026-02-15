import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import { t } from '../utils/translations';

// Constants
const INITIAL_PARTITIONS = 2;

/**
 * FractionVisualizer Component
 * Allows students to visually represent fractions by creating partitions
 * and selecting segments via drag or click
 * 
 * @param {number} numerator - The numerator of the fraction to represent
 * @param {number} denominator - The denominator of the fraction to represent
 * @param {string} language - Language code for translations
 * @param {function} onAnswerChange - Callback when selected segment count changes
 */
const FractionVisualizer = ({ numerator, denominator, language, onAnswerChange }) => {
  const [bars, setBars] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState(null);
  const [dragBarId, setDragBarId] = useState(null);
  const [dragStartSelected, setDragStartSelected] = useState(false);
  const hasDraggedRef = useRef(false);
  const onAnswerChangeRef = useRef(onAnswerChange);
  
  // Update ref when callback changes (avoid reset bug)
  useEffect(() => {
    onAnswerChangeRef.current = onAnswerChange;
  }, [onAnswerChange]);
  
  // Reset state when fraction changes (only depend on numerator/denominator)
  useEffect(() => {
    setBars([]);
    setSelectedSegments({});
    if (onAnswerChangeRef.current) {
      onAnswerChangeRef.current('0');
    }
  }, [numerator, denominator]);
  
  // Calculate total selected segments across all bars (memoized)
  const totalSelected = useMemo(() => {
    return Object.values(selectedSegments).reduce((sum, barSelections) => {
      return sum + Object.values(barSelections).filter(selected => selected).length;
    }, 0);
  }, [selectedSegments]);

  // Update parent when totalSelected changes
  useEffect(() => {
    if (onAnswerChangeRef.current) {
      onAnswerChangeRef.current(totalSelected.toString());
    }
  }, [totalSelected]);

  // Add a new bar with initial partitions (student must add more)
  const handleAddBar = useCallback(() => {
    setBars(prevBars => {
      const newBarId = prevBars.length > 0 ? Math.max(...prevBars.map(b => b.id)) + 1 : 1;
      const newBar = {
        id: newBarId,
        partitions: INITIAL_PARTITIONS, // Start with 2 partitions, student must add more
      };
      setSelectedSegments(prev => ({
        ...prev,
        [newBarId]: {},
      }));
      return [...prevBars, newBar];
    });
  }, []);

  // Add a partition to a bar (increase number of segments)
  const handleAddPartition = useCallback((barId) => {
    setBars(prevBars => prevBars.map(bar => {
      if (bar.id === barId) {
        // Don't allow more partitions than the denominator
        const newPartitions = Math.min(bar.partitions + 1, denominator);
        // Clear selections when partitions change
        setSelectedSegments(prev => ({
          ...prev,
          [barId]: {},
        }));
        return { ...bar, partitions: newPartitions };
      }
      return bar;
    }));
  }, [denominator]);

  // Check if a bar has the correct number of partitions
  const isBarComplete = useCallback((bar) => {
    return bar.partitions === denominator;
  }, [denominator]);

  // Handle mouse down - start drag selection (only if bar is complete)
  const handleMouseDown = useCallback((barId, segmentIndex, e) => {
    const bar = bars.find(b => b.id === barId);
    if (!bar || !isBarComplete(bar)) return;
    
    // Prevent default to avoid text selection
    e.preventDefault();
    
    // Reset drag tracking - start fresh
    hasDraggedRef.current = false;
    
    // Get current state of the starting segment (for drag behavior)
    const currentSelected = selectedSegments[barId]?.[segmentIndex] || false;
    
    // Set drag state but DON'T toggle yet - wait to see if it's a drag or click
    setIsDragging(true);
    setDragStartIndex(segmentIndex);
    setDragBarId(barId);
    setDragStartSelected(!currentSelected); // Store what the state should be
  }, [bars, selectedSegments, isBarComplete]);

  // Handle mouse move - select range while dragging
  const handleMouseMove = useCallback((barId, segmentIndex) => {
    if (!isDragging || barId !== dragBarId || dragStartIndex === null) return;
    
    // Mark that we've dragged (so click handler knows to ignore)
    hasDraggedRef.current = true;
    
    const bar = bars.find(b => b.id === barId);
    if (!bar || !isBarComplete(bar)) return;
    
    // Select all segments from dragStartIndex to current index
    setSelectedSegments(prev => {
      const barSelections = prev[barId] || {};
      const start = Math.min(dragStartIndex, segmentIndex);
      const end = Math.max(dragStartIndex, segmentIndex);
      const newSelections = { ...barSelections };
      
      // Use the state we determined at drag start
      for (let i = start; i <= end; i++) {
        newSelections[i] = dragStartSelected;
      }
      
      return {
        ...prev,
        [barId]: newSelections,
      };
    });
  }, [isDragging, dragStartIndex, dragBarId, dragStartSelected, bars, isBarComplete]);

  // Handle mouse up on a segment - end selection
  const handleMouseUp = useCallback((barId, segmentIndex) => {
    // If no drag occurred and we're on the same segment, treat as click and toggle
    if (!hasDraggedRef.current && dragBarId === barId && dragStartIndex === segmentIndex) {
      const bar = bars.find(b => b.id === barId);
      if (bar && isBarComplete(bar)) {
        setSelectedSegments(prev => {
          const barSelections = prev[barId] || {};
          return {
            ...prev,
            [barId]: {
              ...barSelections,
              [segmentIndex]: !barSelections[segmentIndex],
            },
          };
        });
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragStartIndex(null);
    setDragBarId(null);
    setDragStartSelected(false);
    hasDraggedRef.current = false;
  }, [dragBarId, dragStartIndex, bars, isBarComplete]);

  // Global mouse up handler for when mouse is released outside segments
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        // Just reset drag state, don't toggle (mouse was released outside)
        setIsDragging(false);
        setDragStartIndex(null);
        setDragBarId(null);
        setDragStartSelected(false);
        hasDraggedRef.current = false;
      }
    };
    
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);


  // Get selected count for a specific bar
  const getBarSelectedCount = useCallback((barId) => {
    const barSelections = selectedSegments[barId] || {};
    return Object.values(barSelections).filter(selected => selected).length;
  }, [selectedSegments]);

  return (
    <div className="w-full">
      {/* Simplified Header */}
      <div className="text-center mb-4">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {numerator}/{denominator}
        </div>
        <div className="text-lg text-gray-600 font-medium">
          {totalSelected}/{numerator}
        </div>
      </div>

      {/* Bars Container */}
      <div className="space-y-3 mb-4">
        {bars.map((bar) => {
          const barSelected = getBarSelectedCount(bar.id);
          const complete = isBarComplete(bar);
          
          return (
            <div key={bar.id} className="bg-white rounded-xl p-4 border-2 border-gray-200">
              {/* Segments - Draggable and Clickable */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: bar.partitions }).map((_, index) => {
                  const isSelected = selectedSegments[bar.id]?.[index] || false;
                  const canInteract = complete;
                  
                  return (
                    <div
                      key={index}
                      onMouseDown={(e) => canInteract && handleMouseDown(bar.id, index, e)}
                      onMouseEnter={() => canInteract && handleMouseMove(bar.id, index)}
                      onMouseUp={() => canInteract && handleMouseUp(bar.id, index)}
                      className={`flex-1 h-20 rounded-lg border-2 transition-all select-none ${
                        canInteract
                          ? isSelected
                            ? 'bg-gradient-to-br from-blue-400 to-pink-400 border-blue-500 shadow-lg cursor-pointer'
                            : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    />
                  );
                })}
              </div>
              
              {/* Add Partition Button - Show when incomplete */}
              {!complete && (
                <button
                  onClick={() => handleAddPartition(bar.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t(language, 'addPartition')}</span>
                  <span className="text-xs text-gray-500">
                    ({bar.partitions}/{denominator})
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Bar Button - Simplified */}
      {bars.length === 0 && (
        <button
          onClick={handleAddBar}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg"
        >
          <Plus className="w-6 h-6" />
          <span>{t(language, 'addBar')}</span>
        </button>
      )}

      {/* Add Another Bar (if needed for improper fractions) */}
      {bars.length > 0 && numerator > denominator && (
        <button
          onClick={handleAddBar}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t(language, 'addBar')}</span>
        </button>
      )}
    </div>
  );
};

export default FractionVisualizer;

