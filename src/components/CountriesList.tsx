import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

// GraphQL sorgusu
const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      continent {
        name
      }
    }
  }
`;

interface Country {
  code: string;
  name: string;
  continent: {
    name: string;
  };
}

const CountriesList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_COUNTRIES);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState<string>("");
  const [group, setGroup] = useState<string>("");

  useEffect(() => {
    if (!data) return;

    let countries: Country[] = data.countries;

    if (filter) {
      countries = countries.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    setFilteredCountries(countries);
  }, [data, filter, group]);

  useEffect(() => {
    if (filteredCountries.length > 0) {
      const indexToSelect =
        filteredCountries.length >= 10 ? 9 : filteredCountries.length - 1;
      setSelectedCountryCode(filteredCountries[indexToSelect].code);
    }
  }, [filteredCountries]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Filter by name..."
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <select
          onChange={(e) => setGroup(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Group by...</option>
          <option value="continent">Continent</option>
        </select>
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {filteredCountries.map((country) => (
          <li
            key={country.code}
            style={{
              padding: "10px",
              margin: "5px 0",
              backgroundColor:
                selectedCountryCode === country.code ? "#ADD8E6" : "#f0f0f0",
              cursor: "pointer",
              borderRadius: "5px",
              border:
                selectedCountryCode === country.code
                  ? "2px solid #007BFF"
                  : "1px solid #ccc",
            }}
            onClick={() => setSelectedCountryCode(country.code)}
          >
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesList;
