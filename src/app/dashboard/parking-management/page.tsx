"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  MapPin,
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ParkingManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Parking Management
        </h1>
        <p className="text-muted-foreground">
          Manage parking spaces, assignments, and vehicle registrations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76</div>
            <p className="text-xs text-muted-foreground">
              85% occupancy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Temporary holds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Parking Space
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Parking Overview Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Parking Overview</CardTitle>
            <CardDescription>
              General information about parking facilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Spaces:</span>
                <span className="text-sm text-muted-foreground">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Assigned:</span>
                <span className="text-sm text-muted-foreground">76</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Available:</span>
                <span className="text-sm text-muted-foreground">13</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Reserved:</span>
                <span className="text-sm text-muted-foreground">8</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest parking updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New assignment</p>
                  <p className="text-xs text-muted-foreground">Space A-12 to John Doe</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Space released</p>
                  <p className="text-xs text-muted-foreground">Space B-05 available</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Reservation made</p>
                  <p className="text-xs text-muted-foreground">Space C-18 for 2 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common parking management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Car className="w-4 h-4 mr-2" />
              Add Parking Space
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Assign Space
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Parking Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Parking Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Parking Zones</CardTitle>
          <CardDescription>
            Overview of different parking areas and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Zone A - Resident</h3>
                  <p className="text-sm text-muted-foreground">
                    45 spaces • 38 occupied • 7 available
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600/20 bg-green-600/5">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Available
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Zone B - Visitor</h3>
                  <p className="text-sm text-muted-foreground">
                    25 spaces • 20 occupied • 5 available
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-yellow-600 border-yellow-600/20 bg-yellow-600/5">
                  <Clock className="h-3 w-3 mr-1" />
                  Limited
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Zone C - Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    19 spaces • 18 occupied • 1 available
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-red-600 border-red-600/20 bg-red-600/5">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Full
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
          <CardDescription>
            Latest parking space assignments and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Assigned to A-12</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Today</p>
                <p className="text-xs text-muted-foreground">2:30 PM</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Jane Smith</p>
                  <p className="text-xs text-muted-foreground">Released B-05</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Yesterday</p>
                <p className="text-xs text-muted-foreground">5:15 PM</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mike Johnson</p>
                  <p className="text-xs text-muted-foreground">Reserved C-18</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">2 days ago</p>
                <p className="text-xs text-muted-foreground">10:45 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
