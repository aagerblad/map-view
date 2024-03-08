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

  // post: string;
  // setPost: (post: string) => void;
  // includedPlaces: any[];
  // removedPlaces: any[];
  // excludePlace: (placeId: string) => void;
  // includePlace: (placeId: string) => void;
  // handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="panel">
      <h1>Map</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="post"
            type="text"
            value={post}
            className="search_window"
            onChange={(e) => setPost(e.target.value)}
          />
          <button className="search_window_button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
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
        trigger={<div className="remove_label">Removed</div>}
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
