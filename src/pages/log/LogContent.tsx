import { IonButton, IonButtons, IonChip, IonIcon, IonRefresher, IonRefresherContent, IonSearchbar, IonSelect, IonSelectOption, IonSpinner } from "@ionic/react";
import { alertCircleOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline, downloadOutline, listOutline, locationOutline, personOutline, refreshOutline, timeOutline, trashOutline } from "ionicons/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import WelcomeText from "../../components/WelcomeText";
import { get_log_reports } from "../../apis/log_apis";
import { ReportData } from "../../types/logreports.types";
import '../Home.css'
import { useHistory } from "react-router";
  
// Status color mapping
const statusColors: Record<string, string> = {
    'Transit': 'bg-blue-500',
    'Received': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Cancelled': 'bg-red-500',
    'Processing': 'bg-purple-500'
};
  

const LogContent: React.FC = () => {

    const history = useHistory();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('');

    const goToDispatch = (itemId: string | undefined) => {
        history.push(`/dispatch/${itemId}`);
    };

    // Get unique values for filters
    const uniqueStatuses = useMemo(() => {
        const statuses = reports.map(r => r.Status).filter(Boolean);
        return [...new Set(statuses)];
    }, [reports]);

    const uniqueWasteTypes = useMemo(() => {
        const types = reports.map(r => r.Typeofwaste).filter(Boolean);
        return [...new Set(types)];
    }, [reports]);

    // Fetch reports
    const fetchReports = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        const facility = localStorage.getItem('facility') || '';

        if (!token) {
        setError('Authentication required');
        return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await get_log_reports(token, facility);
            if (data && Array.isArray(data)) {
                setReports(data);
                setFilteredReports(data);
            } else {
                setReports([]);
                setFilteredReports([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load reports';
            setError(message);
            setReports([]);
            setFilteredReports([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Apply filters and search
    useEffect(() => {
        let filtered = [...reports];

        // Apply search
        if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(report =>
            report.TrackingNumber?.toLowerCase().includes(term) ||
            report.facility?.toLowerCase().includes(term) ||
            report.NameofRider?.toLowerCase().includes(term) ||
            report.Destination?.toLowerCase().includes(term) ||
            report.state?.toLowerCase().includes(term)
        );
        }

        // Apply status filter
        if (statusFilter) {
        filtered = filtered.filter(report => report.Status === statusFilter);
        }

        // Apply waste type filter
        if (wasteTypeFilter) {
        filtered = filtered.filter(report => report.Typeofwaste === wasteTypeFilter);
        }

        setFilteredReports(filtered);
    }, [reports, searchTerm, statusFilter, wasteTypeFilter]);

    // Handle refresh
    const handleRefresh = async (event: CustomEvent) => {
        await fetchReports();
        event.detail.complete();
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setWasteTypeFilter('');
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status?: string) => {
        if (!status) return 'bg-gray-500';
        return statusColors[status] || 'bg-gray-500';
    };

    // Get status icon
    const getStatusIcon = (status?: string) => {
        switch (status) {
        case 'Delivered':
            return checkmarkCircleOutline;
        case 'Transit':
            return timeOutline;
        case 'Pending':
            return alertCircleOutline;
        default:
            return alertCircleOutline;
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-full mb-8">
            {/* header / welcome */}
            <div className="grid mb-0">
                <div>
                    <h2 className="text-2xl font-bold text-[#4b2571] flex items-center gap-2">
                        <span className="bg-indigo-100 text-[#4b2571] p-2 rounded-xl inline-flex">
                            <IonIcon icon={listOutline} className="text-xl"></IonIcon>
                        </span>
                        <span>Log</span>
                    </h2>
                    <WelcomeText />
                </div>

                <div className="flex items-center gap-1">
                    <div className="w-full flex items-center gap-0 mt-4">
                        <IonSearchbar
                            value={searchTerm}
                            onIonChange={(e) => setSearchTerm(e.detail.value || '')}
                            placeholder="type and click enter to filter"
                            className="custom-searchbar !border !border-gray-300 !rounded-2xl !max-h-12"
                        />
                    </div>                    
                </div>
                <div> 
                    <div className="flex items-center justify-between mt-4 mb-2">
                        {/* Status Filter */}
                        <IonSelect
                            value={statusFilter}
                            placeholder="Filter by Status"
                            onIonChange={(e) => setStatusFilter(e.detail.value)}
                            className="w-[48%] px-4 !border !border-gray-300 !rounded-2xl"
                        >
                            <IonSelectOption value="">All Statuses</IonSelectOption>
                            {uniqueStatuses.map(status => (
                            <IonSelectOption key={status} value={status}>
                                {status}
                            </IonSelectOption>
                            ))}
                        </IonSelect>
    
                        {/* Waste Type Filter */}
                        <IonSelect
                            value={wasteTypeFilter}
                            placeholder="Filter by Waste Type"
                            onIonChange={(e) => setWasteTypeFilter(e.detail.value)}
                            className="w-[48%] px-4 !border !border-gray-300 !rounded-2xl"
                        >
                            <IonSelectOption value="">All Types</IonSelectOption>
                            {uniqueWasteTypes.map(type => (
                            <IonSelectOption key={type} value={type}>
                                {type}
                            </IonSelectOption>
                            ))}
                        </IonSelect>
                    </div>
    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0">
                            <IonButtons slot="end">
                                <IonButton onClick={fetchReports}>
                                    <IonIcon icon={refreshOutline} className="hidden" />
                                    <span className="text-blue-600 text-xs">refresh</span>
                                </IonButton>
                            </IonButtons>
                            {(searchTerm || statusFilter || wasteTypeFilter) && (
                            <IonButtons slot="end">
                                <IonButton onClick={clearFilters}>
                                    <IonIcon icon={closeCircleOutline} className="hidden text-red-600" />
                                    <span className="text-red-600 text-xs">clear filter</span>
                                </IonButton>
                            </IonButtons>
                            )}
                        </div>
                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                        Showing {filteredReports.length} of {reports.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pull to Refresh */}
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent />
            </IonRefresher>
    
            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                <IonSpinner name="crescent" className="text-primary-600" />
                <p className="mt-4 text-gray-600">Loading log...</p>
                </div>
            )}
    
            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center h-64 px-4">
                <IonIcon icon={alertCircleOutline} className="text-6xl text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reports</h3>
                <p className="text-gray-600 text-center">{error}</p>
                <IonButton className="mt-4" onClick={fetchReports}>
                    Try Again
                </IonButton>
                </div>
            )}
    
            {/* Filters Section */}
            {!loading && !error && (
                <>    
                {/* Reports List */}
                <div className="space-y-4">
                    {filteredReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <IonIcon icon={trashOutline} className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700">No reports found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters</p>
                    </div>
                    ) : (
                    filteredReports.map((report, index) => (
                        <div
                        key={report.form_report_id || index}
                        className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                        <div className="p-4">
                            {/* Header with Status */}
                            <div className="mb-1">
                                <div>
                                    <div className="w-full flex items-center justify-between">
                                        <span className="text-xl font-extralight text-gray-800">
                                            #{report.TrackingNumber || 'N/A'}
                                        </span>
                                        <IonChip color="primary" className="text-xs">
                                            <IonIcon icon={trashOutline} />
                                            <span className="ml-1">{report.Typeofwaste || 'N/A'}</span>
                                        </IonChip>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-purple-800 to-transparent"></div>
                            {/* Facility Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 my-1">
                                {/*<div className="flex items-start space-x-2">
                                    <IonIcon icon={locationOutline} className="text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                    <p className="text-xs text-gray-500">Facility</p>
                                    <p className="text-sm text-gray-700">{report.facility || 'N/A'}</p>
                                    <p className="text-xs text-gray-400">
                                        {report.state}, {report.lga}
                                    </p>
                                    </div>
                                </div>*/}
                                {/*<div className="w-full flex items-start justify-between">
                                    <div className="flex items-start space-x-2">
                                        <IonIcon icon={personOutline} className="text-gray-400 mt-1 flex-shrink-0" />
                                        <div>
                                        <p className="text-xs text-gray-500">Rider</p>
                                        <p className="text-sm text-gray-700">{report.NameofRider || 'N/A'}</p>
                                        <p className="text-xs text-gray-400">{report.PhonenumberofRider || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <IonIcon icon={calendarOutline} className="text-gray-400 mt-1 flex-shrink-0" />
                                        <div>
                                        <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(report.DateofPickUp)}
                                        </p>
                                        </div>
                                    </div>
                                </div>*/}
                            </div>
    
                            {/* Waste Info */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <IonChip className="text-xs">
                                    <span>Source: {report.facility || 'N/A'} {report.state && report.state}, {report.lga && report.lga}</span>
                                </IonChip>
                                <IonChip className="text-xs">
                                    <span>Destination: {report.Destination || 'N/A'}</span>
                                </IonChip>
                            </div>
                            <div className="w-full flex items-center justify-end gap-4">  
                            {
                                (!report.Destination || report.Destination === null || report.Destination === "") &&
                                <span 
                                    className="text-blue-500 text-xs uppercase cursor-pointer"
                                    onClick={() => goToDispatch(report.form_report_id)}
                                >
                                    click to dispatch
                                </span>
                            }
                                <div className={`px-3 py-1 rounded-full ${getStatusColor(report.Status)} text-white text-xs font-medium`}>
                                    {report.Status || 'Unknown'}
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="hidden justify-end gap-2 pt-3 border-t border-gray-100">
                            <IonButton fill="clear" size="small" className="text-primary-600">
                                View Details
                            </IonButton>
                            <IonButton fill="clear" size="small" className="text-primary-600">
                                <IonIcon icon={downloadOutline} className="mr-1" />
                                Download
                            </IonButton>
                            </div>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                </>
            )}
        </div>
    );
}

export default LogContent