import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NOTIFICATION_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NOTIFICATION_IMAGE_BASE_URL =
  "https://businessboosters.club/public/images/notification_images/";

const ViewNotificationDialog = ({ open, onClose, id }) => {
  const [notification, setNotification] = useState(null);
  const { trigger: fetchNotificationById, loading } = useApiMutation();

  const getImageUrl = (img) => {
    if (!img) return "";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    return `${NOTIFICATION_IMAGE_BASE_URL}${img}`;
  };

  useEffect(() => {
    if (open && id) {
      const getDetail = async () => {
        try {
          const res = await fetchNotificationById({
            url: NOTIFICATION_API.byId(id),
            method: "get",
          });
          const detail =
            res?.data?.notification ||
            res?.notification ||
            res?.data ||
            res;
          setNotification(detail);
        } catch (error) {
          toast.error("Failed to fetch notification details");
        }
      };
      getDetail();
    } else {
      setNotification(null);
    }
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notification ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border">
              <div>
                <p className="text-gray-500">P-Type</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {notification.notification_p_type || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {notification.notification_date ||
                    notification.created_at ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {Number(notification.notification_type_id) === 1
                    ? "User"
                    : Number(notification.notification_type_id) === 2
                    ? "Admin"
                    : notification.notification_type_id ?? "-"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Heading</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {notification.notification_heading || "-"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line bg-white dark:bg-gray-900 p-3 rounded border">
                {notification.notification_description ||
                  "No description provided."}
              </p>
            </div>

            {notification.notification_image ? (
              <div>
                <p className="text-sm text-gray-500 mb-1">Image</p>
                <div className="rounded-lg overflow-hidden border max-w-full">
                  <img
                    src={getImageUrl(notification.notification_image)}
                    alt={notification.notification_heading || "Notification"}
                    className="w-full max-h-60 object-contain bg-gray-100 dark:bg-gray-800"
                    onError={(e) => {
                      if (e.currentTarget.src !== "/img/no_image.jpg") {
                        e.currentTarget.src = "/img/no_image.jpg";
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-1">Image</p>
                <div className="rounded-lg overflow-hidden border max-w-full">
                  <img
                    src="/img/no_image.jpg"
                    alt="No Image"
                    className="w-full max-h-48 object-contain bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No notification data found.
          </p>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotificationDialog;
