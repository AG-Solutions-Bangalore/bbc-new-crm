import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { USER_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import {
  ChevronDown,
  Edit,
  Edit2,
  Edit2Icon,
  Edit3,
  Eye,
  Loader2,
  LogOut,
  PenIcon,
  PenLine,
  PenOff,
  PenTool,
  RefreshCw,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const ActiveUser = () => {
  const [openGoldDialog, setOpenGoldDialog] = useState(false);
  const [userIdForGold, setUserIdForGold] = useState(null);
  const [openInactivateDialog, setOpenInactivateDialog] = useState(false);
  const [userIdForInactivate, setUserIdForInactivate] = useState(null);
  const [openSubGroupDialog, setOpenSubGroupDialog] = useState(false);
  const [userIdForSubGroup, setUserIdForSubGroup] = useState(null);
  const [newSubGroup, setNewSubGroup] = useState("");
  const [openGroupTypeDialog, setOpenGroupTypeDialog] = useState(false);
  const [userIdForGroupType, setUserIdForGroupType] = useState(null);
  const [selectedPTypes, setSelectedPTypes] = useState([]);
  const [pTypes, setPTypes] = useState([]);
  const [pTypesLoading, setPTypesLoading] = useState(false);
  const [openJoiningDetailsDialog, setOpenJoiningDetailsDialog] =
    useState(false);
  const [userIdForJoiningDetails, setUserIdForJoiningDetails] = useState(null);
  const [joiningDate, setJoiningDate] = useState("");
  const [whoJoinedId, setWhoJoinedId] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: USER_API.active,
    queryKey: ["active-users"],
  });

  const { trigger: updateStatus, loading: isUpdating } = useApiMutation();

  const activeUserData = data?.active || [];

  const handleInactivateClick = (id) => {
    setUserIdForInactivate(id);
    setOpenInactivateDialog(true);
  };

  const handleUpdateSubGroup = (user) => {
    setUserIdForSubGroup(user.id);
    setNewSubGroup(user.user_group || "");
    setOpenSubGroupDialog(true);
  };

  const fetchPTypes = async () => {
    try {
      setPTypesLoading(true);
      const res = await updateStatus({
        url: USER_API.fetchPType,
        method: "get",
      });
      const data = res?.data || res || [];
      setPTypes(data);
    } catch (error) {
      toast.error("Failed to fetch group types");
    } finally {
      setPTypesLoading(false);
    }
  };

  const handleUpdateGroupType = (user) => {
    setUserIdForGroupType(user.id);
    const userPTypes = user.p_type
      ? user.p_type.split(",").map((s) => s.trim())
      : [];
    setSelectedPTypes(userPTypes);
    setOpenGroupTypeDialog(true);
    if (pTypes.length === 0) {
      fetchPTypes();
    }
  };

  const handleUpdateJoiningDetails = (user) => {
    setUserIdForJoiningDetails(user.id);
    setJoiningDate(user.user_new_joining_date || "");
    setWhoJoinedId(user.user_new_joining_id || "");
    setOpenJoiningDetailsDialog(true);
  };

  const handleJoiningDetailsConfirm = async () => {
    try {
      await updateStatus({
        url: USER_API.updateJoiningDetails(userIdForJoiningDetails),
        method: "put",
        data: {
          user_new_joining_date: joiningDate,
          user_new_joining_id: whoJoinedId,
        },
      });
      toast.success("Joining details updated successfully");
      queryClient.invalidateQueries(["active-users"]);
      setOpenJoiningDetailsDialog(false);
    } catch (error) {
      toast.error("Failed to update joining details");
    }
  };

  const togglePType = (type) => {
    setSelectedPTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleGroupTypeConfirm = async () => {
    if (selectedPTypes.length === 0) {
      toast.error("Please select at least one group type");
      return;
    }
    try {
      await updateStatus({
        url: USER_API.updatePType(userIdForGroupType),
        method: "put",
        data: { p_type: selectedPTypes.join(",") },
      });
      toast.success("Group Type updated successfully");
      queryClient.invalidateQueries(["active-users"]);
      setOpenGroupTypeDialog(false);
    } catch (error) {
      console.log("error is:", error);
      toast.error("Failed to update Group Type");
    }
  };

  const handleSubGroupConfirm = async () => {
    if (!newSubGroup.trim()) {
      toast.error("Sub Group name cannot be empty");
      return;
    }
    try {
      await updateStatus({
        url: USER_API.updateSubGroup(userIdForSubGroup),
        method: "put",
        data: { user_group: newSubGroup },
      });
      toast.success("Sub Group updated successfully");
      queryClient.invalidateQueries(["active-users"]);
      setOpenSubGroupDialog(false);
    } catch (error) {
      toast.error("Failed to update Sub Group");
    }
  };

  const handleInactivateConfirm = async () => {
    try {
      await updateStatus({
        url: USER_API.inactivate(userIdForInactivate),
        method: "put",
      });
      toast.success("User inactivated successfully");
      queryClient.invalidateQueries(["active-users"]);
    } catch (error) {
      toast.error("Failed to inactivate user");
    } finally {
      setOpenInactivateDialog(false);
      setUserIdForInactivate(null);
    }
  };

  const handleGoldClick = (id) => {
    setUserIdForGold(id);
    setOpenGoldDialog(true);
  };

  const handleGoldConfirm = async () => {
    try {
      await updateStatus({
        url: USER_API.makeGold(userIdForGold),
        method: "put",
      });
      toast.success("User promoted to Gold status");
      queryClient.invalidateQueries(["active-users"]);
    } catch (error) {
      toast.error("Failed to update user details");
    } finally {
      setOpenGoldDialog(false);
      setUserIdForGold(null);
    }
  };

  const columns = [
    {
      header: "SL No",
      accessorKey: "slNo",
      enableSorting: false,
      cell: ({ row }) => row.index + 1,
      width: 60,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.name}</span>
          {row.original.details_view === 1 && (
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      header: "Company",
      accessorKey: "company",
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
    },
    {
      header: "Area",
      accessorKey: "area",
    },
    {
      header: "Group",
      accessorKey: "p_type",
    },
    {
      header: "Sub Group",
      accessorKey: "user_group",
    },
    {
      header: "Joined Date",
      accessorKey: "user_new_joining_date",
    },
    {
      header: "Who Joined",
      accessorKey: "user_new_joining_id",
      cell: ({ row }) => {
        const joiningId = row.original.user_new_joining_id;
        if (!joiningId) {
          return <span>-</span>;
        }
        const referrer = activeUserData.find((u) => u.id == joiningId);
        return <span>{referrer ? referrer.name : joiningId}</span>;
      },
    },
    {
      header: "Referral Code",
      accessorKey: "referral_code",
    },
    {
      header: "Action",
      accessorKey: "id",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInactivateClick(row.original.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Inactivate User</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateGroupType(row.original)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Update Group Type</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateSubGroup(row.original)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Update Sub Group</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateJoiningDetails(row.original)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Update Joining Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {row.original.details_view === 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGoldClick(row.original.id)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 h-8 w-8 cursor-pointer"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Make Gold User</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/user-edit?id=${row.original.id}`)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 cursor-pointer"
                >
                  <PenTool className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Profile Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
           
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <div className="p-5 w-full max-w-full min-w-0 overflow-x-hidden">
      <DataTable
        data={activeUserData}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search Active Users..."
        backendPagination={false}
      />

      {/* Gold Status Confirmation */}
      <AlertDialog open={openGoldDialog} onOpenChange={setOpenGoldDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Gold Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote this user to Gold status?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleGoldConfirm();
              }}
              className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Inactivate Confirmation */}
      <AlertDialog
        open={openInactivateDialog}
        onOpenChange={setOpenInactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Inactivation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to inactivate this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleInactivateConfirm();
              }}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Sub Group Dialog */}
      <Dialog open={openSubGroupDialog} onOpenChange={setOpenSubGroupDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Sub Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subgroup" className="text-right">
                Sub Group <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subgroup"
                value={newSubGroup}
                onChange={(e) => setNewSubGroup(e.target.value)}
                className="col-span-3"
                placeholder="Enter sub group name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenSubGroupDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubGroupConfirm} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Group Type Dialog */}
      <Dialog open={openGroupTypeDialog} onOpenChange={setOpenGroupTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Update Group Type</DialogTitle>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPTypes([])}
              className="text-red-500 hover:text-red-600"
            >
              Clear
            </Button>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Group Type</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto min-h-10 py-2"
                      disabled={pTypesLoading}
                    >
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {selectedPTypes.length > 0 ? (
                          selectedPTypes.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="text-[10px] h-5"
                            >
                              {type}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Select Groups
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <ScrollArea className="h-[200px]">
                      <div className="p-2 space-y-1">
                        {pTypesLoading ? (
                          <div className="text-center py-4 text-sm text-gray-500">
                            Loading...
                          </div>
                        ) : pTypes.length === 0 ? (
                          <div className="text-center py-4 text-sm text-gray-500">
                            No types found
                          </div>
                        ) : (
                          pTypes.map((item) => {
                            const typeValue = item.p_type || item.name || item;
                            return (
                              <div
                                key={typeValue}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                onClick={() => togglePType(typeValue)}
                              >
                                <Checkbox
                                  id={`ptype-${typeValue}`}
                                  checked={selectedPTypes.includes(typeValue)}
                                  onCheckedChange={() => togglePType(typeValue)}
                                />
                                <Label
                                  htmlFor={`ptype-${typeValue}`}
                                  className="flex-1 text-sm cursor-pointer font-medium"
                                >
                                  {typeValue}
                                </Label>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenGroupTypeDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGroupTypeConfirm} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Joining Details Dialog */}
      <Dialog
        open={openJoiningDetailsDialog}
        onOpenChange={setOpenJoiningDetailsDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Joining Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joiningDate" className="text-right">
                Joining Date
              </Label>
              <Input
                id="joiningDate"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whoJoined" className="text-right">
                Who Joined
              </Label>
              <select
                id="whoJoined"
                value={whoJoinedId}
                onChange={(e) => setWhoJoinedId(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select User</option>
                {activeUserData.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenJoiningDetailsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleJoiningDetailsConfirm} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveUser;
