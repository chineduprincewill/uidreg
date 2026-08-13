import React, { useState, useMemo } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonCheckbox,
    IonRadio,
    IonRadioGroup,
    IonChip,
    IonSpinner,
} from '@ionic/react';
import { closeOutline, searchOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface Option {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
    icon?: string;
    metadata?: any;
}

interface SearchableSelectModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onSelect: (value: string | string[]) => void;
    options: Option[];
    multiple?: boolean;
    selectedValue?: string | string[];
    title?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    groupBy?: string;
    allowCustom?: boolean;
    customLabel?: string;
    loading?: boolean;
    filterFunction?: (option: Option, searchTerm: string) => boolean;
}

const SearchableSelectModal: React.FC<SearchableSelectModalProps> = ({
    isOpen,
    onDismiss,
    onSelect,
    options,
    multiple = false,
    selectedValue = multiple ? [] : '',
    title = 'Select Option',
    placeholder = 'Select an option...',
    searchPlaceholder = 'Search...',
    groupBy = 'group',
    allowCustom = false,
    customLabel = 'Add custom value',
    loading = false,
    filterFunction,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState<string | string[]>(selectedValue);

    // Advanced filter function
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) {
            return options;
        }

        return options.filter((option) => {
            // Use custom filter function if provided
            if (filterFunction) {
                return filterFunction(option, searchTerm);
            }

            // Default filter: search in label, value, and group
            const searchLower = searchTerm.toLowerCase().trim();
            const labelMatch = option.label.toLowerCase().includes(searchLower);
            const valueMatch = option.value.toLowerCase().includes(searchLower);
            const groupMatch = option.group?.toLowerCase().includes(searchLower) || false;
            const metadataMatch = option.metadata
                ? JSON.stringify(option.metadata).toLowerCase().includes(searchLower)
                : false;

            return labelMatch || valueMatch || groupMatch || metadataMatch;
        });
    }, [options, searchTerm, filterFunction]);

    // Group filtered options
    const groupedOptions = useMemo(() => {
        if (!groupBy) {
            return [{ groupName: '', items: filteredOptions }];
        }

        const groups: Record<string, Option[]> = {};
        filteredOptions.forEach((option) => {
            const key = option[groupBy as keyof Option] as string || 'Uncategorized';
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(option);
        });

        return Object.entries(groups).map(([groupName, items]) => ({
            groupName,
            items,
        }));
    }, [filteredOptions, groupBy]);

    const handleSelect = (value: string) => {
        if (multiple) {
            const current = Array.isArray(selected) ? selected : [];
            const index = current.indexOf(value);
            if (index > -1) {
                setSelected(current.filter((v) => v !== value));
            } else {
                setSelected([...current, value]);
            }
        } else {
            setSelected(value);
        }
    };

    const handleConfirm = () => {
        onSelect(selected);
        onDismiss();
        setSearchTerm('');
    };

    const handleClear = () => {
        if (multiple) {
            setSelected([]);
        } else {
            setSelected('');
        }
    };

    const isSelected = (value: string): boolean => {
        if (multiple) {
            return Array.isArray(selected) && selected.includes(value);
        }
        return selected === value;
    };

    // Custom value option
    const showCustomOption = allowCustom && searchTerm.trim() && !options.some(
        (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase().trim()
    );

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDismiss} initialBreakpoint={0.9} breakpoints={[0, 0.9]}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDismiss}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchTerm}
                        onIonChange={(e) => setSearchTerm(e.detail.value || '')}
                        placeholder={searchPlaceholder}
                        animated
                        showClearButton="always"
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Selected chips for multiple */}
                {multiple && Array.isArray(selected) && selected.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selected.map((value) => {
                            const option = options.find((o) => o.value === value);
                            return option ? (
                                <IonChip key={value} color="primary">
                                    <IonLabel>{option.label}</IonLabel>
                                    <IonIcon
                                        icon={closeOutline}
                                        onClick={() => handleSelect(value)}
                                    />
                                </IonChip>
                            ) : null;
                        })}
                        <IonButton fill="clear" size="small" onClick={handleClear}>
                            Clear all
                        </IonButton>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <IonSpinner name="crescent" />
                    </div>
                ) : filteredOptions.length === 0 && !showCustomOption ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No options found</p>
                    </div>
                ) : (
                    <>
                        {groupedOptions.map(({ groupName, items }) => (
                            <div key={groupName}>
                                {groupName && (
                                    <h4 className="text-sm font-semibold text-gray-500 px-4 py-2 bg-gray-100 rounded">
                                        {groupName}
                                    </h4>
                                )}
                                <IonList>
                                    {items.map((option) => (
                                        <IonItem
                                            key={option.value}
                                            button
                                            onClick={() => handleSelect(option.value)}
                                            disabled={option.disabled}
                                            className={option.disabled ? 'opacity-50' : ''}
                                        >
                                            {multiple ? (
                                                <IonCheckbox
                                                    slot="start"
                                                    checked={isSelected(option.value)}
                                                    disabled={option.disabled}
                                                />
                                            ) : (
                                                <IonRadio
                                                    slot="start"
                                                    value={option.value}
                                                    disabled={option.disabled}
                                                />
                                            )}
                                            <IonLabel>
                                                <h2>{option.label}</h2>
                                                {option.group && (
                                                    <p className="text-xs text-gray-500">
                                                        {option.group}
                                                    </p>
                                                )}
                                                {option.metadata && (
                                                    <p className="text-xs text-gray-400">
                                                        {JSON.stringify(option.metadata)}
                                                    </p>
                                                )}
                                            </IonLabel>
                                            {isSelected(option.value) && (
                                                <IonIcon
                                                    slot="end"
                                                    icon={checkmarkCircleOutline}
                                                    color="success"
                                                />
                                            )}
                                        </IonItem>
                                    ))}
                                </IonList>
                            </div>
                        ))}

                        {/* Custom option */}
                        {showCustomOption && (
                            <IonList>
                                <IonItem button onClick={() => handleSelect(searchTerm.trim())}>
                                    <IonLabel>
                                        <span className="text-primary">
                                            <IonIcon icon={searchOutline} /> Add {searchTerm.trim()}
                                        </span>
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                        )}
                    </>
                )}
            </IonContent>

            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={handleClear} color="medium">
                        Clear
                    </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                    <IonButton onClick={handleConfirm} color="primary">
                        Confirm
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonModal>
    );
};

export default SearchableSelectModal;