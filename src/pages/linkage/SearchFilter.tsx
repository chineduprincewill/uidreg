import { IonIcon, IonInput } from "@ionic/react"
import React, { useMemo, useState } from "react"
import { facilities } from "../dashboard/data/dasbhoard";
import { checkmarkCircleOutline } from "ionicons/icons";
import { SearchFilterProps } from "../../types/auth.types";


const SearchFilter: React.FC<SearchFilterProps> = ({ facility, setFacility }) => {

    const [filter, setFilter] = useState('');
    //const [selectedFacility, setSelectedFacility] = useState('');

    const options = facilities;

    const customFilter = (option: any, searchTerm: string): boolean => {
        const search = searchTerm.toLowerCase().trim();
        const words = search.split(' ');

        // Search in label, value, group, and metadata
        const searchableText = [
            option.state,
            option.lga,
            option.facility,
        ].join(' ').toLowerCase();

        // Check if all words match
        return words.every(word => searchableText.includes(word));
    };

    const filteredOptions = useMemo(() => {
        if (!filter.trim()) {
            return options;
        }

        return options.filter((option) => {
            // Use custom filter function if provided
            if (customFilter) {
                return customFilter(option, filter);
            }

            // Default filter: search in label, value, and group
            const searchLower = filter.toLowerCase().trim();
            const stateMatch = option.state.toLowerCase().includes(searchLower);
            const lgaMatch = option.lga.toLowerCase().includes(searchLower);
            const facilityMatch = option.facility?.toLowerCase().includes(searchLower);

            return stateMatch || lgaMatch || facilityMatch;
        });
    }, [options, filter, customFilter]);
    //console.log(selectedFacility);

    return (
        <div className="!grid !gap-4">
            <IonInput
                type="text"
                value={facility ? facility : filter}
                onIonChange={(e) => setFilter(e.detail.value || '')}
                placeholder="Search & select facility..."
                className="!pl-4 !h-8 !px-4"
                mode="md"
            />
            <div className="border border-gray-800 p-2 rounded-lg h-48 overflow-y-scroll">
            {
                filteredOptions && filteredOptions.length > 0 && filteredOptions.map((item, index) => {
                    return <div 
                        key={index} className="p-2 border-b border-gray-800 flex justify-between items-center"
                        onClick={() => setFacility(item.facility+', '+item.lga+', '+item.state)}
                    >
                        <div className="grid gap-0">
                            <span>{item.facility}</span>
                            <span className="text-xs text-gray-500">{item.lga}, {item.state}</span>
                        </div>
                    {
                        facility === item.facility+', '+item.lga+', '+item.state &&
                        <IonIcon icon={checkmarkCircleOutline} size="large" className="text-green-400" />
                    }
                    </div>
                })
            }
            </div>
        </div>
    )

}

export default SearchFilter