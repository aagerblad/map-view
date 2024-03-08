import { NextResponse } from "next/server";

function createQuery(params) {
  const url =
    `https://maps.googleapis.com/maps/api/place/photo?` +
    `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&`;
  const searchParams = new URLSearchParams(params);
  return url + searchParams.toString();
}

async function callAPI(query: RequestInfo | URL) {
  const res = await fetch(query);
  const resJson = await res.json();
  return resJson;
}

async function placesAPI(params) {
  const query = createQuery(params);

  var resultData = await callAPI(query);

  const data = {
    status: resultData.status,
    candidates: resultData.results.map((item) => {
      return {
        location: item.geometry.location,
        formattedAddress: item.formatted_address,
        icon: item.icon,
        name: item.name,
        placeId: item.place_id,
        types: item.types,
        photos: item.photos,
      };
    }),
    nextPageToken: resultData.next_page_token,
  };

  return data;
}

export async function GET(req: Request) {
  const params = {
    photo_reference: req.headers.get("photo_reference"),
    max_height: req.headers.get("max_height"),
  };

  const result = await placesAPI(params);

  // console.log("result:", result);

  return NextResponse.json({ results: result });
}
