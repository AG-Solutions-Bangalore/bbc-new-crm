import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemoizedSelect from "@/components/common/memoized-select";
import ImageUpload from "@/components/image-upload/image-upload";
import { NOTIFICATION_API, USER_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialState = {
  notification_type_id: "",
  notification_heading: "",
  notification_description: "",
  notification_image: null,
};

const CreateNotificationDialog = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialState);
  const [selectedPTypes, setSelectedPTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [pTypes, setPTypes] = useState([]);
  const [pTypesLoading, setPTypesLoading] = useState(false);

  const { trigger: fetchPTypesTrigger } = useApiMutation();
  const { trigger: saveNotification, loading } = useApiMutation();

  useEffect(() => {
    if (open) {
      setFormData(initialState);
      setSelectedPTypes([]);
      setImagePreview("");

      const fetchPTypes = async () => {
        try {
          setPTypesLoading(true);
          const res = await fetchPTypesTrigger({
            url: USER_API.fetchPType,
            method: "get",
          });
          const list = res?.data || res || [];
          setPTypes(Array.isArray(list) ? list : []);
        } catch (error) {
          console.error("Failed to load group types", error);
        } finally {
          setPTypesLoading(false);
        }
      };
      fetchPTypes();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0] || (e instanceof File ? e : null);
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      notification_image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      notification_image: null,
    }));
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.notification_heading.trim()) {
      toast.error("Please enter notification heading");
      return;
    }

    if (!formData.notification_description.trim()) {
      toast.error("Please enter notification description");
      return;
    }

    try {
      const pTypeValue = Array.isArray(selectedPTypes)
        ? selectedPTypes.map((item) => item.value || item).join(",")
        : "";

      const formDataToSend = new FormData();
      if (formData.notification_type_id) {
        formDataToSend.append(
          "notification_type_id",
          formData.notification_type_id
        );
      }
      formDataToSend.append("notification_p_type", pTypeValue);
      formDataToSend.append(
        "notification_heading",
        formData.notification_heading
      );
      formDataToSend.append(
        "notification_description",
        formData.notification_description || ""
      );

      if (formData.notification_image) {
        formDataToSend.append(
          "notification_image",
          formData.notification_image
        );
      }

      const res = await saveNotification({
        url: NOTIFICATION_API.create,
        method: "post",
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        res?.code === 200 ||
        res?.status === "success" ||
        res?.status === 200 ||
        res?.success
      ) {
        toast.success(
          res?.msg || res?.message || "Notification created successfully"
        );
        queryClient.invalidateQueries(["notification"]);
        onClose();
      } else {
        toast.error(
          res?.message || res?.msg || "Failed to create notification"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create notification"
      );
    }
  };

  const pTypeOptions = pTypes.map((item) => {
    const val = item.p_type || item.name || String(item.id || item);
    return { value: val, label: val };
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div
            className={`grid grid-cols-1 ${
              formData.notification_type_id === "1" ? "" : "md:grid-cols-2"
            } gap-4`}
          >
            <div className="space-y-2">
              <Label htmlFor="notification_type_id">Notification Type</Label>
              <Select
                value={formData.notification_type_id}
                onValueChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    notification_type_id: val,
                  }));
                  if (val === "1") {
                    setSelectedPTypes([]);
                  }
                }}
              >
                <SelectTrigger id="notification_type_id">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">User</SelectItem>
                  <SelectItem value="2">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.notification_type_id !== "1" && (
              <div className="space-y-2">
                <Label htmlFor="notification_p_type">Notification P-Type</Label>
                <MemoizedSelect
                  isMulti
                  options={pTypeOptions}
                  value={selectedPTypes}
                  onChange={(selected) => setSelectedPTypes(selected || [])}
                  placeholder="Select P-Type(s)..."
                  isLoading={pTypesLoading}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification_heading">Heading *</Label>
            <Input
              id="notification_heading"
              name="notification_heading"
              value={formData.notification_heading}
              onChange={handleChange}
              placeholder="Enter notification heading"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification_description">Description *</Label>
            <Textarea
              id="notification_description"
              name="notification_description"
              value={formData.notification_description}
              onChange={handleChange}
              placeholder="Enter notification description..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              id="notification_image"
              label="Notification Image"
              selectedFile={formData.notification_image}
              previewImage={imagePreview}
              onFileChange={handleImageChange}
              onRemove={handleRemoveImage}
              accept="image/*"
              maxSize={5}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotificationDialog;
