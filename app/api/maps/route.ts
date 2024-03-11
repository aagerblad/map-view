import { NextResponse } from "next/server";
import { text } from "stream/consumers";

const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

async function callAPI(body: string) {
  const url: string = "https://places.googleapis.com/v1/places:searchText";
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  if (googleMapsKey) {
    requestHeaders.set("X-Goog-Api-Key", googleMapsKey);
  }

  const fieldMask = [
    "places.name",
    "places.display_name",
    "places.location",
    "places.websiteUri",
    "places.photos",
    "places.rating",
    "places.primaryType",
  ].join(",");

  requestHeaders.set("X-Goog-FieldMask", fieldMask);
  const res = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: body,
  });

  const resJson = await res.json();
  return resJson;
}

async function callPhotoAPI(photoName: string) {
  const url: string =
    `https://places.googleapis.com/v1/${photoName}/media?` +
    `maxHeightPx=200&maxWidthPx=200` +
    `&skipHttpRedirect=true` +
    `&key=${googleMapsKey}`;

  const res = await fetch(url);
  const resJson = await res.json();
  return resJson;
}

async function generateResults(res: any) {
  const data = await Promise.all(
    res.places.map(async (item) => {
      const photoName = item.photos[0].name;
      const photoRes = await callPhotoAPI(photoName);

      return {
        location: item.location,
        name: item.displayName.text,
        placeId: item.name,
        photos: item.photos,
        photoUri: photoRes.photoUri,
      };
    })
  );

  return data;
}

async function mapsAPI(params: string) {
  // await new Promise((r) => setTimeout(r, 2000));
  var newRes = await callAPI(params);

  const data = await generateResults(newRes);

  return { candidates: data };
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
