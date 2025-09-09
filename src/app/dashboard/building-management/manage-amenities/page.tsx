"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wifi,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Dumbbell,
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Settings,
  X,
  Search,
  Building,
  Hash,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetBuildingAmenities } from "@/hooks/api/building-amenities";
import { useGetAmenitiesBookings } from "@/hooks/api/amenities-bookings";
import Link from "next/link";

export default function ManageAmenitiesPage() {
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");

  const { data: amenitiesData, isLoading, error } = useGetBuildingAmenities();
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useGetAmenitiesBookings();

  const getPastelColors = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
      'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
      'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
      'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200',
    ];
    return colors[index % colors.length];
  };

  const handleAmenityClick = (amenity: any) => {
    setSelectedAmenity(amenity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAmenity(null);
  };

  const filteredBookings = useMemo(() => {
    const bookings = bookingsData?.data?.data || bookingsData?.data || [];
    if (!Array.isArray(bookings)) return [];
    
    return bookings.filter((booking) => {
      const searchLower = bookingSearchQuery.toLowerCase();
      return (
        (booking.amenity_name?.toLowerCase() || '').includes(searchLower) ||
        (booking.unit_number?.toLowerCase() || '').includes(searchLower) ||
        (booking.booking_code?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [bookingsData, bookingSearchQuery]);

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="outline">-</Badge>;
    
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading amenities</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const amenities = (amenitiesData as any)?.data?.data || (amenitiesData as any)?.data || [];
  const totalAmenities = Array.isArray(amenities) ? amenities.length : 0;
  const requiresApproval = Array.isArray(amenities) ? amenities.filter(a => a.requires_approval === 1).length : 0;
  const noApprovalNeeded = Array.isArray(amenities) ? amenities.filter(a => a.requires_approval === 0).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 opacity-90"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard/building-management">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Building Management
                    </Button>
                  </Link>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                    Manage Amenities
                  </h1>
                  <p className="text-purple-100 text-lg animate-slideUp">
                    Manage building amenities and their bookings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white animate-pulseGlow">
                  {totalAmenities}
                </div>
                <div className="text-purple-100 text-lg">Total Amenities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp mt-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Amenities</p>
                  <p className="text-3xl font-bold">{totalAmenities}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Requires Approval</p>
                  <p className="text-3xl font-bold">{requiresApproval}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">No Approval Needed</p>
                  <p className="text-3xl font-bold">{noApprovalNeeded}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenities Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Building Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(amenities) && amenities.map((amenity, index) => (
              <Card
                key={amenity.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${getPastelColors(index)}`}
                onClick={() => handleAmenityClick(amenity)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                      <Dumbbell className="h-4 w-4 text-gray-600" />
                    </div>
                    <Badge 
                      variant={amenity.requires_approval ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {amenity.requires_approval ? "Approval" : "Open"}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-2">
                    {amenity.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {amenity.location_details}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {amenity.capacity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        AED {amenity.hourly_rate}/hour
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mt-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Amenity Bookings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage and review amenity booking requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bookings by amenity, unit, or code..."
                    value={bookingSearchQuery}
                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Amenity</TableHead>
                      <TableHead className="font-semibold text-gray-700">Unit</TableHead>
                      <TableHead className="font-semibold text-gray-700">Booking Code</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                      <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total Cost</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar className="h-8 w-8 text-gray-400" />
                            <p className="text-gray-500">
                              {bookingSearchQuery ? 'No bookings found matching your search' : 'No bookings available'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-purple-50/50 transition-colors duration-200"
                        >
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                <Dumbbell className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {booking.amenity_name || '-'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Hash className="h-4 w-4 mr-2 text-gray-400" />
                              {booking.unit_number || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.booking_code || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {booking.booking_date || '-'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                {booking.booking_time || '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.duration_hours ? `${booking.duration_hours}h` : '-'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              AED {booking.total_cost || '0.00'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(booking.status || null)}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {booking.requires_approval && (booking.status || '').toLowerCase() === 'pending' ? (
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                  Review
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenity Details Modal */}
        {isModalOpen && selectedAmenity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">{selectedAmenity.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.location_details}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Capacity</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.capacity} people</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hourly Rate</h4>
                    <p className="text-sm text-gray-600">AED {selectedAmenity.hourly_rate}/hour</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Maintenance Fee</h4>
                    <p className="text-sm text-gray-600">AED {selectedAmenity.maintenance_fee}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Booking Advance Days</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.booking_advance_days} days</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Duration Range</h4>
                    <p className="text-sm text-gray-600">
                      {selectedAmenity.min_booking_duration_hours}h - {selectedAmenity.max_booking_duration_hours}h
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requires Approval</h4>
                    <Badge variant={selectedAmenity.requires_approval ? "default" : "secondary"}>
                      {selectedAmenity.requires_approval ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                
                {selectedAmenity.rules_and_regulations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rules & Regulations</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.rules_and_regulations}</p>
                  </div>
                )}
                
                {selectedAmenity.equipment_included && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Equipment Included</h4>
                    <p className="text-sm text-gray-600">{selectedAmenity.equipment_included}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}