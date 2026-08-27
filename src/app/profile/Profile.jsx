import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/image-upload/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useApiMutation } from "@/hooks/useApiMutation";
import { PROFILE } from "@/constants/apiConstants";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  Calendar,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/loader/loader";
import { Global } from "recharts";

const initialState = {
  name: "",
  gender: "",
  dob: "",
  image: null,
  email: "",
  mobile: "",
  whatsapp_number: "",
  spouse_name: "",
  doa: "",
  company: "",
  company_short: "",
  category: "",
  website: "",
  experience: "",
  landline: "",
  area: "",
  address: "",
  product: "",
  profile_tag: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialState);
  const [initialData, setInitialData] = useState(initialState);
  const [id, setId] = useState(null);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({ image: "" });
  const [isFetching, setIsFetching] = useState(false);

  const { trigger: fetchProfile } = useApiMutation();
  const { trigger: updateProfile, loading } = useApiMutation();
  const queryClient = useQueryClient();

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  const ymdMatch = str.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  }
  const dmyMatch = str.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }
  return str;
};

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsFetching(true);
        const res = await fetchProfile({
          url: PROFILE.profile,
          method: "get",
        });
        const profileData = res?.profile || res?.user || res?.data || res?.new_user;
        if (profileData) {
          const fetchedData = { ...initialState };
          Object.keys(initialState).forEach((key) => {
            if (key !== "image") {
              // Convert null/undefined to empty strings to match input values
              fetchedData[key] =
                profileData[key] !== null && profileData[key] !== undefined
                  ? String(profileData[key])
                  : "";
            }
          });

          if (fetchedData.gender) fetchedData.gender = fetchedData.gender.toUpperCase();
          if (fetchedData.dob) fetchedData.dob = formatDateForInput(fetchedData.dob);
          if (fetchedData.doa) fetchedData.doa = formatDateForInput(fetchedData.doa);

          setId(profileData.id);
          setInitialData(fetchedData);
          setFormData(fetchedData);

          if (profileData.image) {
            setPreview({
              image: `https://businessboosters.club/public/images/user_images/${profileData.image}`,
            });
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsFetching(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow numbers only for specific fields
    if (
      (name === "experience" || name === "landline") &&
      value &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (fieldName, file) => {
    if (file) {
      setFormData({ ...formData, [fieldName]: file });
      const url = URL.createObjectURL(file);
      setPreview({ ...preview, [fieldName]: url });
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const handleRemoveImage = (fieldName) => {
    setFormData({ ...formData, [fieldName]: null });
    setPreview({ ...preview, [fieldName]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.whatsapp_number)
      newErrors.whatsapp_number = "WhatsApp number is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.category)
      newErrors.category = "Business category is required";
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.product)
      newErrors.product = "Products/Services details are required";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      const errorFields = Object.keys(newErrors).join(", ");
      toast.error(`Please fill in required fields: ${errorFields}`);
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image") {
        if (
          formData.image &&
          typeof formData.image === "object" &&
          (formData.image instanceof File ||
            formData.image instanceof Blob ||
            formData.image.name)
        ) {
          formDataObj.append("image", formData.image);
        }
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });
    formDataObj.append("_method", "PUT");

    try {
      const updateUrl = id
        ? `${PROFILE.updateprofile}/${id}`
        : PROFILE.updateprofile;
      const res = await updateProfile({
        url: updateUrl,
        method: "post",
        data: formDataObj,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        res?.code === 200 ||
        res?.code === 201 ||
        res?.code === "200" ||
        res?.status === "success" ||
        res?.status === true ||
        res?.success === true ||
        res?.status === 200
      ) {
        toast.success(res?.message || res?.msg || "Profile Updated Successfully");
        queryClient.invalidateQueries(["active-users"]);
        queryClient.invalidateQueries(["active-members"]);
        queryClient.invalidateQueries(["profile"]);
        setInitialData(formData);
      } else {
        const msg = res?.message || res?.msg || res?.error || (typeof res === "string" ? res : "Failed to update profile");
        toast.error(msg);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const serverData = error?.response?.data;
      let serverMsg = "Error updating profile";
      if (serverData) {
        if (serverData.message) serverMsg = serverData.message;
        else if (serverData.msg) serverMsg = serverData.msg;
        else if (serverData.error) serverMsg = serverData.error;
        else if (serverData.errors && typeof serverData.errors === "object") {
          serverMsg = Object.values(serverData.errors).flat().join(", ");
        } else if (typeof serverData === "string") {
          serverMsg = serverData;
        }
      } else if (error?.message) {
        serverMsg = error.message;
      }
      toast.error(serverMsg);
    }
  };

  const hasChanges = Object.keys(formData).some(
    (key) => formData[key] !== initialData[key],
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="max-w-8xl mx-auto shadow-lg border-t-4 border-t-primary">
        <CardContent>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-8"
          >
            <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-8 border-b border-gray-200 py-5">
              <div className="relative w-fit">
                <ImageUpload
                  id="image"
                  label="Profile Image"
                  previewImage={preview.image}
                  onFileChange={(e) =>
                    handleImageChange("image", e.target.files?.[0])
                  }
                  onRemove={() => handleRemoveImage("image")}
                  error={errors.image}
                  format="WEBP"
                  maxSize={5}
                  allowedExtensions={["webp", "jpg", "jpeg", "png"]}
                />
              </div>
              <div className="flex flex-col justify-center text-center md:text-left">
                <div className="text-2xl text-primary uppercase font-bold">
                  Profile Information
                </div>
                <p className="text-sm text-muted-foreground">
                  Update profile information
                </p>
              </div>
              <div className="flex justify-end gap-3 items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="cursor-pointer">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Profile
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <User size={18} />
                  Full Name *
                </Label>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <User size={18} />
                  Gender *
                </Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(v) => handleSelectChange("gender", v)}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Mail size={18} />
                  Email *
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Phone size={18} />
                  Mobile Number *
                </Label>
                <Input
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <MessageCircle size={18} />
                  WhatsApp Number *
                </Label>
                <Input
                  name="whatsapp_number"
                  maxLength={10}
                  value={formData.whatsapp_number || ""}
                  onChange={handleChange}
                  placeholder="Enter your WhatsApp number"
                  className={errors.whatsapp_number ? "border-red-500" : ""}
                />
                {errors.whatsapp_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.whatsapp_number}
                  </p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Calendar size={18} />
                  Date of Birth *
                </Label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className={errors.dob ? "border-red-500" : ""}
                />
                {errors.dob && (
                  <p className="text-sm text-red-500 mt-1">{errors.dob}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <User size={18} />
                  Spouse Name
                </Label>
                <Input
                  name="spouse_name"
                  value={formData.spouse_name || ""}
                  onChange={handleChange}
                  placeholder="Enter your spouse name"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Calendar size={18} />
                  Anniversary Date
                </Label>
                <Input
                  type="date"
                  name="doa"
                  value={formData.doa || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Briefcase size={18} />
                  Company Name *
                </Label>
                <Input
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className={errors.company ? "border-red-500" : ""}
                />
                {errors.company && (
                  <p className="text-sm text-red-500 mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Briefcase size={18} />
                  Company Short Name
                </Label>
                <Input
                  name="company_short"
                  value={formData.company_short || ""}
                  onChange={handleChange}
                  placeholder="Enter your company short name"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Building2 size={18} />
                  Business Category *
                </Label>
                <Input
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  placeholder="Enter your business category"
                  className={errors.category ? "border-red-500" : ""}
                />
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Globe2 size={18} />
                  Website
                </Label>
                <Input
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  placeholder="Enter your website"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Briefcase size={18} />
                  Experience
                </Label>
                <Input
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  placeholder="Enter your experience"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Phone size={18} />
                  Landline Number
                </Label>
                <Input
                  name="landline"
                  maxLength={11}
                  value={formData.landline || ""}
                  onChange={handleChange}
                  placeholder="Enter your landline number"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <MapPin size={18} />
                  Area *
                </Label>
                <Input
                  name="area"
                  value={formData.area || ""}
                  onChange={handleChange}
                  placeholder="Enter your area"
                  className={errors.area ? "border-red-500" : ""}
                />
                {errors.area && (
                  <p className="text-sm text-red-500 mt-1">{errors.area}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <MapPin size={18} />
                  Address *
                </Label>
                <Textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`${errors.address ? "border-red-500" : ""} h-20`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Briefcase size={18} />
                  Products / Services *
                </Label>
                <Textarea
                  name="product"
                  placeholder="Type all products or services separated by comma"
                  value={formData.product || ""}
                  onChange={handleChange}
                  className={`${errors.product ? "border-red-500" : ""} h-20`}
                />
                {errors.product && (
                  <p className="text-sm text-red-500 mt-1">{errors.product}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-1">
                  <Tag size={18} />
                  Profile Tag
                </Label>
                <Textarea
                  name="profile_tag"
                  placeholder="Type all products or services related tags separated by comma (e.g., CCTV - Security System, Camera)"
                  value={formData.profile_tag || ""}
                  onChange={handleChange}
                  className={`h-20`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="lg" className="px-8 cursor-pointer">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
