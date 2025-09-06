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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  ArrowLeft,
  Mail,
  Phone,
  Home,
  Star,
  User,
  Stethoscope,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetResidentDirectory } from "@/hooks/api/resident-directory";
import Link from "next/link";

export default function ResidentDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDoctorsOnly, setViewDoctorsOnly] = useState(false);
  const itemsPerPage = 10;

  const { data: residentsData, isLoading, error } = useGetResidentDirectory();

  const filteredResidents = useMemo(() => {
    if (!residentsData?.data) return [];
    
    return residentsData.data.filter((resident) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        resident.first_name.toLowerCase().includes(searchLower) ||
        resident.last_name.toLowerCase().includes(searchLower) ||
        resident.email.toLowerCase().includes(searchLower) ||
        resident.phone.toLowerCase().includes(searchLower) ||
        resident.unit_number.toLowerCase().includes(searchLower) ||
        (resident.specialisation && resident.specialisation.toLowerCase().includes(searchLower))
      );
      
      const isDoctor = resident.specialisation && resident.specialisation.trim() !== '';
      const matchesDoctorFilter = !viewDoctorsOnly || isDoctor;
      
      return matchesSearch && matchesDoctorFilter;
    });
  }, [residentsData?.data, searchQuery, viewDoctorsOnly]);

  const paginatedResidents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResidents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResidents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">Error loading residents</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/building-management" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Building Management
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold tracking-tight animate-fadeIn">
          Resident Directory
        </h1>
        <p className="text-purple-100 mt-1.5 animate-slideUp">
          View and manage building residents, their contact information, and unit assignments.
        </p>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 animate-pulseGlow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Residents</p>
                <p className="text-2xl font-bold text-purple-900">{residentsData?.data?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 animate-pulseGlow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Residents</p>
                <p className="text-2xl font-bold text-green-900">
                  {residentsData?.data?.filter(r => r.association_status === 'active').length || 0}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-pulseGlow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {viewDoctorsOnly ? "Doctors" : "Primary Residents"}
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {viewDoctorsOnly 
                    ? residentsData?.data?.filter(r => r.specialisation && r.specialisation.trim() !== '').length || 0
                    : residentsData?.data?.filter(r => r.is_primary === 1).length || 0
                  }
                </p>
              </div>
              {viewDoctorsOnly ? (
                <Stethoscope className="h-8 w-8 text-blue-600" />
              ) : (
                <Star className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search residents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view-doctors"
                  checked={viewDoctorsOnly}
                  onCheckedChange={(checked) => setViewDoctorsOnly(checked as boolean)}
                />
                <label
                  htmlFor="view-doctors"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
                >
                  <Stethoscope className="h-4 w-4 text-purple-600" />
                  View doctors only
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Resident
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents Table */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <UserCheck className="h-5 w-5" />
            Resident Directory
          </CardTitle>
          <CardDescription className="text-purple-700">
            {filteredResidents.length} residents found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedResidents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "Try adjusting your search criteria." : "Get started by adding residents to your building."}
              </p>
              {!searchQuery && (
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resident
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedResidents.map((resident, index) => {
                    const isDoctor = resident.specialisation && resident.specialisation.trim() !== '';
                    return (
                      <tr 
                        key={`${resident.email}-${index}`} 
                        className={`hover:bg-gray-50 transition-colors ${
                          isDoctor ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={resident.profile_image_url || ""} />
                              <AvatarFallback className={`${isDoctor ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {getInitials(resident.first_name, resident.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {resident.first_name} {resident.last_name}
                                </div>
                                {resident.is_primary === 1 && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {isDoctor && (
                                  <Stethoscope className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {resident.is_primary === 1 ? "Primary Resident" : "Secondary Resident"}
                              </div>
                              {isDoctor && (
                                <div className="text-sm font-medium text-blue-700 mt-1">
                                  {resident.specialisation}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {resident.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {resident.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Home className="h-4 w-4 mr-2 text-gray-400" />
                            {resident.unit_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(resident.association_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Resident
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Resident
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredResidents.length)} of {filteredResidents.length} residents
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
