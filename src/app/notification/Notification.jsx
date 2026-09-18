import React, { useState } from "react";
import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateNotificationDialog from "./create-notification";
import ViewNotificationDialog from "./view-notification";

const NOTIFICATION_IMAGE_BASE_URL =
  "https://businessboosters.club/public/images/notification_images/";

const NO_IMAGE_URL = "/img/no_image.jpg";

const Notification = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);

  const queryClient = useQueryClient();

  const getImageUrl = (img) => {
    if (!img || img === "null" || img === "undefined" || img === "") {
      return NO_IMAGE_URL;
    }
    const imgStr = String(img).trim();
    if (
      imgStr.startsWith("http://") ||
      imgStr.startsWith("https://") ||
      imgStr.startsWith("data:") ||
      imgStr.startsWith("blob:")
    ) {
      return imgStr;
    }
    const cleanPath = imgStr.replace(
      /^\/?(public\/)?(images\/)?(notification_images\/)?/,
      ""
    );
    return `${NOTIFICATION_IMAGE_BASE_URL}${cleanPath}`;
  };

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: NOTIFICATION_API.fetch,
    queryKey: ["notification"],
  });

  const { trigger: deleteNotification, loading: isDeleting } = useApiMutation();

  const notificationData =
    data?.notification ||
    data?.notifications ||
    data?.data ||
    (Array.isArray(data) ? data : []);

  const handleOpenAdd = () => {
    setOpenDialog(true);
  };

  const handleOpenView = (id) => {
    setSelectedId(id);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return;
    try {
      const res = await deleteNotification({
        url: NOTIFICATION_API.delete(idToDelete),
        method: "delete",
      });

      if (
        res?.code === 200 ||
        res?.status === "success" ||
        res?.status === 200 ||
        res?.success
      ) {
        toast.success(
          res?.msg || res?.message || "Notification deleted successfully"
        );
        queryClient.invalidateQueries(["notification"]);
      } else {
        toast.error(
          res?.message || res?.msg || "Failed to delete notification"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete notification"
      );
    } finally {
      setOpenDeleteDialog(false);
      setIdToDelete(null);
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
      header: "Image",
      accessorKey: "notification_image",
      enableSorting: false,
      cell: ({ row }) => {
        const rawImage =
          row.original.notification_image ||
          row.original.image ||
          row.original.notification_img;
        const imageSrc = getImageUrl(rawImage);
        return (
          <a
            href={imageSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="block group w-fit"
            title="Click to view full image"
          >
            <img
              src={imageSrc}
              alt="Notification"
              className="h-10 w-10 object-cover rounded-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform cursor-pointer bg-gray-50 dark:bg-gray-800"
              onError={(e) => {
                if (e.currentTarget.src !== NO_IMAGE_URL) {
                  e.currentTarget.src = NO_IMAGE_URL;
                }
              }}
            />
          </a>
        );
      },
    },
    {
      header: "Heading",
      accessorKey: "notification_heading",
      cell: ({ row }) => {
        const heading =
          row.original.notification_heading ||
          row.original.notification_title ||
          row.original.title ||
          row.original.name ||
          "-";
        return <div className="font-medium text-gray-900">{heading}</div>;
      },
    },
    {
      header: "P-Type",
      accessorKey: "notification_p_type",
      cell: ({ row }) => {
        const pType =
          row.original.notification_p_type ||
          row.original.p_type ||
          "-";
        return <div className="text-gray-700 whitespace-nowrap">{pType}</div>;
      },
    },
    // {
    //   header: "Date",
    //   accessorKey: "notification_date",
    //   cell: ({ row }) => {
    //     const date =
    //       row.original.notification_date ||
    //       row.original.created_at ||
    //       row.original.date ||
    //       "-";
    //     return <div className="text-gray-500 whitespace-nowrap">{date}</div>;
    //   },
    // },
    {
      header: "Description",
      accessorKey: "notification_description",
      cell: ({ row }) => {
        const message =
          row.original.notification_description ||
          row.original.notification_message ||
          row.original.notification_desc ||
          row.original.message ||
          row.original.description ||
          "-";
        return (
          <div className="max-w-[350px] truncate" title={message}>
            {message}
          </div>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenView(row.original.id)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleDeleteClick(
                      row.original?.id || row.original?.notification_id
                    )
                  }
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
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
    <>
      <div className="p-5 space-y-4">
        <DataTable
          data={notificationData}
          columns={columns}
          pageSize={10}
          searchPlaceholder="Search Notifications..."
          backendPagination={false}
          addButton={{
            onClick: handleOpenAdd,
            label: "Add Notification",
          }}
        />
      </div>

      {/* Create Dialog */}
      <CreateNotificationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />

      {/* View By ID Dialog */}
      <ViewNotificationDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Notification;
