"use client";
import { useCountryData } from "@/context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Input from "../input";

type ISearchPropsType = {
  isClassName?: boolean;
};
const GooglePlaceSearch: React.FC<ISearchPropsType> = ({ isClassName }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsQuery = searchParams.get("query");
  let autoCompleteRef = useRef(null);
  const [query, setQuery] = useState(searchParamsQuery ?? "");
  const { addPlace, coordinate, setCoordinate, setValue } = useCountryData();
  const updateURLFromSearchQuery = (query: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", query);
    router.push(`?${params.toString()}`);
  };
  const options = {
    fields: ["formatted_address", "geometry", "name", "address_components"],
    strictBounds: false,
  };
  let autoComplete: any;
  const loadGoogleAutoComplete = async (autoCompleteRef: any) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      options
    );
    autoComplete.addListener("place_changed", () => {
      const place = autoComplete.getPlace();
      if (!place?.geometry || !place?.geometry.location) {
        window.alert("No details available for input:'" + place?.name + "'");
        return;
      } else {
        setCoordinate({
          ...coordinate,
          lat: place?.geometry.location.lat(),
          lng: place?.geometry.location.lng(),
        });
        addPlace(place?.formatted_address);
        place?.formatted_address;
        setValue(place?.formatted_address);
        updateURLFromSearchQuery(place?.address_components[0]?.long_name);
      }
    });
  };
  useEffect(() => {
    if (typeof window !== undefined && !window.google) {
      setTimeout(() => {
        loadGoogleAutoComplete(autoCompleteRef);
      }, 1000);
    }
    loadGoogleAutoComplete(autoCompleteRef);
  }, []);

  return (
    <div className={`${isClassName ? "pl-8 w-full" : "mt-4"} `}>
      <Input
        type="search"
        ref={autoCompleteRef}
        onChange={(event) => {
          setQuery(autoComplete?.current?.value);

          console.log("handling change from here -- ....");
        }}
        value={query}
        placeholder="Search new place"
      />
    </div>
  );
};

export default GooglePlaceSearch;
