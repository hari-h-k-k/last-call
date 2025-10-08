import { useState, useEffect, useRef } from 'react';

export default function DualRangeSlider({ min = 0, max = 10000000, step = 1000, minValue, maxValue, onChange }) {
  const [minVal, setMinVal] = useState(minValue || min);
  const [maxVal, setMaxVal] = useState(maxValue || max);
  const minValRef = useRef(minValue || min);
  const maxValRef = useRef(maxValue || max);
  const range = useRef(null);

  const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, min, max]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => {
          const value = Math.min(Number(e.target.value), maxVal - step);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-30"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => {
          const value = Math.max(Number(e.target.value), minVal + step);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-40"
      />

      <div className="relative">
        <div className="absolute w-full h-2 bg-slate-600 rounded-lg z-10"></div>
        <div ref={range} className="absolute h-2 bg-amber-500 rounded-lg z-20"></div>
      </div>

      <style jsx>{`
        .thumb {
          pointer-events: none;
        }
        .thumb::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #1e293b;
          pointer-events: all;
          position: relative;
        }
        .thumb::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #1e293b;
          pointer-events: all;
        }
      `}</style>
    </div>
  );
}