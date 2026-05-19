import { useEffect, useState } from 'react';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';

export function useClinicalDetails(petId) {
  const [clinicalDetails, setClinicalDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Carga el detalle clinico relacional asociado a la misma mascota del historial Mongo.
  useEffect(() => {
    if (!petId) {
      setClinicalDetails([]);
      setIsLoadingDetails(false);
      return;
    }

    let isActive = true;
    setIsLoadingDetails(true);

    pawlyticsApi.getClinicalDetailsByPet(petId)
      .then((details) => {
        if (isActive) {
          setClinicalDetails(Array.isArray(details) ? details : []);
        }
      })
      .catch(() => {
        if (isActive) {
          setClinicalDetails([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDetails(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [petId]);

  return {
    clinicalDetails,
    isLoadingDetails,
  };
}
