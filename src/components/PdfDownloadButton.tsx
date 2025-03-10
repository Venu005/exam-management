"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import PdfTimetable from "./PdfTimeTable";
import { Loader } from "lucide-react";

export default function PDFDownloadButton({ timetable }: { timetable: any }) {
  return (
    <PDFDownloadLink
      document={<PdfTimetable timetable={timetable} />}
      fileName={`${timetable.title.replace(/\s+/g, "_")}_timetable.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading} type="button">
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader className="animate-spin h-4 w-4" />
              <span className="text-sm">Downlading</span>
            </div>
          ) : (
            "Download PDF"
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
