"use client";
import React from "react";
import { createRoot } from "react-dom/client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string;

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      zoom={3}
      center={{ lat: 22.54992, lng: 0 }}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    />
  </APIProvider>
);

export default function Page() {
  return (
    <div id="test_app">
      <App />
    </div>
  );
}
