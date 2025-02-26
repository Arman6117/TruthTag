"use client";
import { analyzeImage, type HealthReport } from "@/actions";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  Info,
  Upload,
  BarChart3,
  ArrowRight,
  Clock,
  Settings,
  ArrowDown,
} from "lucide-react";

export default function HealthAnalyzerDashboard() {
  const [productName, setProductName] = useState<string>("");
  const [netWeight, setNetWeight] = useState<string>("");
  const [country, setCountry] = useState<string>("India");
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("scanner");
  const [fileDragging, setFileDragging] = useState(false);

  useEffect(() => {
    const storedScans = localStorage.getItem("recentScans");
    if (storedScans) {
      setRecentScans(JSON.parse(storedScans));
    }
  }, []);

  const saveRecentScan = (scan: any) => {
    const updatedScans = [
      {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        productName: productName || "Unnamed Product",
        score: scan.healthScore || 0,
        country: country,
        keyFindings: scan.healthRisks?.slice(0, 2) || [],
      },
      ...recentScans,
    ].slice(0, 5);

    setRecentScans(updatedScans);
    localStorage.setItem("recentScans", JSON.stringify(updatedScans));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productName", productName);
    formData.append("netWeight", netWeight);
    formData.append("country", country);

    try {
      const result = await analyzeImage(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setHealthReport(result);
        saveRecentScan(result);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      handleImageUpload(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setFileDragging(true);
  };

  const handleDragLeave = () => {
    setFileDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-200 text-gray-800";
    if (score >= 75) return "bg-green-500 text-white";
    if (score >= 50) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const getScoreText = (score?: number) => {
    if (!score) return "Unknown";
    if (score >= 75) return "Healthy";
    if (score >= 50) return "Moderate";
    return "Concerning";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              TruthTag Health Analyzer
            </h1>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 flex items-center">
                <Settings size={16} className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow p-1 flex">
          <button
            onClick={() => setSelectedTab("scanner")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              selectedTab === "scanner"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Product Scanner
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              selectedTab === "history"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Scan History
          </button>
          <button
            onClick={() => setSelectedTab("insights")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              selectedTab === "insights"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Health Insights
          </button>
        </div>

        {/* Scanner Tab */}
        {selectedTab === "scanner" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Scanner */}
            <div className="lg:col-span-5 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Scan New Product
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Net Weight
                  </label>
                  <input
                    type="text"
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 250g, 1L"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  fileDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {loading && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Analyzing product...
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 rounded-md flex items-start">
                  <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Error analyzing product
                    </p>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-7">
              {healthReport ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {productName || "Product Analysis"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {netWeight} • {country}
                      </p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full ${getScoreColor(
                        healthReport.healthScore
                      )}`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg font-bold">
                          {healthReport.healthScore || "?"}
                        </span>
                        <span className="ml-1 text-xs">/100</span>
                      </div>
                      <div className="text-xs text-center">
                        {getScoreText(healthReport.healthScore)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                        Health Risks
                      </h3>
                      {healthReport.healthRisks &&
                      healthReport.healthRisks.length > 0 ? (
                        <ul className="space-y-2">
                          {healthReport.healthRisks.map((risk, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                                <span className="text-xs text-red-800">
                                  {index + 1}
                                </span>
                              </span>
                              <span className="text-sm text-gray-700">
                                {risk}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No significant health risks identified
                        </p>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Info className="w-4 h-4 mr-2 text-blue-500" />
                        Consumption Guidance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Recommended Frequency
                            </p>
                            <p className="text-sm font-medium">
                              {healthReport.consumptionFrequency ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Age Suitability
                          </p>
                          <p className="text-sm">
                            {healthReport.ageSuitability || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Warning Labels
                          </p>
                          {healthReport.warningLabels &&
                          healthReport.warningLabels.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {healthReport.warningLabels.map(
                                (warning, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                  >
                                    {warning}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No warning labels
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                      Healthier Alternatives
                    </h3>

                    {healthReport.alternatives &&
                    healthReport.alternatives.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {healthReport.alternatives.map((alternative, index) => (
                          <div
                            key={index}
                            className="flex items-start p-2 bg-green-50 rounded-md"
                          >
                            <Check className="flex-shrink-0 w-4 h-4 text-green-600 mt-0.5 mr-2" />
                            <span className="text-sm">{alternative}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No alternatives suggested
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <details className="group">
                      <summary className="list-none flex items-center cursor-pointer">
                        <div className="font-medium text-gray-900 flex items-center">
                          <ArrowDown className="w-4 h-4 mr-2 group-open:rotate-180 transition-transform" />
                          Extracted Text from Packaging
                        </div>
                      </summary>
                      <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-line">
                        {healthReport.extractedText || "No text extracted"}
                      </div>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Analysis Yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Upload a product image to see a detailed health analysis
                    with score, risks, and recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === "history" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Scans
              </h2>
            </div>

            {recentScans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Country
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Health Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Key Findings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentScans.map((scan) => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {scan.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                              scan.score
                            )}`}
                          >
                            {scan.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {scan.keyFindings.join(", ") ||
                            "No significant findings"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No scan history
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by scanning your first product
                </p>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {selectedTab === "insights" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Health Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Common Ingredients to Watch
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-red-800">1</span>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        High Fructose Corn Syrup
                      </span>
                      <p className="text-xs text-gray-500">
                        Associated with obesity and metabolic issues
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-red-800">2</span>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Trans Fats
                      </span>
                      <p className="text-xs text-gray-500">
                        Increases risk of heart disease and stroke
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-red-800">3</span>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Artificial Colors
                      </span>
                      <p className="text-xs text-gray-500">
                        May cause hyperactivity in sensitive individuals
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  India-Specific Guidelines
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">FSSAI Standards:</span> All
                    packaged foods in India must display the FSSAI license
                    number
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Sugar Content:</span> The WHO
                    recommends limiting sugar intake to less than 10% of total
                    energy
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Trans Fat:</span> India has
                    set a goal to eliminate trans fats by 2022
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Understanding Nutrition Labels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Serving Size
                  </h4>
                  <p className="text-xs text-blue-700">
                    Pay attention to the serving size when comparing nutrition
                    facts
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Daily Values
                  </h4>
                  <p className="text-xs text-blue-700">
                    5% or less is low, 20% or more is high for nutrients
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Ingredient List
                  </h4>
                  <p className="text-xs text-blue-700">
                    Ingredients are listed in order of predominance by weight
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
