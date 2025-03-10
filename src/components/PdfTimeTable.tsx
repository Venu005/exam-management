"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

Font.register({
  family: "Ubuntu",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
  ],
});
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Ubuntu",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#1a365d",
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableHeader: {
    backgroundColor: "#f7fafc",
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontWeight: "bold",
  },
  tableCell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    color: "#2d3748",
  },
  col1: { width: "35%" },
  col2: { width: "15%" },
  col3: { width: "25%" },
  col4: { width: "25%" },
});

export default function PdfTimetable({ timetable }: { timetable: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{timetable.title}</Text>
          <Text style={styles.subtitle}>
            {format(new Date(timetable.startDate), "dd MMM yyyy")} -{" "}
            {format(new Date(timetable.endDate), "dd MMM yyyy")}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col1]}>Subject</Text>
            <Text style={[styles.tableCell, styles.col2]}>Code</Text>
            <Text style={[styles.tableCell, styles.col3]}>Date</Text>
            <Text style={[styles.tableCell, styles.col4]}>Time Slot</Text>
          </View>

          {/* Table Rows */}
          {timetable.exams.map((exam: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {exam.subject}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {exam.code || "N/A"}
              </Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {format(new Date(exam.date), "dd MMM yyyy")}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {exam.timeSlot}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
