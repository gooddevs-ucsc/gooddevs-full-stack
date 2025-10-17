import countryList from 'country-list';

export const getCountryOptions = () => {
  return [
    { label: 'Select a country', value: '' },
    ...countryList
      .getData()
      .map((country) => ({
        label: country.name,
        value: country.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
};
