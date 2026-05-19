import { useEffect, useState } from 'react';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';
import { normalizeList, normalizeSelectOptions } from './SearchableSelect.jsx';

export function usePetCatalogOptions(typeId) {
  const [types, setTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

  useEffect(() => {
    let isActive = true;
    setIsLoadingTypes(true);

    pawlyticsApi.getTipos()
      .then((response) => {
        if (isActive) {
          setTypes(normalizeList(response));
        }
      })
      .catch(() => {
        if (isActive) {
          setTypes([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingTypes(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!typeId) {
      setBreeds([]);
      return;
    }

    let isActive = true;
    setIsLoadingBreeds(true);

    pawlyticsApi.getRazasByTipo(typeId)
      .then((response) => {
        if (isActive) {
          setBreeds(normalizeList(response));
        }
      })
      .catch(() => {
        if (isActive) {
          setBreeds([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingBreeds(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [typeId]);

  return {
    typeOptions: normalizeSelectOptions(types),
    breedOptions: normalizeSelectOptions(breeds),
    isLoadingTypes,
    isLoadingBreeds,
  };
}
