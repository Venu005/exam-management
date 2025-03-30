"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "CSE", value: 35, color: "#ff6384" },
  { name: "ECE", value: 25, color: "#36a2eb" },
  { name: "ME", value: 20, color: "#ffce56" },
  { name: "Civil", value: 15, color: "#4bc0c0" },
  { name: "Others", value: 5, color: "#9966ff" },
];

export default function ExamStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Distribution</CardTitle>
        <CardDescription>Distribution of exams by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
