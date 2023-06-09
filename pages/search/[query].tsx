export async function getServerSideProps({ params }) {
  const q = params.query;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&query=${q}`;
  const res = await fetch(url);
  const resJson = await res.json();
  const data = {
    status: resJson.status,
    query: params.query,
    candidates: resJson.results.map((item) => {
      let image = "";

      // if ("photos" in item) {
      //   image = `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&maxwidth=400&photoreference=${item.photos[0].photo_reference}`;
      // }

      return {
        formatted_address: item.formatted_address,
        icon: item.icon,
        name: item.name,
        place_id: item.place_id,
        types: item.types,
        image: image,
      };
    }),
  };
  return { props: { data } };
}

export default function SearchPage({ data }) {
  return (
    <div className="m-20 w-full lg:w-6/12 mx-auto mb-20">
      <h1>{data.query}</h1>
      <hr className="my-10" />

      {data.status === "OK" && (
        <div className="list">
          {data.candidates.map((place, i) => (
            <div key={i}>{place.formatted_address}</div>
          ))}
        </div>
      )}
    </div>
  );
}
