import {IDoctor} from "@/types/doctor.interface";
import {ISpecialty} from "@/types/specialties.interface";
import {useEffect, useState} from "react";

interface UseSpecialtySelectionProps {
  doctor?: IDoctor;
  isEdit: boolean;
  open: boolean;
}

interface UseSpecialtySelectionReturn {
  selectedSpecialtyIds: string[];
  removedSpecialtyIds: string[];
  currentSpecialtyId: string;
  setCurrentSpecialtyId: (id: string) => void;
  handleAddSpecialty: () => void;
  handleRemoveSpecialty: (id: string) => void;
  getNewSpecialties: () => string[];
  getAvailableSpecialties: (allSpecialties: ISpecialty[]) => ISpecialty[];
}

export const useSpecialtySelection = ({doctor, isEdit, open}: UseSpecialtySelectionProps): UseSpecialtySelectionReturn => {
  const getInitialSpecialtyIds = () => {
    if (isEdit && doctor?.doctorSpecialties) {
      const specialties = doctor?.doctorSpecialties?.map((ds) => ds?.specialtiesId || null);

      return specialties?.filter((id): id is string => !!id) || [];
    } else return [];
  };

  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>(getInitialSpecialtyIds);

  const [removedSpecialtyIds, setRemovedSpecialtyIds] = useState<string[]>([]);
  const [currentSpecialtyId, setCurrentSpecialtyId] = useState<string>("");

  const handleAddSpecialty = () => {
    if (currentSpecialtyId && !selectedSpecialtyIds.includes(currentSpecialtyId)) {
      setSelectedSpecialtyIds([...selectedSpecialtyIds, currentSpecialtyId]);
      
      // If in edit mode and we're re-adding a removed specialty
      if (removedSpecialtyIds.includes(currentSpecialtyId)) {
        setRemovedSpecialtyIds(removedSpecialtyIds.filter((id) => id !== currentSpecialtyId));
      }
      setCurrentSpecialtyId("");
    }
  };

  const handleRemoveSpecialty = (specialtyId: string) => {
    setSelectedSpecialtyIds(selectedSpecialtyIds.filter((id) => id !== specialtyId));

    // In edit mode, track removed specialties
    if (isEdit && doctor?.doctorSpecialties) {
      const wasOriginalSpecialty = doctor?.doctorSpecialties?.some((ds) => {
        const id = ds?.specialtiesId || null;
        return id === specialtyId;
      });
      if (wasOriginalSpecialty && !removedSpecialtyIds.includes(specialtyId)) setRemovedSpecialtyIds([...removedSpecialtyIds, specialtyId]);
    }
  };

  const getNewSpecialties = (): string[] => {
    if (!isEdit || !doctor?.doctorSpecialties) return selectedSpecialtyIds;

    const originalIds = doctor?.doctorSpecialties?.map((ds) => ds?.specialtiesId || null)?.filter((id): id is string => !!id) || [];

    return selectedSpecialtyIds.filter((id) => !originalIds.includes(id));
  };

  const getAvailableSpecialties = (allSpecialties: ISpecialty[]) => {
    return allSpecialties?.filter((s) => !selectedSpecialtyIds?.includes(s?.id)) || [];
  };

  useEffect(() => {
    if (open && doctor) {
      const initialIds = getInitialSpecialtyIds();
      setSelectedSpecialtyIds(initialIds);
      setRemovedSpecialtyIds([]);
      setCurrentSpecialtyId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, doctor?.id]);

  return {
    selectedSpecialtyIds,
    removedSpecialtyIds,
    currentSpecialtyId,
    setCurrentSpecialtyId,
    handleAddSpecialty,
    handleRemoveSpecialty,
    getNewSpecialties,
    getAvailableSpecialties,
  };
};
