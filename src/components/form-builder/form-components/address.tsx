"use client";

import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type AddressComponentProps = {
  onChange?: (value: Address) => void;
};

export const AddressComponent: React.FC<AddressComponentProps> = ({ onChange }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const updateField = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onChange?.(newAddress);
  };

  const handlePlaceSelected = (place: any) => {
    const components: { [key: string]: string } = {};

    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) {
          components.street_number = component.long_name;
        }
        if (types.includes("route")) {
          components.route = component.long_name;
        }
        if (types.includes("locality")) {
          components.city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          components.state = component.long_name;
        }
        if (types.includes("country")) {
          components.country = component.long_name;
        }
        if (types.includes("postal_code")) {
          components.zip = component.long_name;
        }
      }
    }

    const fullStreet = `${components.street_number || ""} ${components.route || ""}`.trim();

    const newAddress: Address = {
      street: fullStreet,
      city: components.city || "",
      state: components.state || "",
      country: components.country || "",
      zip: components.zip || "",
    };

    setAddress(newAddress);
    onChange?.(newAddress);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="grid gap-1.5 col-span-full">
        <Label htmlFor="autocomplete">Search Address</Label>
        <Autocomplete
          apiKey={apiKey}
          onPlaceSelected={handlePlaceSelected}
          options={{ types: ["address"] }}
          className="border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          placeholder="Start typing your address..."
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="street">Street</Label>
        <Input
          id="street"
          value={address.street}
          onChange={(e) => updateField("street", e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={address.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={address.state}
          onChange={(e) => updateField("state", e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={address.country}
          onChange={(e) => updateField("country", e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="zip">ZIP</Label>
        <Input
          id="zip"
          value={address.zip}
          onChange={(e) => updateField("zip", e.target.value)}
        />
      </div>
    </div>
  );
};
