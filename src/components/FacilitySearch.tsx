import { IonIcon, IonInput, IonSpinner } from "@ionic/react";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { checkmarkCircleOutline, closeOutline, chevronDownOutline } from "ionicons/icons";
import { SearchFilterProps } from "../types/auth.types";

const FacilitySearch: React.FC<SearchFilterProps> = ({ facility, setFacility }) => {
    
    const token = localStorage.getItem('authToken'); 
    const baseUrl = 'https://admintools.apin.org.ng/dctms/backend/public';
    
    const [filter, setFilter] = useState(facility || '');
    const [options, setOptions] = useState<{ title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Combobox specific state
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null); // Ref for click-outside detection

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the dropdown when clearing
        setFilter('');
        setFacility('');
        setIsOpen(false);
    };

    // Fetch facilities on mount
    useEffect(() => {
        const fetchFacilities = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/api/cidlink-facilities`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch facilities');

                const data = await response.json();
                setOptions(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, [token]);

    // Handle clicking outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = useMemo(() => {
        if (!filter.trim() || facility === filter) {
            // If the input matches the selected facility exactly, show all options
            return options;
        }

        const searchLower = filter.toLowerCase().trim();
        
        return options.filter((option) => 
            option.title.toLowerCase().includes(searchLower)
        );
    }, [options, filter, facility]);

    return (
        <div className="!relative !w-full !my-4" ref={wrapperRef}>
            {/* The Input Area */}
            <div className="!flex !items-center !justify-between relative">
                <IonInput
                    type="text"
                    value={filter} 
                    onIonInput={(e) => {
                        setFilter(e.detail.value || '');
                        setIsOpen(true); // Open on typing
                    }} 
                    onIonFocus={() => setIsOpen(true)} // Open on focus
                    placeholder="Search & select facility..."
                    className="!pl-4 !h-10 !px-4 !pr-12 !bg-gray-900 !border !border-gray-700 !rounded-lg"
                    mode="md"
                />
                
                {/* Icons placed absolutely inside the input area */}
                <div className="absolute right-2 flex items-center gap-1 z-10">
                    {facility && (
                        <IonIcon 
                            icon={closeOutline} 
                            className="!text-red-500 cursor-pointer text-xl" 
                            onClick={clearSelection}
                        />
                    )}
                    <IonIcon 
                        icon={chevronDownOutline} 
                        className="!text-gray-400 cursor-pointer text-xl"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>
            
            {/* The Dropdown Overlay */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 border border-gray-700 bg-gray-900 rounded-lg max-h-[80vh] overflow-y-auto shadow-lg">
                    {loading ? (
                        <div className="flex justify-center items-center py-4">
                            <IonSpinner name="crescent" />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-sm p-4">{error}</div>
                    ) : filteredOptions && filteredOptions.length > 0 ? (
                        filteredOptions.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="px-4 py-2 border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                        setFacility(item.title);
                                        setFilter(item.title);
                                        setIsOpen(false); // Close dropdown on select
                                    }}
                                >
                                    <span className="text-sm truncate">{item.title}</span>
                                    
                                    {facility === item.title && (
                                        <IonIcon
                                            icon={checkmarkCircleOutline}
                                            size="small"
                                            className="text-green-400 flex-shrink-0 ml-2"
                                        />
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 p-4 text-sm">
                            No facilities found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacilitySearch;