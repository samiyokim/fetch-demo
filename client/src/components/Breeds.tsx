import React, { startTransition, useMemo, useState } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { matchSorter } from "match-sorter";
import { ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";

interface BreedsProps {
  selectedBreed: string;
  onBreedSelect: (breed: string) => void;
  allBreeds: string[];
}

const Breeds: React.FC<BreedsProps> = ({
  selectedBreed,
  onBreedSelect,
  allBreeds,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    if (!searchValue) return allBreeds;
    const matches = matchSorter(allBreeds, searchValue);
    if (selectedBreed && !matches.includes(selectedBreed)) {
      matches.push(selectedBreed);
    }
    return matches;
  }, [allBreeds, searchValue, selectedBreed]);

  return (
    <RadixSelect.Root
      value={selectedBreed}
      onValueChange={onBreedSelect}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        value={searchValue}
        setValue={(value) => {
          setSearchValue(value);
        }}
      >
        <RadixSelect.Trigger className="inline-flex items-center justify-between rounded px-4 py-2 text-sm gap-4 bg-white border border-gray-300 hover:bg-gray-50 min-w-[200px]">
          <RadixSelect.Value>
            {selectedBreed || "Select a breed"}
          </RadixSelect.Value>
          <RadixSelect.Icon>
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content 
            className="bg-white rounded-md shadow-lg w-[200px] p-2 z-50"
            position="popper"
            sideOffset={4}
          >
            <div className="flex items-center px-2 pb-2 border-b sticky top-0 bg-white">
              <MagnifyingGlassIcon className="text-gray-400" />
              <Combobox
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search breeds"
                className="w-full px-2 py-1 outline-none"
                onBlurCapture={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
              />
            </div>
            <ComboboxList className="mt-2 max-h-[200px] overflow-auto">
              {matches.map((breed) => (
                <RadixSelect.Item
                  key={breed}
                  value={breed}
                  asChild
                  className="relative flex items-center px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                >
                  <ComboboxItem>
                    <RadixSelect.ItemText>{breed}</RadixSelect.ItemText>
                  </ComboboxItem>
                </RadixSelect.Item>
              ))}
            </ComboboxList>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
};

export default Breeds;
