import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
  Heading,
} from "@react-email/components";

interface ExamScheduleEmailProps {
  studentName: string;
  timetable: {
    title: string;
    year: number;
    branch: string;
    exams: Array<{
      subject: string;
      date: string;
      timeSlot: string;
    }>;
  };
}

export function ExamScheduleEmail({
  studentName,
  timetable,
}: ExamScheduleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {timetable.year.toString()} Year Exam Schedule</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Exam Schedule Notification</Heading>
          <Text style={text}>Hello {studentName},</Text>
          <Text style={text}>
            Here's your exam schedule for {timetable.title} ({timetable.branch}
            ):
          </Text>

          <Section style={section}>
            {timetable.exams.map((exam, index) => (
              <div key={index} style={examCard}>
                <Text style={subject}>{exam.subject}</Text>
                <Text style={details}>
                  Date: {new Date(exam.date).toLocaleDateString()}
                </Text>
                <Text style={details}>Time: {exam.timeSlot}</Text>
              </div>
            ))}
          </Section>

          <Text style={footer}>Best of luck with your exams! 🚀</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f4",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#333333",
  fontSize: "24px",
  marginBottom: "20px",
};

const text = {
  color: "#555555",
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "10px",
};

const section = {
  marginTop: "20px",
};

const examCard = {
  border: "1px solid #dddddd",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
};

const subject = {
  fontWeight: "bold",
  fontSize: "18px",
  marginBottom: "5px",
};

const details = {
  color: "#777777",
  fontSize: "14px",
  marginBottom: "3px",
};

const footer = {
  marginTop: "20px",
  fontStyle: "italic",
  color: "#333333",
};
