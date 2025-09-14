
export interface WasteObject {
  id: number;
  name: string;
  categories: string[];
  category_confidences: Record<string, number>;
  confidence: number;
  bbox: [number, number, number, number] | null;
  recommended_disposal: string;
  uncertain: boolean;
}

export interface WasteAnalysisSummary {
  counts: Record<string, number>;
  image_confidence: number;
}

export interface WasteAnalysisResponse {
  image_id: string;
  objects: WasteObject[];
  summary: WasteAnalysisSummary;
}
