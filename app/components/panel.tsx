"use client";
import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Panel({
  post,
  setPost,
  includedPlaces,
  excludedPlaces,
  excludePlace,
  includePlace,
  handleSubmit,
  setIncludedPlaces,
}: {
  post: string;
  setPost: (post: string) => void;
  includedPlaces: any[];
  excludedPlaces: any[];
  excludePlace: (placeId: string) => void;
  includePlace: (placeId: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIncludedPlaces: (places: any[]) => void;
}) {
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
    setIncludedPlaces([]);
  };

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
        {includedPlaces.map((m) => (
          <li key={m.placeId}>
            <div className="place">
              <button
                className="place_button"
                onClick={() => excludePlace(m.placeId)}
              >
                X
              </button>
              {m.name}
            </div>
          </li>
        ))}
      </ul>
      <Collapsible
        overflowWhenOpen="scroll"
        trigger={<div className="excluded-label">Excluded</div>}
      >
        <ul>
          {excludedPlaces.map((m) => (
            <li key={m.placeId}>
              <div className="place removed">
                <button
                  className="place_button"
                  onClick={() => includePlace(m.placeId)}
                >
                  X
                </button>
                {m.name}
              </div>
            </li>
          ))}
        </ul>
      </Collapsible>
    </div>
  );
}

export default Panel;
