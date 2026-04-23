import { useState } from "react";
import axios from "axios";
import { Flower, IdentifyFlowerResponse, Plant } from "@shared/api";
import { Upload, Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function IdentifyFlower() {
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [identifiedFlower, setIdentifiedFlower] = useState<Flower | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!description.trim() && !uploadedImage) {
      setError("Please upload an image or enter a description");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post<IdentifyFlowerResponse>(
        "/api/flowers/identify",
        { description: description.trim() || "Image upload detected" }
      );

      setIdentifiedFlower(response.data.flower);
      setConfidence(Math.round(response.data.confidence * 100));
    } catch (err) {
      setError("Failed to identify flower. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlants = async () => {
    if (!identifiedFlower) return;

    try {
      setLoading(true);
      setError("");

      const plantName = prompt("Enter a name for this plant:");
      if (!plantName) return;

      const waterFrequency = prompt(
        "How many days between watering?",
        identifiedFlower.waterNeed === "low"
          ? "7"
          : identifiedFlower.waterNeed === "high"
            ? "2"
            : "3"
      );

      if (!waterFrequency) return;

      await axios.post("/api/plants", {
        name: plantName,
        flowerId: identifiedFlower.id,
        waterFrequency: parseInt(waterFrequency),
      });

      setSuccess(`${plantName} added to your collection!`);
      setIdentifiedFlower(null);
      setDescription("");
      setUploadedImage(null);
      setConfidence(0);
    } catch (err) {
      setError("Failed to add plant. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDescription("");
    setUploadedImage(null);
    setIdentifiedFlower(null);
    setConfidence(0);
    setError("");
    setSuccess("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {!identifiedFlower ? (
        <Card className="bg-white border-purple-200">
          <CardHeader>
            <CardTitle>Identify Your Flower</CardTitle>
            <CardDescription>
              Upload an image or describe your flower to get identification details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Area */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Step 1: Upload Image (Optional)</Label>
              <div
                className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded flower"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-green-600 font-medium">Image selected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-purple-400" />
                    <p className="text-gray-900 font-medium">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-gray-500">or click to select</p>
                  </div>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold">
                Step 2: Describe the Flower
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the flower... e.g., 'Red petals, fragrant, looks like a rose'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500">
                Include details about color, shape, size, and scent
              </p>
            </div>

            {/* Identify Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleIdentify}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Identifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Identify Flower
                  </>
                )}
              </Button>
              {uploadedImage && (
                <Button
                  onClick={() => setUploadedImage(null)}
                  variant="outline"
                  className="border-purple-200"
                >
                  Clear Image
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Results Card */
        <Card className="bg-white border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Identification Result</span>
              <span className="text-lg font-semibold text-blue-600">
                {confidence}% Match
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Flower Details */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold text-purple-600">
                  {identifiedFlower.name}
                </h3>
                <p className="text-sm text-gray-600 italic mt-1">
                  {identifiedFlower.scientificName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Family
                  </Label>
                  <p className="text-gray-900 font-medium mt-1">
                    {identifiedFlower.family}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Water Needs
                  </Label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        identifiedFlower.waterNeed === "low"
                          ? "bg-green-100 text-green-800"
                          : identifiedFlower.waterNeed === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {identifiedFlower.waterNeed.charAt(0).toUpperCase() +
                        identifiedFlower.waterNeed.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-600 uppercase">
                  Description
                </Label>
                <p className="text-gray-700 mt-2 leading-relaxed">
                  {identifiedFlower.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleAddToPlants}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to My Plants
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-purple-200"
              >
                Identify Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
