"use client";

import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DownloadIcon, Loader2 } from "lucide-react";
import PdfTimetable from "./PdfTimeTable";

export default function PDFDownloadButton({ timetable }: { timetable: any }) {
  return (
    <PDFDownloadLink
      document={<PdfTimetable timetable={timetable} />}
      fileName={`${timetable.title.replace(/\s+/g, "_")}_timetable.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading} type="button">
          <DownloadIcon className="mr-2" />
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin h-4 w-4" />
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
