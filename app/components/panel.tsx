"use client";
import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

function Panel({
  post,
  setPost,
  includedPlaces,
  excludedPlaces,
  excludePlace,
  includePlace,
  handleSubmit,
  setIncludedPlaces,
  
  places,
  setPlaces,
  onSelectionChange,
  selectedPlaces,
}: {
  post: string;
  setPost: (post: string) => void;
  includedPlaces: any[];
  excludedPlaces: any[];
  excludePlace: (placeId: string) => void;
  includePlace: (placeId: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIncludedPlaces: () => void;
  places: any[];
  setPlaces: (places: any[]) => void;
  onSelectionChange: (places: Set<string>) => void;
  selectedPlaces: Set<string>;
}) {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [lastSelectedList, setLastSelectedList] = useState<'included' | 'excluded' | null>(null);

  const handleKeywordClick = (keyword: string) => {
    setPost(keyword);
    // Create a synthetic form event to trigger the search
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  const handleClearAll = () => {
    // Clear all included places by setting the list to empty
    setIncludedPlaces();
  };

  const handlePlaceClick = (placeId: string, index: number, event: React.MouseEvent, listType: 'included' | 'excluded') => {
    const newSelected = new Set(selectedPlaces);
    if (event.shiftKey && lastSelectedIndex !== null && lastSelectedList === listType) {
      // Shift + click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const currentList = listType === 'included' ? includedPlaces : excludedPlaces;
      for (let i = start; i <= end; i++) {
        newSelected.add(currentList[i].placeId);
      }
    } else if (event.metaKey || event.ctrlKey) {
      // Cmd/Ctrl + click: toggle selection
      if (newSelected.has(placeId)) {
        newSelected.delete(placeId);
      } else {
        newSelected.add(placeId);
      }
    } else {
      // Normal click: toggle single selection
      if (newSelected.has(placeId)) {
        newSelected.delete(placeId);
      } else {
        newSelected.clear();
        newSelected.add(placeId);
      }
    }
    onSelectionChange(newSelected);
    setLastSelectedIndex(index);
    setLastSelectedList(listType);
  };

  const handleExcludeSelected = () => {
    // Create a new array with all places, marking selected ones as excluded
    const updatedPlaces = places.map(place => 
      selectedPlaces.has(place.placeId) 
        ? { ...place, included: "false" }
        : place
    );
    setPlaces(updatedPlaces);
    onSelectionChange(new Set());
    setLastSelectedIndex(null);
    setLastSelectedList(null);
  };

  const handleIncludeSelected = () => {
    // Create a new array with all places, marking selected ones as included
    const updatedPlaces = places.map(place => 
      selectedPlaces.has(place.placeId) 
        ? { ...place, included: "true" }
        : place
    );
    setPlaces(updatedPlaces);
    onSelectionChange(new Set());
    setLastSelectedIndex(null);
    setLastSelectedList(null);
  };

  const isAnySelectedExcluded = Array.from(selectedPlaces).some(placeId => 
    excludedPlaces.some(place => place.placeId === placeId)
  );

  return (
    <div className="panel">
      <h1>Map</h1>
      <button 
        className="restart-button"
        type="button"
        onClick={handleClearAll}
      >
        Restart
      </button>
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            id="post"
            type="text"
            value={post}
            className="search_window"
            onChange={(e) => setPost(e.target.value)}
          />
          <button className="search_window_button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div className="keyword-buttons">
          <button
            type="button"
            className="keyword-button"
            onClick={() => handleKeywordClick("clothing")}
          >
            Clothing
          </button>
          <button
            type="button"
            className="keyword-button"
            onClick={() => handleKeywordClick("restaurants")}
          >
            Restaurants
          </button>
        </div>
      </form>
      <ul>
        {includedPlaces.map((m, index) => (
          <li key={m.placeId}>
            <div 
              className={`place ${selectedPlaces.has(m.placeId) ? 'selected' : ''}`}
              onClick={(e) => handlePlaceClick(m.placeId, index, e, 'included')}
            >
              {m.name}
            </div>
          </li>
        ))}
      </ul>
      <button 
        className="exclude-button"
        type="button"
        onClick={handleExcludeSelected}
        disabled={selectedPlaces.size === 0 || isAnySelectedExcluded}
      >
        Exclude Selected
      </button>
      <Collapsible
        overflowWhenOpen="scroll"
        trigger={<div className="excluded-label">Excluded</div>}
      >
        <ul>
          {excludedPlaces.map((m, index) => (
            <li key={m.placeId}>
              <div 
                className={`place removed ${selectedPlaces.has(m.placeId) ? 'selected' : ''}`}
                onClick={(e) => handlePlaceClick(m.placeId, index, e, 'excluded')}
              >
                {m.name}
              </div>
            </li>
          ))}
        </ul>
        <button 
          className="include-button"
          type="button"
          onClick={handleIncludeSelected}
          disabled={selectedPlaces.size === 0}
        >
          Add Back Selected
        </button>
      </Collapsible>
    </div>
  );
}

export default Panel;
