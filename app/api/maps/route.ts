import { NextResponse } from "next/server";
import { text } from "stream/consumers";

const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

async function callNewAPI(body: string) {
  const url: string = "https://places.googleapis.com/v1/places:searchText";
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  if (googleMapsKey) {
    requestHeaders.set("X-Goog-Api-Key", googleMapsKey);
  }
  requestHeaders.set(
    "X-Goog-FieldMask",
    "places.name,places.display_name,places.location,places.websiteUri,places.photos,places.rating,places.primaryType"
  );
  const res = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: body,
  });

  const resJson = await res.json();
  return resJson;
}

async function mapsAPI(params: string) {
  var newRes = await callNewAPI(params);

  const data = {
    status: newRes.status,
    candidates: newRes.places.map((item) => {
      return {
        location: item.location,
        name: item.displayName.text,
        placeId: item.name,
        photos: item.photos,
        // photo: photoResult,
      };
    }),
  };

  return data;
}

export async function GET(req: Request) {
  const body = JSON.stringify({
    textQuery: req.headers.get("searchQuery"),
    languageCode: "en",
    locationBias: {
      circle: {
        // center: req.headers.get("location"),
        center: {
          latitude: parseFloat(req.headers.get("latitude") as string),
          longitude: parseFloat(req.headers.get("longitude") as string),
        },
        radius: 1000,
      },
    },
  });

  const result = await mapsAPI(body);

  return NextResponse.json({ results: result });
}
